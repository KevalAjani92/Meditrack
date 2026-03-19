"use client";

import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FilterState { search: string; type: string; status: string; }
interface Props { filters: FilterState; setFilters: React.Dispatch<React.SetStateAction<FilterState>>; }

export default function QueueFilters({ filters, setFilters }: Props) {
  const handleChange = (f: keyof FilterState, v: string) => setFilters(p => ({ ...p, [f]: v }));
  const inputCls = "px-3 py-2 text-sm border border-input rounded-md bg-background focus:ring-1 focus:ring-primary outline-none";

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={filters.search} onChange={e => handleChange("search", e.target.value)} placeholder="Search Token or Patient..." className={`w-full pl-9 ${inputCls}`} />
      </div>
      <select value={filters.type} onChange={e => handleChange("type", e.target.value)} className={inputCls}>
        <option value="All">All Visit Types</option>
        <option value="Appointment">Appointment</option>
        <option value="Walk-In">Walk-In</option>
        <option value="Emergency">Emergency</option>
      </select>
      <select value={filters.status} onChange={e => handleChange("status", e.target.value)} className={inputCls}>
        <option value="All">All Statuses</option>
        <option value="Waiting">Waiting</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Skipped">Skipped / No-Show</option>
      </select>
    </div>
  );
}