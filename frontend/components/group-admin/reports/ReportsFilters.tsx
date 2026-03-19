"use client";

import { Calendar, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportFilters } from "@/types/reports";
import ExportActions from "./ExportActions";

interface ReportsFiltersProps {
  filters: ReportFilters;
  setFilters: (filters: ReportFilters) => void;
}

export default function ReportsFilters({ filters, setFilters }: ReportsFiltersProps) {
  
  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, dateRange: e.target.value as any });
  };

  const handleHospitalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, hospitalId: e.target.value });
  };

  const toggleCompare = () => {
    setFilters({ ...filters, compareMode: !filters.compareMode });
  };

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border py-4 mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
      
      {/* Left: Filters */}
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Date Range */}
        <div className="relative">
          <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={filters.dateRange}
            onChange={handleRangeChange}
            className="pl-9 pr-8 py-2 text-sm border border-input rounded-lg bg-card shadow-sm focus:ring-1 focus:ring-primary outline-none cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="custom">Custom Range...</option>
          </select>
        </div>

        {/* Hospital Selector */}
        <div className="relative">
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={filters.hospitalId}
            onChange={handleHospitalChange}
            className="pl-9 pr-8 py-2 text-sm border border-input rounded-lg bg-card shadow-sm focus:ring-1 focus:ring-primary outline-none cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <option value="all">All Hospitals</option>
            <option value="h1">Apex Heart Institute</option>
            <option value="h2">City West Clinic</option>
            <option value="h3">North General</option>
          </select>
        </div>

        {/* Compare Toggle */}
        <button
          onClick={toggleCompare}
          className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
            filters.compareMode
              ? "bg-primary/10 border-primary text-primary"
              : "bg-card border-input text-muted-foreground hover:text-foreground"
          }`}
        >
          Compare vs Previous
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <ExportActions filters={filters} />
      </div>
    </div>
  );
}