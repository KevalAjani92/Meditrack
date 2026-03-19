"use client";

import { Search, LayoutGrid, Table as TableIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DepartmentFiltersProps {
  viewMode: "table" | "grid";
  setViewMode: (mode: "table" | "grid") => void;
  search: string;
  setSearch: (val: string) => void;
}

export default function DepartmentFilters({ viewMode, setViewMode, search, setSearch }: DepartmentFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
      
      {/* Search Input */}
      <div className="flex flex-1 w-full md:w-auto gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-lg bg-background focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>

        {search && (
          <Button variant="ghost" size="sm" onClick={() => setSearch("")} className="text-muted-foreground h-9 px-2">
            <X className="w-4 h-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* View Toggle */}
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
    </div>
  );
}