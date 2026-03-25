"use client";

import { OpdVisit } from "@/types/billing";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, User, Calendar, Stethoscope } from "lucide-react";

export default function PatientVisitSummaryCard({ visit }: { visit: OpdVisit }) {
  const indicators = [
    { label: "Diagnosis Added", active: visit.indicators.diagnosisAdded },
    { label: "Tests Ordered", active: visit.indicators.testsOrdered },
    { label: "Procedures Done", active: visit.indicators.proceduresDone },
    { label: "Prescription", active: visit.indicators.prescriptionGenerated },
  ];

  return (
    <Card className="p-5 border-border shadow-sm mb-6 flex flex-col md:flex-row gap-6 justify-between items-start animate-in fade-in">
      
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Patient Info</p>
          <p className="font-bold text-foreground text-lg">{visit.patientName}</p>
          <p className="text-sm text-muted-foreground">{visit.patientId} • {visit.age}Y, {visit.gender}</p>
          <p className="text-sm font-mono text-muted-foreground">{visit.phone}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Visit Info</p>
          <p className="font-bold text-foreground">{visit.opdNo}</p>
          <p className="text-sm text-muted-foreground">{visit.visitDate}</p>
          <p className="text-sm text-muted-foreground line-clamp-1" title={visit.chiefComplaint}>CC: {visit.chiefComplaint}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5" /> Doctor Info</p>
          <p className="font-bold text-foreground">{visit.doctorName}</p>
          <p className="text-sm text-muted-foreground">{visit.department}</p>
        </div>
      </div>

      <div className="md:border-l border-border md:pl-6 grid grid-cols-2 gap-3 min-w-[240px]">
        {indicators.map((ind, i) => (
          <div key={i} className={`flex items-center gap-2 text-xs font-medium p-2 rounded-lg border ${ind.active ? 'bg-success/5 border-success/20 text-success' : 'bg-muted/30 border-transparent text-muted-foreground'}`}>
            {ind.active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5 opacity-50" />}
            {ind.label}
          </div>
        ))}
      </div>

    </Card>
  );
}