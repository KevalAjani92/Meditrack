"use client";

import { PatientEMR } from "@/types/consultation";
import { AlertTriangle, Clock, Droplet, Hash, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PatientHeader({ patient, isAutosaving }: { patient: PatientEMR, isAutosaving: boolean }) {
  const hasAllergies = patient.allergies && patient.allergies !== "None";

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl border border-primary/20">
          {patient.name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground">{patient.name}</h1>
            <span className="text-sm font-medium text-muted-foreground">{patient.age}Y, {patient.gender}</span>
            <Badge variant="outline" className="bg-secondary text-secondary-foreground">{patient.id}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs">
            <span className="flex items-center gap-1 text-destructive font-bold">
              <Droplet className="w-3.5 h-3.5" /> {patient.bloodGroup}
            </span>
            {hasAllergies && (
              <span className="flex items-center gap-1 bg-destructive text-destructive-foreground px-2 py-0.5 rounded font-bold animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" /> Allergies: {patient.allergies}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Live Status</p>
          <p className={`text-xs font-medium flex items-center gap-1.5 ${isAutosaving ? 'text-warning-foreground' : 'text-success'}`}>
             <span className={`w-2 h-2 rounded-full ${isAutosaving ? 'bg-warning animate-pulse' : 'bg-success'}`} />
             {isAutosaving ? "Saving draft..." : "Draft Saved"}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="p-2 bg-muted/30 rounded border border-border text-center min-w-[80px]">
            <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center justify-center gap-1"><Clock className="w-3 h-3"/> Time</p>
            <p className="font-bold text-foreground">{patient.visitTime}</p>
          </div>
          <div className="p-2 bg-primary/10 rounded border border-primary/20 text-center min-w-[80px]">
            <p className="text-[10px] uppercase font-bold text-primary flex items-center justify-center gap-1"><Hash className="w-3 h-3"/> Token</p>
            <p className="font-bold text-primary text-lg leading-none">{patient.tokenNo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}