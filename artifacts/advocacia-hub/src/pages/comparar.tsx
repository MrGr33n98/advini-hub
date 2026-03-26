import { Layout } from "@/components/layout";
import { useCompare } from "@/contexts/compare-context";
import { Link } from "wouter";
import { GitCompareArrows, MapPin, Star, CheckCircle2, X, Search, Briefcase, Languages, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { VerifiedBadge } from "@/components/verified-badge";

function Cell({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`p-4 text-center text-sm border-b border-border last:border-0 ${highlight ? "bg-primary/5 font-semibold text-primary" : "text-slate-700"}`}>
      {children}
    </div>
  );
}

function LabelCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 text-sm font-semibold text-slate-500 border-b border-border last:border-0 bg-slate-50">
      {children}
    </div>
  );
}

export default function CompararPage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <GitCompareArrows className="w-10 h-10 text-primary/40" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Nenhum advogado para comparar</h1>
          <p className="text-muted-foreground mb-8">
            Volte para a busca e clique em "Comparar" nos cards dos advogados que deseja comparar. Você pode selecionar até 3.
          </p>
          <Button asChild className="rounded-xl shadow-clay-btn gap-2">
            <Link href="/buscar"><Search className="w-4 h-4" />Buscar advogados</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const best = (key: "avgRating" | "yearsExperience" | "hourlyRateMin") => {
    const vals = compareList.map(l => Number(l[key] ?? 0));
    const max = key === "hourlyRateMin" ? Math.min(...vals.filter(v => v > 0)) : Math.max(...vals);
    return max;
  };

  const bestRating = best("avgRating");
  const bestExp = best("yearsExperience");
  const lowestRate = compareList.reduce((min, l) => !l.hourlyRateMin || (min !== 0 && l.hourlyRateMin >= min) ? min : l.hourlyRateMin ?? min, 0);

  return (
    <Layout>
      <div className="bg-gradient-to-br from-slate-50 to-primary/5 border-b border-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <GitCompareArrows className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">Comparar Advogados</h1>
              <p className="text-muted-foreground text-sm">Comparando {compareList.length} profissionais</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearCompare} className="rounded-xl gap-2 text-sm">
              <X className="w-4 h-4" /> Limpar comparação
            </Button>
            <Button asChild variant="ghost" className="rounded-xl gap-2 text-sm">
              <Link href="/buscar"><Search className="w-4 h-4" /> Adicionar mais</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 overflow-x-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-w-[600px]"
        >
          <div className={`grid gap-0 border border-border rounded-3xl overflow-hidden shadow-sm`}
            style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}
          >
            {/* Header row */}
            <div className="p-4 bg-slate-50 border-b border-r border-border" />
            {compareList.map(lawyer => (
              <div key={lawyer.id} className="p-5 bg-white border-b border-r last:border-r-0 border-border text-center relative">
                <button
                  onClick={() => removeFromCompare(lawyer.id)}
                  className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <img
                  src={lawyer.photoUrl || "/images/lawyer-placeholder-1.png"}
                  alt={lawyer.fullName}
                  className="w-16 h-16 rounded-2xl object-cover mx-auto mb-3 shadow-sm"
                />
                <Link href={`/advogado/${lawyer.id}`}>
                  <h3 className="font-bold text-base text-slate-900 hover:text-primary transition-colors leading-snug">{lawyer.fullName}</h3>
                </Link>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />{lawyer.city}, {lawyer.state}
                </p>
                {lawyer.isVerified && (
                  <div className="flex justify-center mt-2">
                    <VerifiedBadge />
                  </div>
                )}
              </div>
            ))}

            {/* Rows */}
            <LabelCell><Star className="w-4 h-4 inline mr-1.5 text-amber-400" />Avaliação</LabelCell>
            {compareList.map(l => (
              <Cell key={l.id} highlight={l.avgRating === bestRating}>
                <span className="text-lg font-bold">{Number(l.avgRating).toFixed(1)}</span>
                <span className="text-xs text-muted-foreground ml-1">({l.totalReviews} av.)</span>
              </Cell>
            ))}

            <LabelCell><Briefcase className="w-4 h-4 inline mr-1.5 text-blue-400" />Experiência</LabelCell>
            {compareList.map(l => (
              <Cell key={l.id} highlight={l.yearsExperience === bestExp}>
                {l.yearsExperience} anos
              </Cell>
            ))}

            <LabelCell><DollarSign className="w-4 h-4 inline mr-1.5 text-emerald-400" />Consulta a partir de</LabelCell>
            {compareList.map(l => (
              <Cell key={l.id} highlight={l.hourlyRateMin === lowestRate && !!lowestRate}>
                {l.hourlyRateMin ? `R$ ${l.hourlyRateMin}` : "Consultar"}
              </Cell>
            ))}

            <LabelCell><Languages className="w-4 h-4 inline mr-1.5 text-violet-400" />Idiomas</LabelCell>
            {compareList.map(l => (
              <Cell key={l.id}>
                <div className="flex flex-wrap gap-1 justify-center">
                  {(l.languages ?? []).map(lang => (
                    <span key={lang} className="text-xs bg-muted px-2 py-0.5 rounded-md">{lang}</span>
                  ))}
                </div>
              </Cell>
            ))}

            <LabelCell>Especialidades</LabelCell>
            {compareList.map(l => (
              <Cell key={l.id}>
                <div className="flex flex-wrap gap-1 justify-center">
                  {l.specialties.slice(0, 4).map(s => (
                    <span key={s.id} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md">{s.name}</span>
                  ))}
                </div>
              </Cell>
            ))}

            <LabelCell>OAB Verificada</LabelCell>
            {compareList.map(l => (
              <Cell key={l.id}>
                {l.isVerified
                  ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                  : <X className="w-5 h-5 text-slate-300 mx-auto" />}
              </Cell>
            ))}

            <LabelCell>Ação</LabelCell>
            {compareList.map(l => (
              <Cell key={l.id}>
                <Button asChild size="sm" className="rounded-xl w-full shadow-clay-btn text-xs">
                  <Link href={`/advogado/${l.id}`}>Ver Perfil</Link>
                </Button>
              </Cell>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Os campos em <span className="text-primary font-semibold">destaque</span> indicam o melhor valor em cada categoria.
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}
