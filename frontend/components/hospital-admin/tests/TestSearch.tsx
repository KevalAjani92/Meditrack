"use client";

import { Search, Filter } from "lucide-react";

interface Props {
  searchValue: string;
  onSearchChange: (val: string) => void;
  departmentValue: string;
  onDepartmentChange: (val: string) => void;
  departments: string[];
  placeholder?: string;
}

export default function TestSearch({ searchValue, onSearchChange, departmentValue, onDepartmentChange, departments, placeholder = "Search tests..." }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input 
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-shadow"
        />
      </div>
      <div className="relative w-full sm:w-48 shrink-0">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <select
          value={departmentValue}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer truncate"
        >
          <option value="All">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>
    </div>
  );
}