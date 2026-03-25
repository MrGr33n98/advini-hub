import { Layout } from "@/components/layout";
import { useListSpecialties } from "@/hooks/use-specialties";
import { AdBanner, SidebarAdStack } from "@/components/ad-banner";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Briefcase, Scale, Shield, Heart, Building2,
  ShoppingCart, DollarSign, Users, FileText,
  ChevronRight, Search, Home, Car, Globe,
  Gavel, BookOpen
} from "lucide-react";

const SPECIALTY_ICONS: Record<string, React.ReactNode> = {
  "direito-trabalhista": <Briefcase className="w-7 h-7" />,
  "direito-civil": <Scale className="w-7 h-7" />,
  "direito-criminal": <Shield className="w-7 h-7" />,
  "direito-familia": <Heart className="w-7 h-7" />,
  "direito-empresarial": <Building2 className="w-7 h-7" />,
  "direito-consumidor": <ShoppingCart className="w-7 h-7" />,
  "direito-tributario": <DollarSign className="w-7 h-7" />,
  "direito-previdenciario": <Users className="w-7 h-7" />,
  "hora-extra": <FileText className="w-6 h-6" />,
  "rescisao-contrato": <FileText className="w-6 h-6" />,
  "divorcio": <Heart className="w-6 h-6" />,
  "guarda-filhos": <Users className="w-6 h-6" />,
  "inventario": <BookOpen className="w-6 h-6" />,
  "planejamento-tributario": <DollarSign className="w-6 h-6" />,
};

const SPECIALTY_COLORS: Record<string, string> = {
  "direito-trabalhista": "from-blue-500 to-blue-600",
  "direito-civil": "from-indigo-500 to-indigo-600",
  "direito-criminal": "from-slate-600 to-slate-700",
  "direito-familia": "from-rose-500 to-rose-600",
  "direito-empresarial": "from-violet-500 to-violet-600",
  "direito-consumidor": "from-emerald-500 to-emerald-600",
  "direito-tributario": "from-amber-500 to-amber-600",
  "direito-previdenciario": "from-teal-500 to-teal-600",
};

const SPECIALTY_DESCRIPTION: Record<string, string> = {
  "direito-trabalhista": "Horas extras, rescisão, FGTS, assédio e direitos do trabalhador",
  "direito-civil": "Contratos, responsabilidade civil, indenizações e obrigações",
  "direito-criminal": "Defesa criminal, habeas corpus, crimes dolosos e culposos",
  "direito-familia": "Divórcio, guarda de filhos, pensão alimentícia e inventário",
  "direito-empresarial": "Abertura de empresa, contratos, M&A e compliance",
  "direito-consumidor": "Cobrança indevida, vícios de produto e práticas abusivas",
  "direito-tributario": "Planejamento fiscal, autuações e recuperação de créditos",
  "direito-previdenciario": "Aposentadoria, INSS, BPC e benefícios por incapacidade",
};

const POPULAR_SEARCHES = [
  { label: "Rescisão indevida", slug: "rescisao-contrato" },
  { label: "Divórcio rápido", slug: "divorcio" },
  { label: "Horas extras", slug: "hora-extra" },
  { label: "Dívidas no nome", slug: "direito-consumidor" },
  { label: "Aposentadoria negada", slug: "direito-previdenciario" },
  { label: "Guarda de filhos", slug: "guarda-filhos" },
  { label: "Autuação fiscal", slug: "planejamento-tributario" },
  { label: "Inventário herança", slug: "inventario" },
];

export default function CategoriasPage() {
  const { data: specialties, isLoading } = useListSpecialties();

  const topLevel = specialties?.filter(s => !s.parentId) ?? [];
  const byParent = (parentId: number) => specialties?.filter(s => s.parentId === parentId) ?? [];

  return (
    <Layout>
      <section className="bg-gradient-to-br from-slate-900 via-primary/90 to-slate-800 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center text-white">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary-foreground/70 text-sm font-medium uppercase tracking-widest mb-3"
          >
            Todas as Áreas
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-bold mb-4 leading-tight"
          >
            Categorias Jurídicas
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg max-w-2xl mx-auto mb-8"
          >
            Encontre o advogado certo para o seu caso. Selecione a área jurídica e veja profissionais verificados prontos para te atender.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {POPULAR_SEARCHES.map(s => (
              <Link
                key={s.slug}
                href={`/buscar?specialty=${s.slug}`}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 text-sm transition-colors border border-white/10 hover:border-white/30"
              >
                {s.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      <AdBanner position="header" className="max-w-5xl mx-auto mt-6 px-4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <main className="flex-1 min-w-0">

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {topLevel.map((spec, i) => {
                  const subs = byParent(spec.id);
                  const color = SPECIALTY_COLORS[spec.slug] ?? "from-primary to-primary/80";
                  const icon = SPECIALTY_ICONS[spec.slug] ?? <Gavel className="w-7 h-7" />;
                  const desc = SPECIALTY_DESCRIPTION[spec.slug] ?? spec.description ?? "";

                  return (
                    <motion.div
                      key={spec.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link href={`/buscar?specialty=${spec.slug}`}>
                        <div className="group rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer">
                          <div className={`bg-gradient-to-br ${color} p-6 flex items-start gap-4`}>
                            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                              {icon}
                            </div>
                            <div className="text-white">
                              <h3 className="font-bold text-lg leading-tight">{spec.name}</h3>
                              <p className="text-white/70 text-sm mt-1 leading-snug">{desc}</p>
                            </div>
                          </div>

                          {subs.length > 0 && (
                            <div className="p-4 bg-card">
                              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3">Subcategorias</p>
                              <div className="flex flex-wrap gap-2">
                                {subs.map(sub => (
                                  <span
                                    key={sub.id}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      window.location.href = `/buscar?specialty=${sub.slug}`;
                                    }}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer border border-border"
                                  >
                                    {sub.name}
                                    <ChevronRight className="w-3 h-3" />
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="px-4 pb-4">
                            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
                              <Search className="w-4 h-4" />
                              Ver advogados nesta área
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <div className="mt-12 rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 text-white text-center">
              <Globe className="w-10 h-10 mx-auto mb-3 opacity-80" />
              <h3 className="text-xl font-bold mb-2">Não encontrou sua área?</h3>
              <p className="text-white/70 mb-4 text-sm">Nossa plataforma está em constante crescimento. Busque por qualquer termo jurídico e encontre profissionais.</p>
              <Link href="/buscar">
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary font-semibold text-sm hover:bg-white/90 transition-colors cursor-pointer">
                  <Search className="w-4 h-4" />
                  Busca avançada
                </span>
              </Link>
            </div>
          </main>

          <aside className="w-full lg:w-72 flex-shrink-0">
            <SidebarAdStack />
            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
              <h4 className="font-semibold text-sm mb-4">Como encontrar o advogado certo</h4>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                  Escolha a área jurídica do seu problema
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                  Filtre por cidade e avaliação mínima
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
                  Leia avaliações de outros clientes
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">4</span>
                  Entre em contato direto pelo perfil
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
