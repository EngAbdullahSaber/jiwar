import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: Omit<PaginationProps, 'totalItems' | 'itemsPerPage'>) {
  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 shadow-sm border border-transparent",
          "bg-light dark:bg-dark/50 hover:bg-background dark:hover:bg-gray-700 hover:border-[#B39371]/20",
          "text-muted-foreground hover:text-[#4A1B1B] dark:hover:text-[#D4B594]",
          "disabled:opacity-30 disabled:pointer-events-none"
        )}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      <div className={cn(
        "flex items-center gap-1.5 p-1 rounded-2xl border border-border/50",
        "bg-light dark:bg-dark/40"
      )}>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={cn(
              "w-8 h-8 rounded-lg text-xs font-black transition-all duration-500",
              currentPage === i + 1 
                ? "bg-[#4A1B1B] text-white shadow-xl shadow-[#4A1B1B]/20" 
                : "text-muted-foreground hover:bg-background dark:hover:bg-gray-800 hover:text-[#4A1B1B] dark:hover:text-[#D4B594]"
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 shadow-sm border border-transparent",
          "bg-light dark:bg-dark/50 hover:bg-background dark:hover:bg-gray-700 hover:border-[#B39371]/20",
          "text-muted-foreground hover:text-[#4A1B1B] dark:hover:text-[#D4B594]",
          "disabled:opacity-30 disabled:pointer-events-none"
        )}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
