"use client";

import { ConsultationData } from "@/types/consultation";
import { Card } from "@/components/ui/card";
import PrescriptionTable from "../tables/PrescriptionTable";

interface Props {
  data: ConsultationData;
  updateData: (updates: Partial<ConsultationData>) => void;
  onEditMedicine: (med: any) => void;
  onOpenMedicine: () => void;
}

export default function PrescriptionStep({ data, updateData, onEditMedicine, onOpenMedicine }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <Card className="p-5 border-border shadow-sm">
        <label className="text-sm font-bold text-foreground uppercase tracking-wider">General Advice & Instructions</label>
        <textarea 
          value={data.adviceNotes} 
          onChange={e => updateData({ adviceNotes: e.target.value })}
          className="w-full mt-2 p-3 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary outline-none resize-none h-24"
          placeholder="e.g., Drink warm water, avoid spicy food..."
        />
      </Card>
      <PrescriptionTable prescriptions={data.prescriptions} onRemove={(id) => updateData({ prescriptions: data.prescriptions.filter(d=>d.id !== id)})} onEdit={onEditMedicine} onAdd={onOpenMedicine} />
    </div>
  );
}