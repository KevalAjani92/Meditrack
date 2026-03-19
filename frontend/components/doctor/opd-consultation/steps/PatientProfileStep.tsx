"use client";

import { PatientEMR } from "@/types/consultation";
import { Card } from "@/components/ui/card";
import PastVisitsTimeline from "../PastVisitsTimeline";

export default function PatientProfileStep({ patient }: { patient: PatientEMR }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-5 border-border shadow-sm">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 border-b border-border pb-2">Personal & Contact Info</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div><p className="text-muted-foreground text-xs">DOB</p><p className="font-medium">{patient.dob}</p></div>
            <div><p className="text-muted-foreground text-xs">Visit Type</p><p className="font-medium">{patient.type}</p></div>
            <div><p className="text-muted-foreground text-xs">Phone</p><p className="font-mono">{patient.phone}</p></div>
            <div><p className="text-muted-foreground text-xs">Email</p><p className="font-medium">{patient.email || "N/A"}</p></div>
            <div className="col-span-2"><p className="text-muted-foreground text-xs">Address</p><p className="font-medium">{patient.address}, {patient.city}</p></div>
          </div>
        </Card>

        <Card className="p-5 border-border shadow-sm">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 border-b border-border pb-2">Medical History</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-destructive/5 rounded border border-destructive/20">
              <p className="text-destructive font-bold text-xs uppercase mb-1">Allergies</p>
              <p className="font-medium text-foreground">{patient.allergies}</p>
            </div>
            <div className="p-3 bg-muted/30 rounded border border-border">
              <p className="text-muted-foreground font-bold text-xs uppercase mb-1">Chronic Conditions</p>
              <p className="font-medium text-foreground">{patient.chronicConditions}</p>
            </div>
            <div className="col-span-2 p-3 bg-primary/5 rounded border border-primary/20">
              <p className="text-primary font-bold text-xs uppercase mb-1">Current Medications</p>
              <p className="font-medium text-foreground">{patient.currentMedications}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <PastVisitsTimeline />
      </div>
    </div>
  );
}