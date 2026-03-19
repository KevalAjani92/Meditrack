"use client";

import { Doctor } from "@/types/opd";
import { Users, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDoctorQueueStatus } from "@/hooks/doctors/useDoctors";

export default function DoctorQueueIndicator({
  doctor,
}: {
  doctor: Doctor | null;
}) {
  const { data, isLoading } = useDoctorQueueStatus(
    doctor ? Number(doctor.id) : undefined,
  );

  const queue = data;
  if (!doctor) return null;

  if (isLoading) {
    return (
      <div className="p-5 border border-border rounded-xl bg-card shadow-sm mt-4 text-center text-muted-foreground">
        Loading queue...
      </div>
    );
  }

  return (
    <div className="p-5 border border-border rounded-xl bg-card shadow-sm mt-4 animate-in fade-in">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-primary" />
          <h4 className="font-bold text-foreground text-sm">{doctor.name}</h4>
        </div>
        <Badge
          variant={queue?.status === "Active" ? "default" : "secondary"}
          className="text-[10px] h-5"
        >
          {queue?.status}
        </Badge>
      </div>

      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border mt-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Current Queue
        </span>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span
            className={`text-lg font-bold ${queue?.queueCount > 10 ? "text-destructive" : "text-foreground"}`}
          >
            {queue?.queueCount ?? 0}
          </span>
          <span className="text-xs text-muted-foreground">Waiting</span>
        </div>
      </div>
    </div>
  );
}
