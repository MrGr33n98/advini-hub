import { Link, useLocation } from "wouter";
import { Scale, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/buscar", label: "Encontrar Advogado" },
    { href: "/blog", label: "Artigos e Dicas" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md border-b border-border/50 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-clay-sm group-hover:scale-105 transition-transform duration-300">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-foreground">
                Advocacia<span className="text-primary">Hub</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="w-px h-6 bg-border mx-2"></div>
              <Button asChild variant="outline" className="rounded-full shadow-clay-sm border-transparent bg-white hover:bg-slate-50">
                <Link href="/buscar">
                  <Search className="w-4 h-4 mr-2" />
                  Pesquisar
                </Link>
              </Button>
              <Button className="rounded-full shadow-clay-btn bg-primary hover:bg-primary/90 text-white font-medium px-6">
                Sou Advogado
              </Button>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-foreground"
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
            className="fixed inset-0 z-40 bg-background pt-24 px-4 pb-6 flex flex-col md:hidden"
          >
            <nav className="flex flex-col gap-4 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-medium p-4 rounded-xl ${
                    location === link.href ? "bg-primary/10 text-primary" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-8 flex flex-col gap-3">
                <Button asChild variant="outline" className="w-full justify-center h-12 rounded-xl text-base">
                  <Link href="/buscar" onClick={() => setMobileMenuOpen(false)}>
                    <Search className="w-4 h-4 mr-2" />
                    Pesquisar Advogados
                  </Link>
                </Button>
                <Button className="w-full justify-center h-12 rounded-xl text-base shadow-clay-btn">
                  Sou Advogado
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-20">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 md:py-16 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Scale className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-white">
                  AdvocaciaHub
                </span>
              </Link>
              <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
                Conectando cidadãos e empresas aos melhores profissionais jurídicos do Brasil com transparência e segurança.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/buscar" className="hover:text-white transition-colors">Buscar Advogados</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog e Artigos</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Como funciona</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Para Profissionais</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Cadastrar Perfil</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Planos e Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Portal do Advogado</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
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
