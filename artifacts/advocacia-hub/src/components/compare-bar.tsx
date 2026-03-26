import { useCompare } from "@/contexts/compare-context";
import { useLocation } from "wouter";
import { X, GitCompareArrows, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { VerifiedBadge } from "./verified-badge";

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [, navigate] = useLocation();

  return (
    <AnimatePresence>
      {compareList.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground shrink-0">
              <GitCompareArrows className="w-5 h-5 text-primary" />
              Comparar ({compareList.length}/3)
            </div>

            <div className="flex gap-3 flex-1 min-w-0 flex-wrap">
              {compareList.map(lawyer => (
                <div key={lawyer.id} className="flex items-center gap-2 bg-muted/60 rounded-xl px-3 py-2 min-w-0">
                  <img
                    src={lawyer.photoUrl || "/images/lawyer-placeholder-1.png"}
                    alt={lawyer.fullName}
                    className="w-8 h-8 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate max-w-[120px]">{lawyer.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[120px]">{lawyer.city}, {lawyer.state}</p>
                  </div>
                  {lawyer.isVerified && <VerifiedBadge className="w-4 h-4 shrink-0" />}
                  <button
                    onClick={() => removeFromCompare(lawyer.id)}
                    className="ml-1 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {compareList.length < 3 && (
                <div className="flex items-center gap-2 border-2 border-dashed border-border rounded-xl px-4 py-2 text-xs text-muted-foreground">
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={clearCompare} className="text-muted-foreground rounded-xl">
                Limpar
              </Button>
              <Button
                size="sm"
                disabled={compareList.length < 2}
                onClick={() => navigate("/comparar")}
                className="rounded-xl shadow-clay-btn gap-2"
              >
                <GitCompareArrows className="w-4 h-4" />
                Comparar agora
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
