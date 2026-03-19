"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Edit, Calendar, Clock, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Diagnosis } from "@/types/diagnosis";
import { Badge } from "@/components/ui/badge";

interface DiagnosisDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosis?: Diagnosis;
  onEdit: (diagnosis: Diagnosis) => void;
}

export default function DiagnosisDetailModal({ isOpen, onClose, diagnosis, onEdit }: DiagnosisDetailModalProps) {
  if (!diagnosis) return null;

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
                    {diagnosis.diagnosis_code}
                 </span>
                 <Badge variant="outline" className="text-muted-foreground">{diagnosis.department_name}</Badge>
               </div>
               <h2 className="text-xl font-bold text-foreground leading-tight">
                 {diagnosis.diagnosis_name}
               </h2>
            </div>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-6 space-y-6">
            {/* Status & ID Grid */}
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</span>
                 <div className="flex items-center gap-2 text-sm text-foreground">
                    <Activity className="w-4 h-4 text-success" />
                    {diagnosis.status}
                 </div>
               </div>
               {/* <div className="space-y-1">
                 <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Database ID</span>
                 <p className="text-sm font-mono text-muted-foreground">{diagnosis.diagnosis_id}</p>
               </div> */}
            </div>

            {/* Description Section */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Clinical Description</span>
              <div className="p-4 bg-muted/20 rounded-lg border border-border text-sm text-foreground leading-relaxed max-h-[150px] overflow-y-auto">
                {diagnosis.description || "No description provided."}
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
               <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  Created: {new Date(diagnosis.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
               </div>
               <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  Updated: {new Date(diagnosis.updated_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
               </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-muted/30 border-t border-border flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>Close</Button>
            <Button onClick={() => onEdit(diagnosis)} className="gap-2">
              <Edit className="w-4 h-4" /> Edit Diagnosis
            </Button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}