"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Edit, Calendar, Pill, Factory, Activity, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Medicine } from "@/types/medicine";

interface MedicineDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine?: Medicine;
  onEdit: (medicine: Medicine) => void;
}

export default function MedicineDetailModal({ isOpen, onClose, medicine, onEdit }: MedicineDetailModalProps) {
  if (!medicine) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-0 shadow-lg border border-border animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          
          {/* Header */}
          <div className="p-6 border-b border-border bg-muted/10 flex items-start justify-between">
            <div className="space-y-1">
               <div className="flex items-center gap-2 mb-2">
                 <span className="font-mono text-sm font-bold px-2 py-0.5 bg-primary/10 text-primary rounded border border-primary/20">
                    {medicine.medicine_code}
                 </span>
                 <Badge variant="outline" className="text-muted-foreground">{medicine.medicine_type}</Badge>
               </div>
               <h2 className="text-xl font-bold text-foreground leading-tight">
                 {medicine.medicine_name}
               </h2>
            </div>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-6 space-y-6">
            {/* Main Info Grid */}
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1">
                 <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                   <Zap className="w-3 h-3" /> Strength
                 </span>
                 <p className="text-lg font-semibold text-foreground">{medicine.strength}</p>
               </div>
               
               <div className="space-y-1">
                 <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                   <Activity className="w-3 h-3" /> Status
                 </span>
                 <div className="flex items-center gap-2 text-sm text-foreground">
                    <div className={`w-2 h-2 rounded-full ${medicine.is_active ? 'bg-success' : 'bg-muted-foreground'}`} />
                    {medicine.is_active ? "Active" : "Inactive"}
                 </div>
               </div>
            </div>

            <div className="p-4 bg-muted/20 rounded-lg border border-border">
               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1">
                   <Factory className="w-3 h-3" /> Manufacturer
               </span>
               <p className="text-base font-medium text-foreground">{medicine.manufacturer}</p>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground border-t border-border">
               <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Last Updated: {new Date(medicine.modified_at).toLocaleString()}
               </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 border-t border-border flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>Close</Button>
            <Button onClick={() => onEdit(medicine)} className="gap-2">
              <Edit className="w-4 h-4" /> Edit Details
            </Button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}