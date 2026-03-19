"use client";

import { ConsultationData } from "@/types/consultation";
import { Card } from "@/components/ui/card";
import DiagnosisTable from "../tables/DiagnosisTable";
import ProcedureTable from "../tables/ProcedureTable";

interface Props {
  data: ConsultationData;
  updateData: (updates: Partial<ConsultationData>) => void;
  onEditDiagnosis: (diag: any) => void;
  onEditProcedure: (proc: any) => void;
  onOpenDiagnosis: () => void;
  onOpenProcedure: () => void;
}

export default function ConsultationStep({ data, updateData, onEditDiagnosis, onEditProcedure, onOpenDiagnosis, onOpenProcedure }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <Card className="p-5 border-border shadow-sm space-y-4">
        <div>
          <label className="text-sm font-bold text-foreground uppercase tracking-wider">Chief Complaint <span className="text-destructive">*</span></label>
          <textarea 
            value={data.chiefComplaint} 
            onChange={e => updateData({ chiefComplaint: e.target.value })}
            className="w-full mt-2 p-3 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary outline-none resize-none h-20"
            placeholder="Describe the patient's primary symptoms..."
          />
        </div>
        <div>
          <label className="text-sm font-bold text-foreground uppercase tracking-wider">Clinical Notes / Findings</label>
          <textarea 
            value={data.clinicalNotes} 
            onChange={e => updateData({ clinicalNotes: e.target.value })}
            className="w-full mt-2 p-3 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary outline-none resize-none h-32"
            placeholder="Observation, vitals summary, and clinical thoughts..."
          />
        </div>
      </Card>

      <DiagnosisTable diagnoses={data.diagnoses} onRemove={(id) => updateData({ diagnoses: data.diagnoses.filter(d=>d.id !== id)})} onEdit={onEditDiagnosis} onAdd={onOpenDiagnosis} />
      <ProcedureTable procedures={data.procedures} onRemove={(id) => updateData({ procedures: data.procedures.filter(d=>d.id !== id)})} onEdit={onEditProcedure} onAdd={onOpenProcedure} />
    </div>
  );
}