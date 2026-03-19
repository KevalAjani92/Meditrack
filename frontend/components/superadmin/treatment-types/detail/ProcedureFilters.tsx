"use client";

import { Search, LayoutGrid, Table as TableIcon, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProcedureFiltersProps {
  viewMode: "table" | "grid";
  setViewMode: (mode: "table" | "grid") => void;
  search: string;
  setSearch: (val: string) => void;
  typeFilter: "All" | "Surgical" | "Non-Surgical";
  setTypeFilter: (val: "All" | "Surgical" | "Non-Surgical") => void;
}

export default function ProcedureFilters({
  viewMode,
  setViewMode,
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
}: ProcedureFiltersProps) {

  const hasFilters = search || typeFilter !== "All";
  
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
      <div className="flex flex-1 w-full md:w-auto gap-3 items-center flex-wrap">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search procedure code/name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-lg bg-background focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        {/* Type Filter */}
        <div className="relative">
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="pl-8 pr-3 py-2 text-sm border border-input rounded-lg bg-background focus:ring-1 focus:ring-primary outline-none cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Surgical">Surgical Only</option>
            <option value="Non-Surgical">Non-Surgical</option>
          </select>
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setTypeFilter("All"); }} className="text-muted-foreground h-9 px-2">
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