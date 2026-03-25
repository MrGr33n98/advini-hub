import { Badge } from "@/components/ui/badge";
import type { Specialty } from "@workspace/api-client-react";

export function SpecialtyBadge({ specialty, className = "" }: { specialty: Specialty, className?: string }) {
  return (
    <Badge 
      variant="secondary" 
      className={`bg-slate-100 text-slate-700 hover:bg-slate-200 border-none shadow-sm rounded-lg px-3 py-1 font-medium ${className}`}
    >
      {specialty.name}
    </Badge>
  );
}
