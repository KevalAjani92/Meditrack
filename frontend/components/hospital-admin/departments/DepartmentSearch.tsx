"use client";

import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function DepartmentSearch({ value, onChange, placeholder = "Search departments..." }: Props) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input 
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-shadow"
      />
    </div>
  );
}