import { Link, useLocation } from "wouter";
import { Scale, Search, Menu, X, LogIn, UserPlus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/favorites-context";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { count: favCount } = useFavorites();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/buscar", label: "Encontrar Advogado" },
    { href: "/categorias", label: "Categorias" },
    { href: "/escritorios", label: "Escritórios" },
    { href: "/blog", label: "Artigos e Dicas" },
  ];

  const isHome = location === "/";

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !isHome
            ? "bg-white/90 backdrop-blur-md border-b border-border/50 shadow-sm"
            : "bg-black/20 backdrop-blur-sm border-b border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-clay-sm group-hover:scale-105 transition-transform duration-300">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className={`font-display font-bold text-xl tracking-tight ${isScrolled || !isHome ? "text-foreground" : "text-white drop-shadow-md"}`}>
                Advocacia<span className={isScrolled || !isHome ? "text-primary" : "text-amber-200 drop-shadow-md"}>Hub</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === link.href
                      ? "text-primary"
                      : isScrolled || !isHome
                      ? "text-muted-foreground"
                      : "text-white drop-shadow-md hover:drop-shadow-lg"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className={`w-px h-5 ${isScrolled || !isHome ? "bg-border" : "bg-white/20"} mx-1`} />

              <Link href="/favoritos" className="relative">
                <button className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors border ${
                  isScrolled || !isHome
                    ? "bg-white border-border text-slate-500 hover:border-rose-200 hover:text-rose-500"
                    : "bg-white/20 border-white/40 text-white drop-shadow-md hover:bg-white/30"
                }`}>
                  <Heart className={`w-4 h-4 ${favCount > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
                  {favCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {favCount > 9 ? "9+" : favCount}
                    </span>
                  )}
                </button>
              </Link>

              <Button asChild variant="ghost" size="sm" className={`rounded-full gap-1.5 ${isScrolled || !isHome ? "" : "text-white drop-shadow-md hover:text-white hover:bg-white/15"}`}>
                <Link href="/login">
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Link>
              </Button>

              <Button asChild size="sm" className="rounded-full shadow-clay-btn bg-primary hover:bg-primary/90 text-white font-medium px-5 gap-1.5">
                <Link href="/cadastro">
                  <UserPlus className="w-4 h-4" />
                  Cadastrar
                </Link>
              </Button>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className={`md:hidden p-2 drop-shadow-md ${isScrolled || !isHome ? "text-foreground" : "text-white"}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background pt-20 px-4 pb-6 flex flex-col md:hidden overflow-y-auto"
          >
            <nav className="flex flex-col gap-2 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium p-4 rounded-xl ${
                    location === link.href ? "bg-primary/10 text-primary" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-6 flex flex-col gap-3">
                <Button asChild variant="outline" className="w-full h-12 rounded-xl text-base">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </Link>
                </Button>
                <Button asChild className="w-full h-12 rounded-xl text-base shadow-clay-btn">
                  <Link href="/cadastro" onClick={() => setMobileMenuOpen(false)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Criar conta grátis
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="w-full h-12 rounded-xl text-base">
                  <Link href="/cadastro?role=lawyer" onClick={() => setMobileMenuOpen(false)}>
                    Sou advogado
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-[60px]">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 md:py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Scale className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-white">AdvocaciaHub</span>
              </Link>
              <p className="text-slate-400 max-w-sm mb-5 leading-relaxed text-sm">
                Conectando cidadãos e empresas aos melhores profissionais jurídicos do Brasil com transparência e segurança.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Plataforma</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/buscar" className="hover:text-white transition-colors">Buscar Advogados</Link></li>
                <li><Link href="/categorias" className="hover:text-white transition-colors">Categorias</Link></li>
                <li><Link href="/escritorios" className="hover:text-white transition-colors">Escritórios de Advocacia</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog e Artigos</Link></li>
                <li><Link href="/favoritos" className="hover:text-white transition-colors">Meus Favoritos</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Ferramentas</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/calculadora" className="hover:text-white transition-colors">Calculadora de Honorários</Link></li>
                <li><Link href="/comparar" className="hover:text-white transition-colors">Comparar Advogados</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">Perguntas Frequentes</Link></li>
                <li><Link href="/precos" className="hover:text-white transition-colors">Planos e Preços</Link></li>
                <li><Link href="/cadastro" className="hover:text-white transition-colors">Criar conta grátis</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} AdvocaciaHub. Todos os direitos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Termos de Uso</a>
              <a href="#" className="hover:text-white">Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
