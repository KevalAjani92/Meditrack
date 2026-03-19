"use client";

import { Card } from "@/components/ui/card";
import { PieChart, Clock, Users } from "lucide-react";
import { Appointment } from "@/types/doctor-schedule";

export default function ScheduleInsightsPanel({ data, date }: { data: Appointment[], date: string }) {
  const total = data.length;
  const completed = data.filter(a => a.status === "Completed").length;
  const remaining = total - completed - data.filter(a => a.status === "Cancelled" || a.status === "No-Show").length;

  return (
    <Card className="p-5 border-border shadow-sm h-full">
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 border-b border-border pb-2">
        <PieChart className="w-4 h-4 text-primary" /> Daily Insights
      </h3>
      
      <p className="text-xs text-muted-foreground mb-4">Data for {date}</p>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg border border-border">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Users className="w-4 h-4 text-muted-foreground" /> Total Scheduled
          </div>
          <span className="font-bold">{total}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center gap-2 text-sm font-medium text-success">
            <CheckCircle2 className="w-4 h-4" /> Completed
          </div>
          <span className="font-bold text-success">{completed}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg border border-warning/20">
          <div className="flex items-center gap-2 text-sm font-medium text-warning-foreground">
            <Clock className="w-4 h-4" /> Remaining
          </div>
          <span className="font-bold text-warning-foreground">{remaining}</span>
        </div>
      </div>
    </Card>
  );
}
import { CheckCircle2 } from "lucide-react";