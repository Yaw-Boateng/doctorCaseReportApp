import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PaginationWrapper({
  currentPage, // 0-indexed from your backend (0 = Page 1)
  totalPages,
  onPageChange,
  isLoading = false,
  className = "",
}) {
  if (totalPages <= 1) return null;

  // Generate the page numbers array with ellipses if needed
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      // Always include first page, last page, current page, and neighbors
      pages.push(0);
      
      let start = Math.max(1, currentPage - 1);
      let end = Math.min(totalPages - 2, currentPage + 1);

      if (currentPage <= 2) {
        end = 3;
      } else if (currentPage >= totalPages - 3) {
        start = totalPages - 4;
      }

      if (start > 1) pages.push("ellipsis-1");

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 2) pages.push("ellipsis-2");

      pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <div className={`flex items-center justify-between gap-4 mt-4 pt-2 text-xs w-full ${className}`}>
      {/* Dynamic item counter summary text */}
      <span className="text-muted-foreground select-none">
        Page <span className="font-medium text-foreground">{currentPage + 1}</span> of{" "}
        <span className="font-medium text-foreground">{totalPages}</span>
      </span>

      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0 || isLoading}
          className="h-8 gap-1 pl-2.5 text-[11px] border-border text-foreground font-medium hover:bg-muted"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Previous</span>
        </Button>

        {/* Numeric Page Array Tracks */}
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (typeof page === "string") {
              return (
                <div
                  key={`ellipsis-${idx}`}
                  className="h-8 w-8 flex items-center justify-center text-muted-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              );
            }

            const isCurrent = page === currentPage;
            return (
              <Button
                key={page}
                variant={isCurrent ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(page)}
                disabled={isLoading}
                className={`h-8 w-8 font-mono text-[11px] ${
                  isCurrent 
                    ? "bg-primary text-primary-foreground pointer-events-none" 
                    : "border-border text-foreground hover:bg-muted"
                }`}
              >
                {page + 1}
              </Button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage >= totalPages - 1 || isLoading}
          className="h-8 gap-1 pr-2.5 text-[11px] border-border text-foreground font-medium hover:bg-muted"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}