"use client";

import { useState, useEffect, useRef } from "react";
import { Search, LayoutGrid, Table as TableIcon, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button"; // Using your generic UI button
import { cn } from "@/lib/utils";

// Define the shape of our filters
export interface FilterState {
  search: string;
  status: "All" | "Active" | "Inactive";
  subscription: "All" | "Valid" | "Expired";
}

interface GroupFiltersProps {
  viewMode: "table" | "grid";
  setViewMode: (mode: "table" | "grid") => void;
  // New: Pass filter state down
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

export default function GroupFilters({ 
  viewMode, 
  setViewMode,
  filters,
  setFilters 
}: GroupFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper to update a single filter
  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  // Helper to clear specific fields (reset to default)
  const clearFilters = () => {
    setFilters({
      search: filters.search, // Keep search text? usually yes, or clear all.
      status: "All",
      subscription: "All"
    });
    setIsFilterOpen(false);
  };

  const hasActiveFilters = filters.status !== "All" || filters.subscription !== "All";

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
      
      {/* Left Side: Search & Filter */}
      <div className="flex flex-1 w-full md:w-auto gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search groups..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-lg bg-background focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
          />
        </div>

        {/* Filter Dropdown Container */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors",
              isFilterOpen || hasActiveFilters
                ? "border-primary/50 bg-primary/5 text-primary"
                : "border-input hover:bg-muted text-muted-foreground"
            )}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
            {hasActiveFilters && (
              <span className="ml-1 w-2 h-2 rounded-full bg-primary" />
            )}
          </button>

          {/* Custom Dropdown Menu */}
          {isFilterOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 p-4 bg-popover text-popover-foreground border border-border rounded-xl shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-sm">Filter Groups</h4>
                {hasActiveFilters && (
                  <button 
                    onClick={clearFilters}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Status Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Operating Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => updateFilter("status", e.target.value)}
                    className="w-full px-2 py-1.5 text-sm rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Subscription Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Subscription</label>
                  <select
                    value={filters.subscription}
                    onChange={(e) => updateFilter("subscription", e.target.value)}
                    className="w-full px-2 py-1.5 text-sm rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="All">All Subscriptions</option>
                    <option value="Valid">Valid / Active</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Inline Clear Button (Visible if filters active but dropdown closed) */}
        {hasActiveFilters && !isFilterOpen && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors px-2"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Right Side: View Toggle (Unchanged) */}
      <div className="flex items-center p-1 bg-muted rounded-lg border border-border">
        <button
          onClick={() => setViewMode("table")}
          className={cn(
            "p-1.5 rounded-md transition-all",
            viewMode === "table" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <TableIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewMode("grid")}
          className={cn(
            "p-1.5 rounded-md transition-all",
            viewMode === "grid" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}