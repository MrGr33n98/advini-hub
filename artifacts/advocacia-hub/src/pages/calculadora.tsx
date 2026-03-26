import { Layout } from "@/components/layout";
import { useState } from "react";
import { Calculator, DollarSign, Clock, Info, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

const SPECIALTIES = [
  { value: "trabalhista", label: "Direito Trabalhista", baseMin: 1500, baseMax: 6000, multiplier: 1 },
  { value: "familia", label: "Direito de Família (Divórcio)", baseMin: 1800, baseMax: 8000, multiplier: 1.1 },
  { value: "criminal", label: "Direito Criminal", baseMin: 3000, baseMax: 25000, multiplier: 1.5 },
  { value: "civil", label: "Direito Civil (Indenização)", baseMin: 1200, baseMax: 8000, multiplier: 1 },
  { value: "tributario", label: "Direito Tributário", baseMin: 2500, baseMax: 15000, multiplier: 1.3 },
  { value: "consumidor", label: "Direito do Consumidor", baseMin: 500, baseMax: 3000, multiplier: 0.8 },
  { value: "empresarial", label: "Direito Empresarial", baseMin: 3000, baseMax: 20000, multiplier: 1.4 },
  { value: "previdenciario", label: "Direito Previdenciário", baseMin: 1000, baseMax: 5000, multiplier: 0.9 },
];

const COMPLEXITIES = [
  { value: "simples", label: "Simples", desc: "Sem litígios, documentação básica", multiplier: 0.7 },
  { value: "medio", label: "Médio", desc: "Processo padrão, alguma negociação", multiplier: 1 },
  { value: "complexo", label: "Complexo", desc: "Múltiplas partes, longa duração", multiplier: 1.6 },
  { value: "urgente", label: "Urgente", desc: "Prazos curtos, demanda imediata", multiplier: 1.9 },
];

const MODALITIES = [
  { value: "fixo", label: "Honorário fixo", desc: "Valor fechado pelo serviço" },
  { value: "hora", label: "Por hora trabalhada", desc: "Cobrança por hora de dedicação" },
  { value: "exito", label: "Êxito (contingência)", desc: "% do valor ganho na causa" },
];

const REGIONS = [
  { value: "sul_sudeste", label: "Sul/Sudeste (SP, RJ, PR...)", multiplier: 1.2 },
  { value: "centro_norte", label: "Centro-Oeste/Norte", multiplier: 0.85 },
  { value: "nordeste", label: "Nordeste", multiplier: 0.8 },
  { value: "capital", label: "Capital de estado", multiplier: 1.1 },
  { value: "interior", label: "Interior / Cidade pequena", multiplier: 0.75 },
];

function formatCurrency(val: number) {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export default function CalculadoraPage() {
  const [specialty, setSpecialty] = useState("");
  const [complexity, setComplexity] = useState("");
  const [modality, setModality] = useState("fixo");
  const [region, setRegion] = useState("sul_sudeste");
  const [result, setResult] = useState<{ min: number; max: number; hourly: number } | null>(null);

  const calculate = () => {
    const spec = SPECIALTIES.find(s => s.value === specialty);
    const comp = COMPLEXITIES.find(c => c.value === complexity);
    const reg = REGIONS.find(r => r.value === region);
    if (!spec || !comp || !reg) return;

    const m = spec.multiplier * comp.multiplier * reg.multiplier;
    const min = Math.round((spec.baseMin * m) / 100) * 100;
    const max = Math.round((spec.baseMax * m) / 100) * 100;
    const hourly = Math.round((min / 20) / 50) * 50;

    setResult({ min, max, hourly });
  };

  const canCalculate = !!specialty && !!complexity;

  const exitPercent = result
    ? modality === "exito"
      ? specialty === "trabalhista" ? "20% a 30%" : specialty === "criminal" ? "20% a 35%" : "15% a 30%"
      : null
    : null;

  return (
    <Layout>
      <div className="bg-gradient-to-br from-slate-900 via-emerald-900/80 to-slate-800 py-16 text-center text-white px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-5">
            <Calculator className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-3">Calculadora de Honorários</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Estime o valor médio de honorários advocatícios com base no tipo de caso, complexidade e região. Referência baseada na tabela da OAB.
          </p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Área do direito</Label>
              <div className="space-y-2">
                {SPECIALTIES.map(s => (
                  <button
                    key={s.value}
                    onClick={() => { setSpecialty(s.value); setResult(null); }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 text-sm text-left transition-all ${
                      specialty === s.value ? "border-primary bg-primary/5 text-primary font-semibold" : "border-border bg-white text-slate-700 hover:border-primary/40"
                    }`}
                  >
                    {s.label}
                    {specialty === s.value && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Complexidade do caso</Label>
              <div className="space-y-2">
                {COMPLEXITIES.map(c => (
                  <button
                    key={c.value}
                    onClick={() => { setComplexity(c.value); setResult(null); }}
                    className={`w-full p-3.5 rounded-xl border-2 text-left transition-all ${
                      complexity === c.value ? "border-primary bg-primary/5" : "border-border bg-white hover:border-primary/40"
                    }`}
                  >
                    <p className={`text-sm font-semibold ${complexity === c.value ? "text-primary" : "text-slate-800"}`}>{c.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Modalidade de cobrança</Label>
              <div className="space-y-2">
                {MODALITIES.map(m => (
                  <button
                    key={m.value}
                    onClick={() => setModality(m.value)}
                    className={`w-full p-3.5 rounded-xl border-2 text-left transition-all ${
                      modality === m.value ? "border-emerald-500 bg-emerald-50" : "border-border bg-white hover:border-emerald-200"
                    }`}
                  >
                    <p className={`text-sm font-semibold ${modality === m.value ? "text-emerald-700" : "text-slate-800"}`}>{m.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Região</Label>
              <div className="grid grid-cols-1 gap-2">
                {REGIONS.map(r => (
                  <button
                    key={r.value}
                    onClick={() => { setRegion(r.value); setResult(null); }}
                    className={`p-3 rounded-xl border-2 text-sm text-left transition-all ${
                      region === r.value ? "border-violet-500 bg-violet-50 text-violet-700 font-semibold" : "border-border bg-white text-slate-700 hover:border-violet-200"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              disabled={!canCalculate}
              onClick={calculate}
              size="lg"
              className="w-full rounded-2xl shadow-clay-btn text-base gap-2"
            >
              <Calculator className="w-5 h-5" />
              Calcular estimativa
            </Button>
          </div>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-10 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-white shadow-xl"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6" /> Estimativa de Honorários
              </h2>

              {modality === "hora" ? (
                <div className="text-center">
                  <p className="text-white/70 text-sm mb-2">Valor hora estimado</p>
                  <p className="text-5xl font-extrabold">{formatCurrency(result.hourly)}</p>
                  <p className="text-white/60 text-sm mt-2">por hora trabalhada</p>
                  <p className="text-white/70 mt-4 text-sm">Total estimado para o caso: {formatCurrency(result.min)} – {formatCurrency(result.max)}</p>
                </div>
              ) : modality === "exito" ? (
                <div className="text-center">
                  <p className="text-white/70 text-sm mb-2">Percentual sobre o valor ganho</p>
                  <p className="text-5xl font-extrabold">{exitPercent}</p>
                  <p className="text-white/60 text-sm mt-2">do valor da causa em caso de êxito</p>
                  <p className="text-white/70 mt-4 text-sm">Equivalente a {formatCurrency(result.min)} – {formatCurrency(result.max)} em valores absolutos</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-2xl p-5 text-center">
                    <p className="text-white/60 text-sm mb-1">Mínimo estimado</p>
                    <p className="text-3xl font-extrabold">{formatCurrency(result.min)}</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-5 text-center">
                    <p className="text-white/60 text-sm mb-1">Máximo estimado</p>
                    <p className="text-3xl font-extrabold">{formatCurrency(result.max)}</p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-start gap-2 text-white/60 text-xs bg-white/10 rounded-xl p-4">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                Valores estimados com base na tabela de honorários da OAB e no mercado regional. Os valores reais podem variar conforme o profissional e as particularidades do caso.
              </div>

              <Button asChild className="w-full mt-5 rounded-xl bg-white text-emerald-800 font-bold hover:bg-white/90 gap-2 shadow-lg">
                <Link href="/buscar">
                  Encontrar advogado nesta área <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
