"use client";

import {
  Search,
  LayoutGrid,
  Table as TableIcon,
  X,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAllDepartments } from "@/hooks/departments/useDepartments";

interface TestFiltersProps {
  viewMode: "table" | "grid";
  setViewMode: (mode: "table" | "grid") => void;
  search: string;
  setSearch: (val: string) => void;
  statusFilter: "All" | "Active" | "Inactive";
  setStatusFilter: (val: "All" | "Active" | "Inactive") => void;
  isScoped: boolean;
  departmentId?: number;
  setDepartmentId?: (id: number | undefined) => void;
}

export default function TestFilters({
  viewMode,
  setViewMode,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  isScoped,
  departmentId,
  setDepartmentId,
}: TestFiltersProps) {
  const hasActiveFilters =
    search ||
    statusFilter !== "All" ||
    (departmentId !== undefined && departmentId !== null);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDepartmentId?.(undefined);
  };
  const { data, isLoading } = useAllDepartments();
  const departments = data || [];
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
      {/* Search & Selectors */}
      <div className="flex flex-1 w-full md:w-auto gap-3 items-center flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name, code, type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-lg bg-background focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="pl-8 pr-3 py-2 text-sm border border-input rounded-lg bg-background focus:ring-1 focus:ring-primary outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>

        {/* Global Mode: Department Filter Placeholder (Not functional in this mock, but UI visible) */}
        {!isScoped && (
          <select
            value={departmentId || ""}
            onChange={(e) => setDepartmentId?.(Number(e.target.value))}
            className="px-3 py-2 text-sm border border-input rounded-lg bg-background focus:ring-1 focus:ring-primary outline-none cursor-pointer max-w-[150px]"
          >
            <option value="">All Departments</option>

            {isLoading ? (
              <option disabled>Loading...</option>
            ) : (
              departments.map((dept: any) => (
                <option key={dept.department_id} value={dept.department_id}>
                  {dept.department_name}
                </option>
              ))
            )}
          </select>
        )}

        {hasActiveFilters  && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            disabled={isScoped}
            className="text-muted-foreground h-9 px-2"
          >
            <X className="w-4 h-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* View Toggle */}
      <div className="flex items-center p-1 bg-muted rounded-lg border border-border hidden sm:flex">
        <button
          onClick={() => setViewMode("table")}
          className={cn(
            "p-1.5 rounded-md transition-all",
            viewMode === "table"
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <TableIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewMode("grid")}
          className={cn(
            "p-1.5 rounded-md transition-all",
            viewMode === "grid"
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
