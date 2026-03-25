import { ShieldCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VerifiedBadgeProps {
  className?: string;
  showText?: boolean;
}

export function VerifiedBadge({ className = "", showText = false }: VerifiedBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium text-xs border border-accent/20 cursor-help ${className}`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          {showText && <span>OAB Verificada</span>}
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-slate-900 text-white border-none shadow-xl">
        <p className="text-xs">Registro OAB verificado pela nossa equipe.</p>
      </TooltipContent>
    </Tooltip>
  );
}
