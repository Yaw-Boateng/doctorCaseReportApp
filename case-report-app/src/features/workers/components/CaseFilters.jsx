import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

export const CaseFilters = ({ searchTerm, onSearchChange, onAddClick }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-2">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Filter logs by patient identifier metrics..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-background/50 focus-visible:ring-1"
        />
      </div>
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <Button onClick={onAddClick} className="gap-2 tracking-wide text-xs font-medium shadow-sm">
          <Plus className="h-4 w-4" /> Log Medical Case
        </Button>
      </div>
    </div>
  );
};