"use client";

import { TreatmentDetail } from "@/types/procedure";
import { Card } from "@/components/ui/card";
import { Activity, LayoutList } from "lucide-react";

interface Props {
  treatmentType?: TreatmentDetail;
}

export default function TreatmentTypeHeader({ treatmentType }: Props) {
  return (
    <Card className="p-5 border-border shadow-sm mb-6 bg-muted/10 border-l-4 border-l-primary flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <LayoutList className="w-3.5 h-3.5" /> Treatment Type Context
        </p>
        <h2 className="text-2xl font-bold text-foreground">{treatmentType?.treatment_name}</h2>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-xs font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">{treatmentType?.treatment_code}</span>
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> {treatmentType?.department_name}
          </span>
        </div>
      </div>
      <div className="max-w-md md:text-right">
        <p className="text-sm text-muted-foreground">{treatmentType?.description}</p>
      </div>
    </Card>
  );
}