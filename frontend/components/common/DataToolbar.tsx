"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  LayoutGrid,
  Table as TableIcon,
  Filter,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataToolbarProps {
  searchPlaceholder?: string;
  viewMode: "table" | "grid";
  setViewMode: (mode: "table" | "grid") => void;

  filters: Record<string, string>;
  setFilters: (filters: Record<string, string>) => void;

  filterConfig?: {
    key: string;
    label: string;
    options: { label: string; value: string }[];
  }[];
}

export default function DataToolbar({
  searchPlaceholder = "Search...",
  viewMode,
  setViewMode,
  filters,
  setFilters,
  filterConfig = [],
}: DataToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateFilter = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    const cleared: Record<string, string> = {};

    Object.keys(filters).forEach((key) => {
      cleared[key] = key === "search" ? "" : "All";
    });

    setFilters(cleared);
  };

  const hasSearch = filters.search && filters.search.trim() !== "";

  const hasActiveFilters =
    filterConfig.some((f) => filters[f.key] !== "All");

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
      {/* Search + Filter */}
      <div className="flex flex-1 gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={filters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-lg bg-background focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        {/* Dropdown */}
        {filterConfig.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="relative" ref={ref}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-primary/5 transition-colors",
                  isOpen || hasActiveFilters
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-input text-muted-foreground",
                )}
              >
                <Filter className="w-4 h-4" />
                Filter
                {hasActiveFilters && (
                  <span className="ml-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>

              {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 p-4 bg-popover border rounded-xl shadow-lg z-50">
                  <div className="space-y-4">
                    {filterConfig.map((config) => (
                      <div key={config.key} className="space-y-1">
                        <label className="text-xs font-medium">
                          {config.label}
                        </label>
                        <select
                          value={filters[config.key]}
                          onChange={(e) =>
                            updateFilter(config.key, e.target.value)
                          }
                          className="w-full px-2 py-1.5 text-sm border rounded-md"
                        >
                          {config.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 text-xs text-muted-foreground hover:text-destructive"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        )}
        {/* 🔥 NEW Clear Button */}
        {(hasActiveFilters || hasSearch) && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm border border-input rounded-lg text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* View Toggle */}
      <div className="flex items-center p-1 bg-muted rounded-lg border">
        <button
          onClick={() => setViewMode("table")}
          className={cn(
            "p-1.5 rounded-md",
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
            "p-1.5 rounded-md",
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
