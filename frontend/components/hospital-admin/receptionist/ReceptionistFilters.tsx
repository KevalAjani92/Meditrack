"use client";

import { Search, LayoutGrid, Table as TableIcon, X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReceptionistFiltersProps {
  viewMode: "table" | "grid";
  setViewMode: (mode: "table" | "grid") => void;
  search: string;
  setSearch: (val: string) => void;
  onAdd: () => void;
}

export default function ReceptionistFilters({
  viewMode,
  setViewMode,
  search,
  setSearch,
  onAdd,
}: ReceptionistFiltersProps) {
  
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
      
      {/* Search */}
      <div className="relative flex-1 w-full md:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search receptionist name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-8 py-2 text-sm border border-input rounded-lg bg-background focus:ring-1 focus:ring-primary outline-none transition-all"
        />
        {search && (
          <button 
            onClick={() => setSearch("")} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="flex items-center p-1 bg-muted rounded-lg border border-border hidden sm:flex">
          <button
            onClick={() => setViewMode("table")}
            className={cn("p-1.5 rounded-md transition-all", viewMode === "table" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={cn("p-1.5 rounded-md transition-all", viewMode === "grid" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        <Button onClick={onAdd} className="gap-2 shadow-sm whitespace-nowrap">
          <UserPlus className="w-4 h-4" /> Add Receptionist
        </Button>
      </div>
    </div>
  );
}