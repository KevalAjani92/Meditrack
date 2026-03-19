"use client";

import { Search, LayoutGrid, Table as TableIcon, X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminFiltersProps {
  viewMode: "table" | "grid";
  setViewMode: (mode: "table" | "grid") => void;
  search: string;
  setSearch: (val: string) => void;
  statusFilter: "All" | "Active" | "Inactive";
  setStatusFilter: (val: "All" | "Active" | "Inactive") => void;
}

export default function AdminFilters({
  viewMode,
  setViewMode,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}: AdminFiltersProps) {
  
  const hasFilters = search || statusFilter !== "All";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
      
      {/* Search & Filter */}
      <div className="flex flex-1 w-full md:w-auto gap-3 items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name, email, hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-lg bg-background focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 text-sm border border-input rounded-lg bg-background focus:ring-1 focus:ring-primary outline-none cursor-pointer"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground h-9 px-2">
            <X className="w-4 h-4 mr-1" /> Clear
          </Button>
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

      </div>
    </div>
  );
}