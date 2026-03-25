import { Link } from "wouter";
import { MapPin, Briefcase, ChevronRight } from "lucide-react";
import type { LawyerSummary } from "@workspace/api-client-react";
import { StarRating } from "./star-rating";
import { VerifiedBadge } from "./verified-badge";
import { Button } from "@/components/ui/button";

export function LawyerCard({ lawyer }: { lawyer: LawyerSummary }) {
  // Use a fallback if photoUrl is null
  const photoUrl = lawyer.photoUrl || `${import.meta.env.BASE_URL}images/lawyer-placeholder-1.png`;

  return (
    <div className="group relative bg-white rounded-3xl p-5 shadow-clay transition-all duration-300 hover:-translate-y-1 hover:shadow-clay-sm border border-white/40 flex flex-col h-full">
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
        
        <div className="flex-1 min-w-0">
          <Link href={`/advogado/${lawyer.id}`}>
            <h3 className="font-display font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
              {lawyer.fullName}
            </h3>
          </Link>
          <div className="flex items-center text-sm text-muted-foreground mt-1 mb-2">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            <span className="truncate">{lawyer.city}, {lawyer.state}</span>
          </div>
          <StarRating rating={lawyer.avgRating} totalReviews={lawyer.totalReviews} />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-start gap-1.5 text-sm text-slate-600 mb-4 line-clamp-2">
          <Briefcase className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
          <p>{lawyer.bio}</p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
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
