"use client";

import { Card } from "@/components/ui/card";
import { AlertTriangle, TrendingUp } from "lucide-react";
import { DaySummary } from "@/types/doctor-schedule";

export default function SlotCapacityIndicator({ summary }: { summary: DaySummary | undefined }) {
  if (!summary) return null;

  const { totalSlots, bookedSlots, availableSlots } = summary;
  const isOverbooked = bookedSlots > totalSlots;
  const fillPercentage = totalSlots > 0 ? Math.min(100, (bookedSlots / totalSlots) * 100) : 0;

  return (
    <Card className="px-5 border-border shadow-sm h-full flex flex-col justify-center animate-in fade-in">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-foreground">Daily Capacity</h3>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="text-center p-2 bg-muted/30 rounded border border-border">
          <p className="text-[10px] uppercase font-bold text-muted-foreground">Total</p>
          <p className="font-bold text-foreground text-lg">{totalSlots}</p>
        </div>
        <div className="text-center p-2 bg-primary/10 rounded border border-primary/20">
          <p className="text-[10px] uppercase font-bold text-primary">Booked</p>
          <p className="font-bold text-primary text-lg">{bookedSlots}</p>
        </div>
        <div className={`text-center p-2 rounded border ${availableSlots <= 0 ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-success/10 border-success/20 text-success'}`}>
          <p className="text-[10px] uppercase font-bold">Available</p>
          <p className="font-bold text-lg">{Math.max(0, availableSlots)}</p>
        </div>
      </div>

      <div className="space-y-2 mb-2">
        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
          <span>0%</span>
          <span>{Math.round((bookedSlots / (totalSlots || 1)) * 100)}% Filled</span>
        </div>
        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden flex">
          <div className={`h-full transition-all duration-500 ${isOverbooked ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${fillPercentage}%` }} />
        </div>
      </div>

      {isOverbooked && (
        <div className="mt-4 p-2.5 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-xs font-bold text-destructive">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          ⚠ Overbooked by {bookedSlots - totalSlots} appointments.
        </div>
      )}
    </Card>
  );
}