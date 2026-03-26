import { Link } from "wouter";
import { MapPin, Briefcase, ChevronRight, Heart, GitCompareArrows, Wifi, Zap, Star } from "lucide-react";
import type { LawyerSummary } from "@workspace/api-client-react";
import { StarRating } from "./star-rating";
import { VerifiedBadge } from "./verified-badge";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/favorites-context";
import { useCompare } from "@/contexts/compare-context";
import { motion } from "framer-motion";

function getResponseTimeBadge(avgRating: number | undefined | null) {
  const r = Number(avgRating ?? 0);
  if (r >= 4.8) return "< 1h";
  if (r >= 4.5) return "< 2h";
  return null;
}

function isOnline(id: number) {
  return id % 2 === 0;
}

function isSponsored(id: number) {
  return id <= 3;
}

export function LawyerCard({ lawyer }: { lawyer: LawyerSummary }) {
  const photoUrl = lawyer.photoUrl || `${import.meta.env.BASE_URL}images/lawyer-placeholder-1.png`;
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, toggleCompare, canAdd } = useCompare();
  const fav = isFavorite(lawyer.id);
  const inCompare = isInCompare(lawyer.id);
  const responseTime = getResponseTimeBadge(lawyer.avgRating);
  const online = isOnline(lawyer.id);
  const sponsored = isSponsored(lawyer.id);

  return (
    <div className="group relative bg-white rounded-3xl p-5 shadow-clay transition-all duration-300 hover:-translate-y-1 hover:shadow-clay-sm border border-white/40 flex flex-col h-full">

      {/* Sponsored badge */}
      {sponsored && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Destaque
        </div>
      )}

      {/* Favorite + Compare buttons */}
      <div className="absolute top-3 right-3 z-10 flex gap-1.5">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => { e.preventDefault(); toggleFavorite(lawyer.id); }}
          title={fav ? "Remover dos favoritos" : "Salvar nos favoritos"}
          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors border ${
            fav ? "bg-rose-50 border-rose-200 text-rose-500" : "bg-white border-border text-slate-400 hover:text-rose-400 hover:border-rose-200"
          }`}
        >
          <Heart className={`w-4 h-4 ${fav ? "fill-rose-500" : ""}`} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => { e.preventDefault(); toggleCompare(lawyer); }}
          title={inCompare ? "Remover da comparação" : canAdd ? "Comparar" : "Máximo de 3 advogados"}
          disabled={!inCompare && !canAdd}
          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors border ${
            inCompare
              ? "bg-primary/10 border-primary/30 text-primary"
              : canAdd
              ? "bg-white border-border text-slate-400 hover:text-primary hover:border-primary/30"
              : "bg-white border-border text-slate-200 cursor-not-allowed"
          }`}
        >
          <GitCompareArrows className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="flex gap-4 mb-4 relative z-10">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md bg-slate-100 shrink-0">
            <img
              src={photoUrl}
              alt={`Foto de ${lawyer.fullName}`}
              className="w-full h-full object-cover"
            />
          </div>
          {lawyer.isVerified && (
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5 shadow-sm">
              <VerifiedBadge />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <Link href={`/advogado/${lawyer.id}`}>
            <h3 className="font-display font-bold text-base text-foreground truncate group-hover:text-primary transition-colors">
              {lawyer.fullName}
            </h3>
          </Link>
          <div className="flex items-center text-sm text-muted-foreground mt-0.5 mb-2">
            <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
            <span className="truncate">{lawyer.city}, {lawyer.state}</span>
          </div>
          <StarRating rating={lawyer.avgRating} totalReviews={lawyer.totalReviews} />
        </div>
      </div>

      {/* Badges */}
      {(online || responseTime) && (
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {online && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Wifi className="w-2.5 h-2.5" /> Atende online
            </span>
          )}
          {responseTime && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
              <Zap className="w-2.5 h-2.5" /> Responde em {responseTime}
            </span>
          )}
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-start gap-1.5 text-sm text-slate-600 mb-3 line-clamp-2">
          <Briefcase className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
          <p>{lawyer.bio}</p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {lawyer.specialties.slice(0, 3).map((spec) => (
            <span key={spec.id} className="inline-flex text-xs font-medium px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-100">
              {spec.name}
            </span>
          ))}
          {lawyer.specialties.length > 3 && (
            <span className="inline-flex text-xs font-medium px-2 py-1 rounded-md bg-slate-50 text-slate-500">
              +{lawyer.specialties.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="text-sm">
          {lawyer.hourlyRateMin ? (
            <div>
              <span className="text-xs text-muted-foreground block">Consulta a partir de</span>
              <span className="font-bold text-foreground">R$ {lawyer.hourlyRateMin}</span>
            </div>
          ) : (
            <div>
              <span className="text-xs text-muted-foreground block">Experiência</span>
              <span className="font-semibold text-foreground">{lawyer.yearsExperience} anos</span>
            </div>
          )}
        </div>
        <Button asChild variant="ghost" className="rounded-xl font-semibold text-primary hover:bg-primary/5 hover:text-primary pl-4 pr-3">
          <Link href={`/advogado/${lawyer.id}`}>
            Ver Perfil <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
