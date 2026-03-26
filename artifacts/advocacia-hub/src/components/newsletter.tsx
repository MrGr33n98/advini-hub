import { useState } from "react";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section className="bg-gradient-to-br from-primary to-primary/80 py-16 px-4">
      <div className="max-w-3xl mx-auto text-center text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-5">
            <Mail className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-3">Receba dicas jurídicas gratuitas</h2>
          <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">
            Assine nossa newsletter e receba semanalmente artigos, atualizações legislativas e dicas dos melhores advogados do Brasil.
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-3 bg-white/20 rounded-2xl px-8 py-5 text-white font-semibold text-lg"
              >
                <CheckCircle2 className="w-7 h-7 text-emerald-300" />
                Inscrito com sucesso! Obrigado.
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="h-13 rounded-2xl bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/60 flex-1 text-base px-5"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-13 px-7 rounded-2xl bg-white text-primary font-bold hover:bg-white/90 shadow-lg gap-2 shrink-0"
                >
                  {loading ? (
                    <span className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                  ) : (
                    <>Assinar <ArrowRight className="w-4 h-4" /></>
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-white/50 text-xs mt-5">
            Sem spam. Cancele quando quiser. Já são +12.000 inscritos.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
