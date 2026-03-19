"use client";

import { motion } from "framer-motion";
import { HospitalDepartment } from "@/types/department";
import DepartmentSearch from "./DepartmentSearch";
import DepartmentCard from "./DepartmentCard";
import { Building2 } from "lucide-react";

interface Props {
  departments: HospitalDepartment[];
  search: string;
  onSearchChange: (val: string) => void;
  onEdit: (dept: HospitalDepartment) => void;
}

export default function HospitalDepartmentsSection({ departments, search, onSearchChange, onEdit }: Props) {
  return (
    <div className="flex flex-col h-[650px] bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-border bg-primary/5 space-y-4 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" /> Hospital Enabled Departments
          </h2>
          <p className="text-sm text-muted-foreground">Manage status for departments active in your facility.</p>
        </div>
        <DepartmentSearch value={search} onChange={onSearchChange} placeholder="Search enabled departments..." />
      </div>

      <div className="p-5 flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-background/50">
        {departments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/10">
            <Building2 className="w-10 h-10 mb-3 opacity-20" />
            <p className="font-medium text-foreground">No departments enabled yet.</p>
            <p className="text-sm mt-1">Start by adding departments from the master list above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {departments.map((dept, i) => (
              <motion.div key={dept.department_id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <DepartmentCard department={dept} type="enabled" onAction={onEdit} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}