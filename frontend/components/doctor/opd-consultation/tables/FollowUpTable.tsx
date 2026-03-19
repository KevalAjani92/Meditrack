"use client";

import { FollowUp } from "@/types/consultation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, CalendarClock } from "lucide-react";

interface Props { followUps: FollowUp[]; onRemove: (id: string) => void; onEdit: (f: FollowUp) => void; onAdd: () => void; }

export default function FollowUpTable({ followUps, onRemove, onEdit, onAdd }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-warning/10 text-warning-foreground border-warning/20";
      case "Completed": return "bg-success/10 text-success border-success/20";
      case "Missed": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Card className="overflow-hidden border-border shadow-sm mt-4">
      <div className="p-4 border-b border-border bg-muted/10 flex justify-between items-center">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-primary"/> Follow-Up Schedule
        </h3>
        <Button size="sm" onClick={onAdd} className="gap-1.5"><Plus className="w-3.5 h-3.5"/> Schedule Follow-Up</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {followUps.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No follow-ups scheduled.</td></tr>
            ) : followUps.map(f => (
              <tr key={f.id} className="hover:bg-muted/10 group">
                <td className="px-4 py-3 font-semibold text-foreground">{f.date}</td>
                <td className="px-4 py-3 text-muted-foreground">{f.reason}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={getStatusColor(f.status)}>{f.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(f)} className="p-1.5 text-muted-foreground hover:text-primary rounded"><Edit2 className="w-4 h-4"/></button>
                    <button onClick={() => onRemove(f.id)} className="p-1.5 text-muted-foreground hover:text-destructive rounded"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}