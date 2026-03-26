import { createContext, useContext, useState, ReactNode } from "react";
import type { LawyerSummary } from "@workspace/api-client-react";

interface CompareContextType {
  compareList: LawyerSummary[];
  isInCompare: (id: number) => boolean;
  toggleCompare: (lawyer: LawyerSummary) => void;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
  canAdd: boolean;
}

const CompareContext = createContext<CompareContextType | null>(null);

const MAX_COMPARE = 3;

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<LawyerSummary[]>([]);

  const isInCompare = (id: number) => compareList.some(l => l.id === id);

  const toggleCompare = (lawyer: LawyerSummary) => {
    if (isInCompare(lawyer.id)) {
      setCompareList(prev => prev.filter(l => l.id !== lawyer.id));
    } else if (compareList.length < MAX_COMPARE) {
      setCompareList(prev => [...prev, lawyer]);
    }
  };

  const removeFromCompare = (id: number) => {
    setCompareList(prev => prev.filter(l => l.id !== id));
  };

  const clearCompare = () => setCompareList([]);

  return (
    <CompareContext.Provider
      value={{ compareList, isInCompare, toggleCompare, removeFromCompare, clearCompare, canAdd: compareList.length < MAX_COMPARE }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
