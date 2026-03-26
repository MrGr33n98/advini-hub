import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
  className?: string;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  
  const pages: (number | "...")[] = [];
  
  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, "...", total);
  } else if (current >= total - 3) {
    pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }
  
  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = "resultados",
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const from = (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center gap-4 ${className}`}
    >
      {/* Count info */}
      <p className="text-sm text-muted-foreground">
        Exibindo <span className="font-semibold text-foreground">{from}–{to}</span> de{" "}
        <span className="font-semibold text-foreground">{totalItems}</span> {itemLabel}
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1.5">
        {/* First page */}
        <Button
          variant="outline"
          size="icon"
          className="w-9 h-9 rounded-xl hidden sm:flex"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          title="Primeira página"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        {/* Prev */}
        <Button
          variant="outline"
          size="icon"
          className="w-9 h-9 rounded-xl"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pages.map((page, idx) =>
            page === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm select-none"
              >
                ···
              </span>
            ) : (
              <motion.button
                key={page}
                whileTap={{ scale: 0.92 }}
                onClick={() => onPageChange(page as number)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? "bg-primary text-white shadow-md shadow-primary/25 scale-105"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:border-border"
                }`}
              >
                {page}
              </motion.button>
            )
          )}
        </div>

        {/* Next */}
        <Button
          variant="outline"
          size="icon"
          className="w-9 h-9 rounded-xl"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Próxima página"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="outline"
          size="icon"
          className="w-9 h-9 rounded-xl hidden sm:flex"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="Última página"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile quick-jump dots */}
      <div className="flex gap-1.5 sm:hidden">
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const page = totalPages <= 5 ? i + 1 : Math.max(1, currentPage - 2) + i;
          if (page > totalPages) return null;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-2 h-2 rounded-full transition-all ${
                page === currentPage ? "bg-primary scale-125" : "bg-border hover:bg-muted-foreground"
              }`}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
