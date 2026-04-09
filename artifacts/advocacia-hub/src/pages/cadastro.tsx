import { useState } from "react";
import { Link } from "wouter";
import { Scale, Eye, EyeOff, Shield, UserCheck, Briefcase, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

type Role = "client" | "lawyer" | null;

const BENEFITS_CLIENT = [
  "Busque entre milhares de advogados verificados",
  "Leia avaliações reais de outros clientes",
  "Entre em contato direto e gratuito",
  "Salve advogados favoritos",
  "Acompanhe seus contatos e processos",
];

const BENEFITS_LAWYER = [
  "Perfil verificado com badge OAB",
  "Receba leads qualificados na sua área",
  "Publique artigos e ganhe autoridade",
  "Dashboard com métricas de engajamento",
  "Planos flexíveis para todos os escritórios",
];

export default function CadastroPage() {
  const [role, setRole] = useState<Role>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", oab: "", state: "" });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-3">Cadastro realizado!</h2>
          <p className="text-muted-foreground mb-6">
            {role === "lawyer"
              ? "Seu perfil está em análise. Verificaremos seus dados da OAB e entraremos em contato em até 24h."
              : "Bem-vindo à Advindex! Sua conta foi criada. Verifique seu e-mail para ativar."}
          </p>
          <Link href="/">
            <Button className="rounded-xl px-8 shadow-clay-btn">Ir para o início</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-primary/90 to-slate-800 relative overflow-hidden flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2.5 z-10 relative">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-2xl text-white">Advocacia<span className="text-white/60">Hub</span></span>
        </Link>

        <div className="z-10 relative text-white">
          <h2 className="text-3xl font-display font-bold mb-6">
            {role === "lawyer"
              ? "Para Advogados e Escritórios"
              : role === "client"
              ? "Para quem precisa de ajuda jurídica"
              : "Junte-se à maior plataforma jurídica do Brasil"}
          </h2>
          <ul className="space-y-3">
            {(role === "lawyer" ? BENEFITS_LAWYER : BENEFITS_CLIENT).map((benefit, i) => (
              <motion.li
                key={benefit}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 text-white/80"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                {benefit}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="z-10 relative bg-white/10 rounded-2xl p-5 border border-white/10">
          <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Plataforma em números</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { v: "10k+", l: "Advogados" },
              { v: "4.8★", l: "Avaliação média" },
              { v: "100%", l: "OAB verificada" },
            ].map(s => (
              <div key={s.l}>
                <p className="text-xl font-bold text-white">{s.v}</p>
                <p className="text-white/50 text-xs mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-white blur-3xl" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl">Advocacia<span className="text-primary">Hub</span></span>
          </Link>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-8">
                  <h1 className="text-3xl font-display font-bold">Crie sua conta</h1>
                  <p className="text-muted-foreground mt-2">Escolha como você vai usar a plataforma</p>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-8">
                  {[
                    {
                      key: "client" as Role,
                      icon: <UserCheck className="w-8 h-8" />,
                      title: "Sou cliente",
                      desc: "Preciso encontrar um advogado para meu caso",
                      color: "border-primary bg-primary/5",
                      labelColor: "text-primary",
                    },
                    {
                      key: "lawyer" as Role,
                      icon: <Briefcase className="w-8 h-8" />,
                      title: "Sou advogado",
                      desc: "Quero cadastrar meu perfil e captar clientes",
                      color: "border-violet-400 bg-violet-50",
                      labelColor: "text-violet-600",
                    },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setRole(opt.key)}
                      className={`flex items-center gap-5 p-5 rounded-2xl border-2 text-left transition-all hover:shadow-md ${
                        role === opt.key ? opt.color + " shadow-md" : "border-border bg-card hover:border-border/80"
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        role === opt.key ? "bg-white shadow-sm" : "bg-muted"
                      }`}>
                        <span className={role === opt.key ? opt.labelColor : "text-muted-foreground"}>{opt.icon}</span>
                      </div>
                      <div>
                        <p className={`font-semibold text-base ${role === opt.key ? opt.labelColor : "text-foreground"}`}>{opt.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{opt.desc}</p>
                      </div>
                      {role === opt.key && (
                        <CheckCircle2 className={`w-5 h-5 ml-auto flex-shrink-0 ${opt.labelColor}`} />
                      )}
                    </button>
                  ))}
                </div>

                <Button
                  disabled={!role}
                  onClick={() => setStep(2)}
                  className="w-full h-12 rounded-xl text-base font-semibold shadow-clay-btn"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Já tem conta?{" "}
                  <Link href="/login" className="text-primary font-medium hover:underline">Entrar</Link>
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                  ← Voltar
                </button>

                <div className="mb-6">
                  <h1 className="text-2xl font-display font-bold">
                    {role === "lawyer" ? "Dados do Advogado" : "Seus dados"}
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm">Preencha as informações abaixo para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Nome completo</Label>
                    <Input
                      value={form.name}
                      onChange={handleChange("name")}
                      placeholder={role === "lawyer" ? "Dr(a). Seu Nome" : "Seu nome completo"}
                      className="h-12 rounded-xl bg-muted/50"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>E-mail</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      placeholder="seu@email.com"
                      className="h-12 rounded-xl bg-muted/50"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Telefone / WhatsApp</Label>
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={handleChange("phone")}
                      placeholder="(00) 00000-0000"
                      className="h-12 rounded-xl bg-muted/50"
                    />
                  </div>

                  {role === "lawyer" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Número OAB</Label>
                        <Input
                          value={form.oab}
                          onChange={handleChange("oab")}
                          placeholder="123456"
                          className="h-12 rounded-xl bg-muted/50"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Seccional OAB</Label>
                        <Input
                          value={form.state}
                          onChange={handleChange("state")}
                          placeholder="SP"
                          maxLength={2}
                          className="h-12 rounded-xl bg-muted/50 uppercase"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label>Senha</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange("password")}
                        placeholder="Mínimo 8 caracteres"
                        className="h-12 rounded-xl bg-muted/50 pr-12"
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Ao criar sua conta, você concorda com os{" "}
                    <a href="#" className="text-primary hover:underline">Termos de Uso</a>{" "}
                    e{" "}
                    <a href="#" className="text-primary hover:underline">Política de Privacidade</a>.
                  </p>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl text-base font-semibold shadow-clay-btn mt-2"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Criando conta...
                      </span>
                    ) : "Criar conta gratuita"}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-center gap-1.5 mt-6 text-xs text-muted-foreground/60">
            <Shield className="w-3.5 h-3.5" />
            Seus dados estão protegidos com criptografia SSL
          </div>
        </motion.div>
      </div>
    </div>
  );
}
