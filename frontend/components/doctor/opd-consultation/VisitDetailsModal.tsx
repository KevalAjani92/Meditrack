"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Calendar, User, Activity, Pill, Syringe, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PastVisit } from "@/types/consultation";

// Extended interface to reflect the new fields (Assumes these exist in your mock data)
interface ExtendedPastVisit extends PastVisit {
  procedures?: string[];
  tests?: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  visit: ExtendedPastVisit | null;
}

export default function VisitDetailsModal({ isOpen, onClose, visit }: Props) {
  if (!visit) return null;

  const procedures = visit.procedures || [];
  const tests = visit.tests || [];

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-0 shadow-xl border border-border animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[85vh]">
          
          {/* Header */}
          <div className="p-6 border-b border-border bg-muted/10 flex justify-between items-start shrink-0">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Past Visit Details</p>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> {visit.date}
              </h2>
            </div>
            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground bg-transparent hover:bg-muted rounded-md transition-colors">
              <X className="w-5 h-5"/>
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="p-6 space-y-6 overflow-y-auto">
            
            <div className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border shadow-sm">
              <div className="p-2 bg-muted/30 rounded-full">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Consulting Doctor</p>
                <p className="font-bold text-foreground">{visit.doctor} <span className="font-normal text-muted-foreground">({visit.department})</span></p>
              </div>
            </div>

            {/* 2-Column Grid for Clinical Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Column 1 */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-1">
                    <Activity className="w-4 h-4 text-primary" /> Diagnoses
                  </h4>
                  {visit.diagnoses.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm text-foreground space-y-1">
                      {visit.diagnoses.map((diag, i) => <li key={i}>{diag}</li>)}
                    </ul>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">No diagnoses recorded.</span>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-1">
                    <Syringe className="w-4 h-4 text-primary" /> Treatment & Procedures
                  </h4>
                  {procedures.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm text-foreground space-y-1">
                      {procedures.map((proc, i) => <li key={i}>{proc}</li>)}
                    </ul>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">No procedures recorded.</span>
                  )}
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-1">
                    <Pill className="w-4 h-4 text-primary" /> Prescribed Medications
                  </h4>
                  {visit.prescriptions.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm text-foreground space-y-1">
                      {visit.prescriptions.map((med, i) => <li key={i}>{med}</li>)}
                    </ul>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">No medicines prescribed.</span>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-1">
                    <FlaskConical className="w-4 h-4 text-primary" /> Lab & Imaging Tests
                  </h4>
                  {tests.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm text-foreground space-y-1">
                      {tests.map((test, i) => <li key={i}>{test}</li>)}
                    </ul>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">No tests ordered.</span>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/20 flex justify-end shrink-0">
             <Button variant="ghost" onClick={onClose}>Close</Button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}