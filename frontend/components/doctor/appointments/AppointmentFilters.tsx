"use client";

import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FilterState { search: string; status: string; time: string; }
interface Props { filters: FilterState; setFilters: React.Dispatch<React.SetStateAction<FilterState>>; }

export default function AppointmentFilters({ filters, setFilters }: Props) {
  const handleChange = (f: keyof FilterState, v: string) => setFilters(p => ({ ...p, [f]: v }));
  const inputCls = "px-3 py-2 text-sm border border-input rounded-md bg-background focus:ring-1 focus:ring-primary outline-none";

  return (
    <Card className="p-3 border-border shadow-sm mb-6 flex flex-col md:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={filters.search} onChange={e => handleChange("search", e.target.value)} placeholder="Search Patient, Phone, Appt No..." className={`w-full pl-9 ${inputCls}`} />
      </div>
      <div className="flex items-center gap-3">
        <select value={filters.status} onChange={e => handleChange("status", e.target.value)} className={inputCls}>
          <option value="All">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Checked-In">Checked-In</option>
          <option value="Completed">Completed</option>
        </select>
        <select value={filters.time} onChange={e => handleChange("time", e.target.value)} className={inputCls}>
          <option value="All">All Day</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
        </select>
        <Button variant="secondary" className="gap-2 shrink-0"><Filter className="w-4 h-4" /> Filter</Button>
      </div>
    </Card>
  );
}