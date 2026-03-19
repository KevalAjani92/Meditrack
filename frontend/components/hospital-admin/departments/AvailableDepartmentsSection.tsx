"use client";

import { motion } from "framer-motion";
import { Department } from "@/types/department";
import DepartmentSearch from "./DepartmentSearch";
import DepartmentCard from "./DepartmentCard";
import { Button } from "@/components/ui/button";

interface Props {
  departments: Department[];
  search: string;
  onSearchChange: (val: string) => void;
  onAdd: (dept: Department) => void;
}

export default function AvailableDepartmentsSection({ departments, search, onSearchChange, onAdd }: Props) {
  return (
    // 1. FIX: Added a fixed height (e.g., h-[650px]) to prevent infinite stretching
    <div className="flex flex-col h-[650px] bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      
      {/* 2. FIX: Added shrink-0 so the header always maintains its exact size */}
      <div className="p-5 border-b border-border bg-muted/10 space-y-4 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-foreground">Available Master Departments</h2>
          <p className="text-sm text-muted-foreground">Select departments from the global registry to enable them for your hospital.</p>
        </div>
        <DepartmentSearch value={search} onChange={onSearchChange} placeholder="Search master catalog..." />
      </div>

      {/* 3. FIX: Replaced explicit h-[500px] with flex-1 AND min-h-0. 
          min-h-0 is the magic tailwind utility that forces flex children to scroll instead of expanding. */}
      <div className="p-5 flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-background/50">
        {departments.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center p-6 text-muted-foreground border-2 border-dashed border-border rounded-xl">
            <p>No available master departments match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {departments.map((dept, i) => (
              <motion.div 
                key={dept.department_id || (dept as any).department_id} // Fallback if your types use department_id
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: i * 0.05 }}
              >
                <DepartmentCard department={dept} type="master" onAction={onAdd} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}