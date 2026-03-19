"use client";

import { motion } from "framer-motion";
import { HospitalMedicine } from "@/types/medicine";
import MedicineSearch from "./MedicineSearch";
import MedicineCard from "./MedicineCard";
import { Pill } from "lucide-react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";

interface Props {
  medicines: HospitalMedicine[];
  search: string;
  onSearchChange: (val: string) => void;
  typeFilter: string;
  onTypeChange: (val: string) => void;
  typesList: string[];
  // page: number;
  // totalPages: number;
  // onPageChange: (page: number) => void;
  onEdit: (m: HospitalMedicine) => void;
}

export default function HospitalMedicinesSection({ 
  medicines, search, onSearchChange, typeFilter, onTypeChange, typesList, onEdit 
}: Props) {
  return (
    <div className="flex flex-col h-[650px] bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-5 border-b border-border bg-primary/5 space-y-4 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Pill className="w-5 h-5 text-primary" /> Hospital Enabled Pharmacy
          </h2>
          <p className="text-sm text-muted-foreground">Manage active status, pricing, and stock inventory.</p>
        </div>
        <MedicineSearch 
          searchValue={search} onSearchChange={onSearchChange} 
          typeValue={typeFilter} onTypeChange={onTypeChange}
          types={typesList} placeholder="Search enabled medicines..." 
        />
      </div>

      {/* Scrollable Grid Area */}
      <div className="p-5 flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-background/50">
        {medicines.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/10">
            <Pill className="w-10 h-10 mb-3 opacity-20" />
            <p className="font-medium text-foreground">No medicines enabled yet.</p>
            <p className="text-sm mt-1">Start by adding medicines from the master list.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {medicines.map((med, i) => (
              <motion.div key={med.medicine_id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <MedicineCard medicine={med} type="enabled" onAction={onEdit} />
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