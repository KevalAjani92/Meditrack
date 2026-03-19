"use client";

import { Volume2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OpdToken } from "@/types/opd-queue";

interface Props {
  nextPatient: OpdToken | null;
  onCallNext: (id: string) => void;
}

export default function NextPatientControls({ nextPatient, onCallNext }: Props) {
  if (!nextPatient) {
    return (
      <div className="p-6 border-2 border-dashed border-border rounded-2xl bg-muted/10 text-center flex flex-col items-center justify-center">
        <p className="text-muted-foreground font-medium">No patients currently waiting in the queue.</p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl border border-border bg-card shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border ${nextPatient.isEmergency ? 'bg-destructive/10 text-destructive border-destructive/30' : 'bg-muted text-muted-foreground border-border'}`}>
          {nextPatient.tokenNo}
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Up Next in Queue</p>
          <p className="font-bold text-foreground text-lg flex items-center gap-2">
            {nextPatient.patientName} 
            {nextPatient.isEmergency && <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />}
          </p>
          <p className="text-xs text-muted-foreground">{nextPatient.age}Y • {nextPatient.chiefComplaint}</p>
        </div>
      </div>
      <Button size="lg" onClick={() => onCallNext(nextPatient.id)} className="w-full sm:w-auto gap-2 shadow-md">
        <Volume2 className="w-5 h-5" /> Call Next Patient
      </Button>
    </div>
  );
}