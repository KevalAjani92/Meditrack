"use client";

import { Search, LayoutGrid, Table as TableIcon, X, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DepartmentDropdown } from "@/types/doctor";

interface DoctorFiltersProps {
  viewMode: "table" | "grid";
  setViewMode: (mode: "table" | "grid") => void;
  search: string;
  setSearch: (val: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (val: string) => void;
  departments: DepartmentDropdown[];
  onAdd: () => void;
}

export default function DoctorFilters({
  viewMode,
  setViewMode,
  search,
  setSearch,
  departmentFilter,
  setDepartmentFilter,
  departments,
  onAdd,
}: DoctorFiltersProps) {
  
  const hasFilters = search || departmentFilter !== "All";

  const clearFilters = () => {
    setSearch("");
    setDepartmentFilter("All");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
      
      {/* Search & Filters */}
      <div className="flex flex-1 w-full md:w-auto gap-3 items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search doctor or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-lg bg-background focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="pl-8 pr-3 py-2 text-sm border border-input rounded-lg bg-background focus:ring-1 focus:ring-primary outline-none cursor-pointer"
          >
            <option value="All">All Departments</option>
            {departments.map(dept => (
              <option key={dept.department_id} value={String(dept.department_id)}>{dept.department_name}</option>
            ))}
          </select>
        </div>

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

        <Button onClick={onAdd} className="gap-2 shadow-sm whitespace-nowrap">
          <Plus className="w-4 h-4" /> Add Doctor
        </Button>
      </div>
    </div>
  );
}