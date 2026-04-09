import { Layout } from "@/components/layout";
import { SearchBar } from "@/components/search-bar";
import { LawyerCard } from "@/components/lawyer-card";
import { Newsletter } from "@/components/newsletter";
import { useListLawyers } from "@/hooks/use-lawyers";
import { useListBlogPosts } from "@/hooks/use-blog";
import { ShieldCheck, Scale, FileText, ArrowRight, Search, Calculator, HelpCircle, GitCompareArrows } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: lawyersData, isLoading: loadingLawyers } = useListLawyers({ limit: 6, minRating: 4.5 });
  const { data: blogData, isLoading: loadingBlog } = useListBlogPosts({ limit: 3 });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Fundo abstrato Advindex" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-background backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-sm mb-6 text-sm font-semibold text-primary">
              <ShieldCheck className="w-4 h-4" />
              <span>Plataforma 100% segura e verificada</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold text-slate-900 tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
              Encontre o <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">advogado ideal</span> para o seu caso.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              Milhares de profissionais com OAB verificada prontos para te atender. Transparência, avaliações reais e contato direto.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto relative"
          >
            {/* The decorative blurred background behind search */}
            <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-xl z-0"></div>
            <SearchBar className="relative z-10 p-2 md:p-3" />
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm font-medium text-slate-500">
              <span>Buscas populares:</span>
              <Link href="/buscar?specialty=trabalhista" className="hover:text-primary transition-colors">Direito Trabalhista</Link>
              <span className="w-1 h-1 rounded-full bg-slate-300 self-center"></span>
              <Link href="/buscar?specialty=familia" className="hover:text-primary transition-colors">Divórcio e Família</Link>
              <span className="w-1 h-1 rounded-full bg-slate-300 self-center"></span>
              <Link href="/buscar?specialty=empresarial" className="hover:text-primary transition-colors">Para Empresas</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Lawyers */}
      <section className="py-20 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold mb-3">Profissionais em Destaque</h2>
              <p className="text-slate-500 text-lg">Advogados mais bem avaliados pelos clientes na plataforma.</p>
            </div>
            <Link href="/buscar" className="hidden md:flex items-center font-semibold text-primary hover:text-primary/80 transition-colors">
              Ver todos <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {loadingLawyers ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-72 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lawyersData?.data?.map(lawyer => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center md:hidden">
             <Link href="/buscar" className="inline-flex items-center font-semibold text-primary hover:text-primary/80 transition-colors">
              Ver todos os advogados <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Subtle dot pattern background */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-multiply" 
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/pattern-dots.png)`, backgroundSize: '24px' }}
        ></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Como o Advindex funciona</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Conectamos você ao profissional certo em três passos simples.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            {[
              {
                icon: <Search className="w-8 h-8 text-primary" />,
                title: "1. Busque e Filtre",
                desc: "Encontre advogados por especialidade, cidade, nota de avaliação ou nome."
              },
              {
                icon: <FileText className="w-8 h-8 text-primary" />,
                title: "2. Analise os Perfis",
                desc: "Leia avaliações de clientes reais, veja a experiência e áreas de atuação."
              },
              {
                icon: <Scale className="w-8 h-8 text-primary" />,
                title: "3. Entre em Contato",
                desc: "Envie uma mensagem direta e segura através da plataforma para agendar uma consulta."
              }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 shadow-sm border border-primary/10">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Teaser */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold mb-3">Conteúdo Jurídico</h2>
              <p className="text-slate-500 text-lg">Entenda seus direitos com nossos artigos.</p>
            </div>
            <Link href="/blog" className="hidden md:flex items-center font-semibold text-primary hover:text-primary/80 transition-colors">
              Ler o blog <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {loadingBlog ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[1, 2, 3].map(i => <Skeleton key={i} className="h-80 rounded-3xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogData?.data?.map(post => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <div className="group cursor-pointer">
                    <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-5 shadow-clay-sm relative">
                      {/* unsplash legal/office image placeholder */}
                      <img 
                        src={post.featuredImageUrl || "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80"} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 flex gap-2">
                        {post.tags.slice(0, 1).map(tag => (
                          <span key={tag} className="text-xs font-semibold px-2 py-1 bg-white text-slate-800 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Tools section */}
      <section className="bg-slate-50 border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2">Ferramentas gratuitas</h2>
            <p className="text-muted-foreground">Recursos para te ajudar antes e durante o processo jurídico</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                href: "/calculadora",
                icon: <Calculator className="w-7 h-7" />,
                color: "from-emerald-500 to-emerald-600",
                bg: "bg-emerald-50",
                title: "Calculadora de Honorários",
                desc: "Estime o custo do seu processo com base na área e complexidade do caso.",
              },
              {
                href: "/comparar",
                icon: <GitCompareArrows className="w-7 h-7" />,
                color: "from-primary to-primary/80",
                bg: "bg-primary/5",
                title: "Comparar Advogados",
                desc: "Compare até 3 profissionais lado a lado por avaliação, preço e especialidade.",
              },
              {
                href: "/faq",
                icon: <HelpCircle className="w-7 h-7" />,
                color: "from-violet-500 to-violet-600",
                bg: "bg-violet-50",
                title: "Perguntas Frequentes",
                desc: "Tire suas dúvidas sobre a plataforma e sobre como funciona o processo jurídico.",
              },
            ].map(tool => (
              <Link key={tool.href} href={tool.href}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-3xl p-7 border border-border shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform shadow-sm`}>
                    {tool.icon}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{tool.desc}</p>
                  <div className="flex items-center gap-1.5 text-primary text-sm font-semibold mt-4 group-hover:gap-2.5 transition-all">
                    Acessar <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </Layout>
  );
}
