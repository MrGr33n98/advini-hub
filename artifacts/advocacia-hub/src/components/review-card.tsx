import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { StarRating } from "./star-rating";
import { Badge } from "@/components/ui/badge";
import type { Review } from "@workspace/api-client-react";
import { MessageSquareQuote } from "lucide-react";

export function ReviewCard({ review }: { review: Review }) {
  const getOutcomeColor = (outcome?: string | null) => {
    switch (outcome) {
      case 'vencido': return 'bg-green-100 text-green-700 border-green-200';
      case 'perdido': return 'bg-red-100 text-red-700 border-red-200';
      case 'acordo': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'em_andamento': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getOutcomeLabel = (outcome?: string | null) => {
    switch (outcome) {
      case 'vencido': return 'Causa Ganha';
      case 'perdido': return 'Causa Perdida';
      case 'acordo': return 'Acordo Realizado';
      case 'em_andamento': return 'Em Andamento';
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative">
      <MessageSquareQuote className="absolute top-6 right-6 w-8 h-8 text-slate-100" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <StarRating rating={review.rating} showCount={false} />
          <div className="flex gap-2 items-center mt-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Caso: {review.caseType}
            </span>
            {review.caseOutcome && (
              <Badge variant="outline" className={`text-[10px] py-0 border ${getOutcomeColor(review.caseOutcome)}`}>
                {getOutcomeLabel(review.caseOutcome)}
              </Badge>
            )}
          </div>
        </div>
        <span className="text-xs text-slate-400">
          {format(new Date(review.createdAt), "MMMM yyyy", { locale: ptBR })}
        </span>
      </div>
      
      <p className="text-slate-600 text-sm leading-relaxed italic relative z-10">
        "{review.comment}"
      </p>
    </div>
  );
}
