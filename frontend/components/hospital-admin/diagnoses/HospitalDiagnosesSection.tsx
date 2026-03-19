"use client";

import { motion } from "framer-motion";
import { HospitalDiagnosis } from "@/types/diagnosis";
import DiagnosisSearch from "./DiagnosisSearch";
import DiagnosisCard from "./DiagnosisCard";
import { ActivitySquare } from "lucide-react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";

interface Props {
  diagnoses: HospitalDiagnosis[];
  search: string;
  onSearchChange: (val: string) => void;
  departmentFilter: string;
  onDepartmentChange: (val: string) => void;
  departmentsList: string[];
  // page: number;
  // totalPages: number;
  // onPageChange: (page: number) => void;
  onEdit: (diag: HospitalDiagnosis) => void;
}

export default function HospitalDiagnosesSection({ 
  diagnoses, search, onSearchChange, departmentFilter, onDepartmentChange, departmentsList, onEdit 
}: Props) {
  return (
    <div className="flex flex-col h-[650px] bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-5 border-b border-border bg-primary/5 space-y-4 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ActivitySquare className="w-5 h-5 text-primary" /> Hospital Enabled Diagnoses
          </h2>
          <p className="text-sm text-muted-foreground">Manage status for diagnoses active in your facility.</p>
        </div>
        <DiagnosisSearch 
          searchValue={search} onSearchChange={onSearchChange} 
          departmentValue={departmentFilter} onDepartmentChange={onDepartmentChange}
          departments={departmentsList} placeholder="Search enabled diagnoses..." 
        />
      </div>

      {/* Scrollable Grid Area */}
      <div className="p-5 flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-background/50">
        {diagnoses.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/10">
            <ActivitySquare className="w-10 h-10 mb-3 opacity-20" />
            <p className="font-medium text-foreground">No diagnoses found.</p>
            <p className="text-sm mt-1">Start by adding diagnoses from the master list.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {diagnoses.map((diag, i) => (
              <motion.div key={diag.diagnosis_id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <DiagnosisCard diagnosis={diag} type="enabled" onAction={onEdit} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Footer Commented Out */}
      {/* {totalPages > 0 && (
        <div className="p-3 border-t border-border bg-card shrink-0 flex items-center justify-between text-sm text-muted-foreground">
          <span>Page {page} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1} className="h-8 w-8 p-0"><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="h-8 w-8 p-0"><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      )} */}
    </div>
  );
}