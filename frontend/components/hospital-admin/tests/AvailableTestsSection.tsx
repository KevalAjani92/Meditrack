"use client";

import { motion } from "framer-motion";
import { MedicalTest } from "@/types/medical-test";
import TestSearch from "./TestSearch";
import TestCard from "./TestCard";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  tests: MedicalTest[];
  search: string;
  onSearchChange: (val: string) => void;
  departmentFilter: string;
  onDepartmentChange: (val: string) => void;
  departmentsList: string[];
  // page: number;
  // totalPages: number;
  // onPageChange: (page: number) => void;
  onAdd: (t: MedicalTest) => void;
}

export default function AvailableTestsSection({ 
  tests, search, onSearchChange, departmentFilter, onDepartmentChange, departmentsList, onAdd 
}: Props) {
  return (
    <div className="flex flex-col h-[650px] bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-5 border-b border-border bg-muted/10 space-y-4 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-foreground">Available Master Catalog</h2>
          <p className="text-sm text-muted-foreground">Select diagnostic tests from the global registry to enable them.</p>
        </div>
        <TestSearch 
          searchValue={search} onSearchChange={onSearchChange} 
          departmentValue={departmentFilter} onDepartmentChange={onDepartmentChange}
          departments={departmentsList} placeholder="Search by name, code or type..." 
        />
      </div>

      {/* Scrollable Grid Area */}
      <div className="p-5 flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-background/50">
        {tests.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center p-6 text-muted-foreground border-2 border-dashed border-border rounded-xl">
            <p>No available master tests match your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tests.map((test, i) => (
              <motion.div key={test.test_id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <TestCard test={test} type="master" onAction={onAdd} />
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