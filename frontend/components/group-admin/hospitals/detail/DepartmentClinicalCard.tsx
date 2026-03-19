"use client";

import { Card } from "@/components/ui/card";
import { Activity, Pill, FlaskConical, ChevronRight } from "lucide-react";
import { DepartmentSummary } from "@/types/hospital-monitor";

export default function DepartmentClinicalCard({ data }: { data: DepartmentSummary }) {
  return (
    <Card className="p-5 border-border hover:shadow-md transition-all flex flex-col h-full group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-foreground text-lg">{data.name}</h3>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
            {data.code}
          </span>
        </div>
        <div className="p-2 rounded-full bg-secondary text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <Activity className="w-5 h-5" />
        </div>
      </div>

      {/* Counts */}
      <div className="grid grid-cols-3 gap-2 mb-6 border-b border-border pb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">{data.diagnosis_count}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Diagnosis</p>
        </div>
        <div className="text-center border-l border-border">
          <p className="text-lg font-bold text-foreground">{data.treatment_count}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Treatments</p>
        </div>
        <div className="text-center border-l border-border">
          <p className="text-lg font-bold text-foreground">{data.test_count}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Tests</p>
        </div>
      </div>

      {/* Mini Preview */}
      <div className="space-y-2 mb-4 flex-1">
        <p className="text-xs font-semibold text-muted-foreground mb-2">Configurations Preview</p>
        {data.preview_items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm p-2 rounded bg-muted/30 border border-transparent hover:border-border transition-colors">
            <span className="text-foreground truncate max-w-[140px]">{item.name}</span>
            <span className="font-mono text-xs text-muted-foreground">{item.code}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <button className="w-full mt-auto py-2 text-xs font-medium text-primary bg-primary/5 rounded hover:bg-primary/10 transition-colors flex items-center justify-center gap-1">
        View Full Configuration <ChevronRight className="w-3 h-3" />
      </button>
    </Card>
  );
}