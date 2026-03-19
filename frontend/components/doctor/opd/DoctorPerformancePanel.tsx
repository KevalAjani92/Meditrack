"use client";

import { Card } from "@/components/ui/card";
import { Timer, Users, AlertTriangle } from "lucide-react";

export default function DoctorPerformancePanel({ data }: { data: any }) {
  return (
    <Card className="p-5 border-border shadow-sm">
      <h3 className="font-bold text-foreground mb-4 border-b border-border pb-2">
        Session Performance
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg border border-border">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" /> Patients Seen
          </span>
          <span className="font-bold text-foreground">{data.patientsSeen}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg border border-primary/20">
          <span className="flex items-center gap-2 text-sm text-primary font-medium">
            <Timer className="w-4 h-4" /> Avg Consult Time
          </span>
          <span className="font-bold text-primary">{data.avgConsultTime} mins</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg border border-warning/20">
          <span className="flex items-center gap-2 text-sm text-warning-foreground font-medium">
            <AlertTriangle className="w-4 h-4" /> Longest Wait
          </span>
          <span className="font-bold text-warning-foreground">{data.longestWait} mins</span>
        </div>
      </div>
    </Card>
  );
}
