"use client";

import { Procedure, HospitalProcedure, TreatmentDetail } from "@/types/procedure";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings2, Scissors, Stethoscope } from "lucide-react";
import ProcedureTooltip from "./ProcedureTooltip";

interface Props {
  procedure: Procedure | HospitalProcedure;
  treatment: TreatmentDetail;
  type: "master" | "enabled";
  onAction: (p: any) => void;
}

export default function ProcedureCard({ procedure,treatment, type, onAction }: Props) {
  const isEnabled = type === "enabled";
  const hospitalProc = procedure as HospitalProcedure;
  const isActive = isEnabled ? hospitalProc.isActive : false;

  return (
    <ProcedureTooltip 
      description={procedure.description} 
      treatmentType={treatment.treatment_name}
      department={treatment.department_name}
      date={procedure.created_at}
    >
      <Card className={`p-4 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default border-2
        ${!isEnabled ? 'bg-muted/10 border-dashed border-border opacity-90' : ''}
        ${isEnabled && !isActive ? 'bg-muted/30 border-border opacity-75 grayscale-[20%]' : ''}
        ${isEnabled && isActive ? 'bg-card border-border border-solid' : ''}
      `}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 pr-2">
            <h3 className="font-bold text-foreground text-base leading-tight line-clamp-2">{procedure.procedure_name}</h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <p className="text-[11px] font-mono text-primary font-semibold bg-primary/10 px-1.5 py-0.5 rounded">{procedure.procedure_code}</p>
              <Badge variant={procedure.is_surgical ? "destructive" : "secondary"} className="text-[9px] uppercase tracking-wider flex items-center gap-1">
                 {procedure.is_surgical ? <Scissors className="w-2.5 h-2.5" /> : <Stethoscope className="w-2.5 h-2.5" />}
                 {procedure.is_surgical ? "Surgical" : "Non-Surgical"}
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            {isEnabled && (
              <Badge variant="outline" className={`shrink-0 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${isActive ? 'bg-success/10 text-success border-success/20' : 'bg-muted text-muted-foreground border-border'}`}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
            )}
          </div>
        </div>

        <div className="mb-2 flex-1 mt-2 text-sm text-muted-foreground line-clamp-2">
          {procedure.description}
        </div>

        <div className="mt-auto pt-3 border-t border-border/50 flex flex-col gap-3">
          {isEnabled && (
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground uppercase font-semibold">Procedure Price</div>
              <div className="font-black text-lg text-foreground tracking-tight">₹ {hospitalProc.price}</div>
            </div>
          )}
          
          {!isEnabled ? (
            <Button variant="outline" size="sm" className="w-full gap-2 hover:bg-primary/10 hover:text-primary border-border transition-colors" onClick={() => onAction(procedure)}>
              <Plus className="w-3.5 h-3.5" /> Enable Procedure
            </Button>
          ) : (
            <Button variant="secondary" size="sm" className="w-full gap-2 bg-muted hover:bg-muted/80 text-foreground transition-colors" onClick={() => onAction(procedure)}>
              <Settings2 className="w-3.5 h-3.5" /> Manage Settings
            </Button>
          )}
        </div>
      </Card>
    </ProcedureTooltip>
  );
}