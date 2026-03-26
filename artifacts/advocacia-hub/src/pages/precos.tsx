import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { CheckCircle2, X, Zap, Building2, User, Star, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

const PLANS = [
  {
    name: "Grátis",
    icon: <User className="w-6 h-6" />,
    price: "R$ 0",
    period: "para sempre",
    description: "Ideal para advogados que estão começando a construir sua presença online.",
    color: "border-border",
    headerColor: "bg-slate-50",
    ctaText: "Criar conta grátis",
    ctaVariant: "outline" as const,
    badge: null,
    features: [
      { text: "Perfil básico com foto e bio", included: true },
      { text: "OAB verificada na listagem", included: true },
      { text: "Até 5 contatos por mês", included: true },
      { text: "1 especialidade no perfil", included: true },
      { text: "Listagem na busca padrão", included: true },
      { text: "Destaque na busca", included: false },
      { text: "Múltiplas especialidades", included: false },
      { text: "Estatísticas de visualizações", included: false },
      { text: "Publicação de artigos no blog", included: false },
      { text: "Badge Resposta Rápida", included: false },
    ],
  },
  {
    name: "Pro",
    icon: <Zap className="w-6 h-6" />,
    price: "R$ 99",
    period: "/mês",
    description: "Para advogados que querem captar mais clientes e se destacar na plataforma.",
    color: "border-primary ring-2 ring-primary ring-offset-2",
    headerColor: "bg-primary",
    ctaText: "Começar Pro",
    ctaVariant: "default" as const,
    badge: "Mais popular",
    features: [
      { text: "Perfil completo com foto e bio", included: true },
      { text: "OAB verificada em destaque", included: true },
      { text: "Contatos ilimitados", included: true },
      { text: "Até 5 especialidades no perfil", included: true },
      { text: "Destaque moderado na busca", included: true },
      { text: "Estatísticas básicas de visualizações", included: true },
      { text: "Publicação de artigos no blog", included: true },
      { text: "Badge Resposta Rápida", included: true },
      { text: "Múltiplos escritórios", included: false },
      { text: "API de integração", included: false },
    ],
  },
  {
    name: "Escritório",
    icon: <Building2 className="w-6 h-6" />,
    price: "R$ 299",
    period: "/mês",
    description: "Solução completa para escritórios com múltiplos advogados e alto volume.",
    color: "border-violet-200",
    headerColor: "bg-gradient-to-br from-violet-600 to-violet-800",
    ctaText: "Falar com vendas",
    ctaVariant: "outline" as const,
    badge: null,
    features: [
      { text: "Até 10 perfis de advogados", included: true },
      { text: "OAB verificada em destaque", included: true },
      { text: "Contatos ilimitados", included: true },
      { text: "Especialidades ilimitadas", included: true },
      { text: "Topo das buscas garantido", included: true },
      { text: "Dashboard analytics completo", included: true },
      { text: "Publicação ilimitada no blog", included: true },
      { text: "Badge Resposta Rápida + Escritório", included: true },
      { text: "Múltiplos escritórios/endereços", included: true },
      { text: "API de integração + Webhook", included: true },
    ],
  },
];

const FAQS = [
  { q: "Posso cancelar a qualquer momento?", a: "Sim. Você pode cancelar sua assinatura a qualquer momento, sem multa ou burocracia. O plano permanece ativo até o fim do período pago." },
  { q: "O plano Grátis é realmente gratuito para sempre?", a: "Sim! O plano Grátis não tem data de expiração. Você pode usar a plataforma de forma básica indefinidamente." },
  { q: "Como é feita a verificação da OAB?", a: "Verificamos seu número e seccional diretamente no sistema da OAB. O processo leva até 24 horas após o cadastro." },
  { q: "Posso mudar de plano depois?", a: "Sim, você pode fazer upgrade ou downgrade a qualquer momento pelo painel do advogado." },
];

export default function PrecosPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-primary/90 to-slate-800 py-20 text-center text-white px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-primary-foreground/60 text-sm font-medium uppercase tracking-widest mb-3">Planos e Preços</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Invista no seu crescimento</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Planos flexíveis para advogados autônomos e escritórios de todos os tamanhos. Comece grátis e escale conforme crescer.
          </p>
        </motion.div>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-3xl border-2 overflow-hidden flex flex-col ${plan.color} shadow-sm hover:shadow-lg transition-shadow`}
            >
              {/* Header */}
              <div className={`p-7 ${plan.headerColor} relative`}>
                {plan.badge && (
                  <span className="absolute top-4 right-4 bg-white text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-primary" /> {plan.badge}
                  </span>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${plan.name === "Grátis" ? "bg-slate-200 text-slate-600" : "bg-white/20 text-white"}`}>
                  {plan.icon}
                </div>
                <h3 className={`text-xl font-bold mb-1 ${plan.name !== "Grátis" ? "text-white" : "text-slate-900"}`}>{plan.name}</h3>
                <div className={`flex items-baseline gap-1 mb-3 ${plan.name !== "Grátis" ? "text-white" : "text-slate-900"}`}>
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className={`text-sm ${plan.name !== "Grátis" ? "text-white/70" : "text-slate-500"}`}>{plan.period}</span>
                </div>
                <p className={`text-sm ${plan.name !== "Grátis" ? "text-white/70" : "text-slate-500"}`}>{plan.description}</p>
              </div>

              {/* Features */}
              <div className="p-6 flex-1 bg-white">
                <ul className="space-y-3 mb-6">
                  {plan.features.map(f => (
                    <li key={f.text} className="flex items-start gap-2.5 text-sm">
                      {f.included
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        : <X className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />}
                      <span className={f.included ? "text-slate-700" : "text-slate-400"}>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild={plan.name !== "Escritório"}
                  variant={plan.ctaVariant}
                  className={`w-full rounded-xl gap-2 ${plan.name === "Pro" ? "shadow-clay-btn" : ""}`}
                >
                  {plan.name === "Escritório" ? (
                    <span>{plan.ctaText} <ArrowRight className="w-4 h-4" /></span>
                  ) : (
                    <Link href="/cadastro">
                      {plan.ctaText} <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Todos os preços em Reais (BRL). Assinaturas renovam mensalmente.
        </p>
      </section>

      {/* Features comparison banner */}
      <section className="bg-slate-50 border-y border-border py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Por que o AdvocaciaHub?</h2>
          <p className="text-muted-foreground mb-10">A plataforma jurídica de maior crescimento no Brasil</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { v: "10.000+", l: "Advogados cadastrados" },
              { v: "50.000+", l: "Clientes atendidos" },
              { v: "4.8★", l: "Avaliação média" },
              { v: "98%", l: "Satisfação dos clientes" },
            ].map(s => (
              <div key={s.l} className="text-center">
                <p className="text-3xl font-extrabold text-primary">{s.v}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary" />
          Perguntas frequentes
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-border overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex justify-between items-center p-5 text-left font-medium text-slate-900 hover:bg-slate-50 transition-colors"
              >
                {faq.q}
                <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
                </motion.div>
              </button>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-5 pb-5 text-sm text-muted-foreground border-t border-border pt-4"
                >
                  {faq.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
