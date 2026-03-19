"use client";

import { Diagnosis, HospitalDiagnosis } from "@/types/diagnosis";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Activity } from "lucide-react";
import DiagnosisTooltip from "./DiagnosisTooltip";

interface Props {
  diagnosis: Diagnosis | HospitalDiagnosis;
  type: "master" | "enabled";
  onAction: (diag: any) => void;
}

export default function DiagnosisCard({ diagnosis, type, onAction }: Props) {
  const isEnabled = type === "enabled";
  const hospitalDiag = diagnosis as HospitalDiagnosis;
  const isActive = isEnabled ? hospitalDiag.isActive : false;

  return (
    <DiagnosisTooltip description={diagnosis.description} department={diagnosis.department_name} date={diagnosis.created_at}>
      <Card className={`p-4 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default border-2
        ${!isEnabled ? 'bg-muted/10 border-dashed border-border opacity-90' : ''}
        ${isEnabled && !isActive ? 'bg-muted/30 border-border opacity-75 grayscale-[20%]' : ''}
        ${isEnabled && isActive ? 'bg-card border-border border-solid' : ''}
      `}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 pr-2">
            <h3 className="font-bold text-foreground text-base leading-tight line-clamp-2">{diagnosis.diagnosis_name}</h3>
            <p className="text-xs font-mono text-primary font-semibold mt-1 bg-primary/10 inline-block px-1.5 rounded">{diagnosis.diagnosis_code}</p>
          </div>
          {isEnabled && (
            <Badge variant="outline" className={`shrink-0 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${isActive ? 'bg-success/10 text-success border-success/20' : 'bg-muted text-muted-foreground border-border'}`}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          )}
        </div>

        <div className="mb-4 flex-1">
          <Badge variant="secondary" className="text-[10px] font-medium flex items-center gap-1 w-max text-muted-foreground mt-2">
             <Activity className="w-3 h-3" /> {diagnosis.department_name}
          </Badge>
        </div>

        <div className="mt-auto pt-3 border-t border-border/50">
          {!isEnabled ? (
            <Button variant="outline" size="sm" className="w-full gap-2 hover:bg-primary/10 hover:text-primary border-border transition-colors" onClick={() => onAction(diagnosis)}>
              <Plus className="w-3.5 h-3.5" /> Enable Diagnosis
            </Button>
          ) : (
            <Button variant="secondary" size="sm" className="w-full gap-2 bg-muted hover:bg-muted/80 text-foreground transition-colors" onClick={() => onAction(diagnosis)}>
              <Edit2 className="w-3.5 h-3.5" /> Manage Settings
            </Button>
          )}
        </div>
      </Card>
    </DiagnosisTooltip>
  );
}