"use client";

import { Patient } from "@/types/opd";
import { User, Activity, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePatientSummary } from "@/hooks/patients/usePatietns";

export default function PatientQuickInfoPanel({
  patient,
}: {
  patient: Patient | null;
}) {
  const { data, isLoading } = usePatientSummary(
    patient ? Number(patient.id) : undefined,
  );
  const summary = data;

  if (!patient) {
    return (
      <div className="p-6 border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground h-full bg-muted/10">
        <User className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">Select a patient to view quick info.</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="p-6 border border-border rounded-xl text-center text-muted-foreground">
        Loading patient info...
      </div>
    );
  }

  return (
    <div className="p-5 border border-border rounded-xl bg-card shadow-sm space-y-4 h-full">
      <div className="flex items-center gap-3 border-b border-border pb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
          {summary.name?.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-foreground">{summary.name}</h3>
          <p className="text-xs text-muted-foreground font-mono">
            {summary.patient_no} • {summary.age} Y, {summary.gender}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="p-2 bg-muted/30 rounded border border-border">
          <p className="text-[10px] text-muted-foreground uppercase font-semibold">
            Blood Group
          </p>
          <p className="font-bold text-destructive mt-0.5">
            {summary.blood_group}
          </p>
        </div>
        <div className="p-2 bg-muted/30 rounded border border-border">
          <p className="text-[10px] text-muted-foreground uppercase font-semibold">
            Last Visit
          </p>
          <p className="font-medium text-foreground mt-0.5">
            {summary.last_visit || "Never"}
          </p>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase font-semibold mb-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-warning" /> Allergies
          </p>
          <p className="text-sm font-medium text-foreground">
            {summary.allergies || "None"}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase font-semibold mb-1 flex items-center gap-1">
            <Activity className="w-3 h-3 text-blue-500" /> Chronic Conditions
          </p>
          <p className="text-sm font-medium text-foreground">
            {summary.chronic_conditions || "None"}
          </p>
        </div>
      </div>
    </div>
  );
}
