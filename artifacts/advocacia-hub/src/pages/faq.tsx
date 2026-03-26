import { Layout } from "@/components/layout";
import { useState } from "react";
import { HelpCircle, ChevronDown, Search, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    category: "Para Clientes",
    color: "text-blue-600",
    bg: "bg-blue-50",
    items: [
      {
        q: "Como encontro o advogado certo para meu caso?",
        a: "Use nossa busca com filtros de especialidade e cidade. Leia o perfil completo do advogado, veja as avaliações de outros clientes e verifique a badge OAB verificada. Ao encontrar um profissional de interesse, envie uma mensagem pelo formulário do perfil."
      },
      {
        q: "O contato com o advogado pelo site é gratuito?",
        a: "Sim! O envio de mensagens e contato inicial através da plataforma é completamente gratuito para clientes. Os honorários são combinados diretamente com o advogado."
      },
      {
        q: "Os advogados são verificados?",
        a: "Sim. Todos os advogados com o badge verde de verificação tiveram seu número da OAB confirmado em nosso sistema. Advogados sem o badge ainda podem ser legítimos, mas recomendamos verificar manualmente."
      },
      {
        q: "Posso comparar advogados antes de escolher?",
        a: "Sim! Use o botão 'Comparar' nos cards de busca para adicionar até 3 advogados à comparação. A tela de comparação exibe lado a lado: avaliação, experiência, preço, idiomas e especialidades."
      },
      {
        q: "Posso salvar advogados para ver depois?",
        a: "Sim! Clique no ícone de coração em qualquer card de advogado para salvar nos seus favoritos. Acesse a página 'Favoritos' pelo menu para ver todos os salvos."
      },
    ]
  },
  {
    category: "Para Advogados",
    color: "text-violet-600",
    bg: "bg-violet-50",
    items: [
      {
        q: "Como cadastro meu perfil como advogado?",
        a: "Clique em 'Cadastrar' no menu e selecione 'Sou advogado'. Preencha seus dados, número da OAB e seccional. Após a verificação (até 24h), seu perfil estará visível na plataforma."
      },
      {
        q: "Quanto custa anunciar na plataforma?",
        a: "Oferecemos um plano gratuito com recursos básicos. Para mais visibilidade, os planos pagos começam em R$ 99/mês (Pro) e R$ 299/mês (Escritório). Veja a página de Preços para comparar os planos."
      },
      {
        q: "Como funciona o destaque na busca?",
        a: "Perfis dos planos Pro e Escritório aparecem com prioridade nas buscas relevantes para suas especialidades. O plano Escritório garante posição no topo das buscas."
      },
      {
        q: "Posso publicar artigos no blog?",
        a: "Sim! Nos planos Pro e Escritório, você pode publicar artigos jurídicos no blog da plataforma, aumentando sua visibilidade como especialista e recebendo mais leads orgânicos."
      },
    ]
  },
  {
    category: "Plataforma e Segurança",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    items: [
      {
        q: "Como são moderadas as avaliações?",
        a: "Avaliações com nota ≥ 3 e comentário detalhado (≥ 50 caracteres) são aprovadas automaticamente. Avaliações abaixo desse critério passam por revisão manual antes de serem publicadas."
      },
      {
        q: "Meus dados pessoais estão seguros?",
        a: "Sim. Utilizamos criptografia SSL em todas as comunicações e seguimos as diretrizes da LGPD (Lei Geral de Proteção de Dados). Seus dados nunca são vendidos a terceiros."
      },
      {
        q: "O AdvocaciaHub intermedia pagamentos entre cliente e advogado?",
        a: "Não. A plataforma facilita o contato entre clientes e advogados, mas os honorários e pagamentos são acordados e realizados diretamente entre as partes."
      },
    ]
  }
];

export default function FaqPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [questionForm, setQuestionForm] = useState({ name: "", email: "", question: "" });
  const [submitted, setSubmitted] = useState(false);

  const toggle = (key: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const filtered = FAQS.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 800));
    setSubmitted(true);
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-slate-900 to-primary/80 py-16 text-center text-white px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <HelpCircle className="w-12 h-12 mx-auto mb-5 text-primary-foreground/70" />
          <h1 className="text-4xl font-display font-bold mb-4">Perguntas Frequentes</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            Encontre respostas para as principais dúvidas sobre a plataforma.
          </p>
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar perguntas..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/15 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 text-base"
            />
          </div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Nenhum resultado para "{search}"</p>
            <Button variant="outline" className="mt-4 rounded-xl" onClick={() => setSearch("")}>
              Limpar busca
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            {filtered.map(cat => (
              <div key={cat.category}>
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${cat.bg} ${cat.color} text-sm font-semibold mb-4`}>
                  {cat.category}
                </div>
                <div className="space-y-3">
                  {cat.items.map((item, i) => {
                    const key = `${cat.category}-${i}`;
                    const isOpen = openItems.has(key);
                    return (
                      <div key={key} className="rounded-2xl border border-border overflow-hidden bg-white shadow-sm">
                        <button
                          onClick={() => toggle(key)}
                          className="w-full flex justify-between items-center p-5 text-left font-medium text-slate-900 hover:bg-slate-50 transition-colors gap-4"
                        >
                          <span>{item.q}</span>
                          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                            <ChevronDown className={`w-5 h-5 ${isOpen ? cat.color : "text-muted-foreground"}`} />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 text-sm text-slate-600 border-t border-border pt-4 leading-relaxed">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ask a question */}
        <div className="mt-16 rounded-3xl bg-gradient-to-br from-slate-50 to-primary/5 border border-border p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Não encontrou o que procura?</h2>
              <p className="text-sm text-muted-foreground">Envie sua pergunta e responderemos em até 24h.</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="ok" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="font-semibold text-lg">Pergunta enviada!</p>
                <p className="text-muted-foreground text-sm mt-1">Responderemos no e-mail fornecido em até 24h.</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmitQuestion} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome</Label>
                    <Input value={questionForm.name} onChange={e => setQuestionForm(p => ({ ...p, name: e.target.value }))} placeholder="Seu nome" className="mt-1.5 rounded-xl" required />
                  </div>
                  <div>
                    <Label>E-mail</Label>
                    <Input type="email" value={questionForm.email} onChange={e => setQuestionForm(p => ({ ...p, email: e.target.value }))} placeholder="seu@email.com" className="mt-1.5 rounded-xl" required />
                  </div>
                </div>
                <div>
                  <Label>Sua pergunta</Label>
                  <Textarea value={questionForm.question} onChange={e => setQuestionForm(p => ({ ...p, question: e.target.value }))} placeholder="Descreva sua dúvida..." className="mt-1.5 rounded-xl resize-none" rows={4} required />
                </div>
                <Button type="submit" className="rounded-xl gap-2 shadow-clay-btn">
                  <Send className="w-4 h-4" /> Enviar pergunta
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">Prefere falar com um especialista agora?{" "}
            <Link href="/buscar" className="text-primary font-medium hover:underline">Encontre um advogado</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
