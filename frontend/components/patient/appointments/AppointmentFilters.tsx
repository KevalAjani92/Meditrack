"use client";

import { Search, LayoutGrid, Table as TableIcon, X, Plus, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Props {
  viewMode: "table" | "grid";
  setViewMode: (mode: "table" | "grid") => void;
  search: string;
  setSearch: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  dateFilter: string;
  setDateFilter: (val: string) => void;
}

export default function AppointmentFilters({
  viewMode, setViewMode, search, setSearch, statusFilter, setStatusFilter, dateFilter, setDateFilter
}: Props) {
  const router = useRouter();
  const hasFilters = search || statusFilter !== "All" || dateFilter !== "All";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDateFilter("All");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
      
      {/* Search & Filters */}
      <div className="flex flex-1 w-full md:w-auto gap-3 items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search doctor or hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-lg bg-background focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm border border-input rounded-lg bg-background focus:ring-1 focus:ring-primary outline-none cursor-pointer">
          <option value="All">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <div className="relative">
          <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="pl-8 pr-3 py-2 text-sm border border-input rounded-lg bg-background focus:ring-1 focus:ring-primary outline-none cursor-pointer">
            <option value="All">All Time</option>
            <option value="This Month">This Month</option>
            <option value="Last 3 Months">Last 3 Months</option>
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
          <button onClick={() => setViewMode("table")} className={cn("p-1.5 rounded-md transition-all", viewMode === "table" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            <TableIcon className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode("grid")} className={cn("p-1.5 rounded-md transition-all", viewMode === "grid" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        <Button onClick={() => router.push("/patient/appointment-booking")} className="gap-2 shadow-sm whitespace-nowrap">
          <Plus className="w-4 h-4" /> Book New Appointment
        </Button>
      </div>
    </div>
  );
}