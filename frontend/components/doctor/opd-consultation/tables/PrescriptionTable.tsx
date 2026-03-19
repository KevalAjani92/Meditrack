"use client";

import { Prescription } from "@/types/consultation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Pill } from "lucide-react";

interface Props { prescriptions: Prescription[]; onRemove: (id: string) => void; onEdit: (p: Prescription) => void; onAdd: () => void; }

export default function PrescriptionTable({ prescriptions, onRemove, onEdit, onAdd }: Props) {
  return (
    <Card className="overflow-hidden border-border shadow-sm mt-6">
      <div className="p-4 border-b border-border bg-muted/10 flex justify-between items-center">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><Pill className="w-4 h-4 text-primary"/> Prescribed Medicines</h3>
        <Button size="sm" onClick={onAdd} className="gap-1.5"><Plus className="w-3.5 h-3.5"/> Add Medicine</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border">
            <tr><th className="px-4 py-3">Medicine Name</th><th className="px-4 py-3">Dosage</th><th className="px-4 py-3">Duration & Qty</th><th className="px-4 py-3">Instructions</th><th className="px-4 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {prescriptions.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No medicines prescribed.</td></tr> : prescriptions.map(p => (
              <tr key={p.id} className="hover:bg-muted/10 group">
                <td className="px-4 py-3 font-semibold">{p.medicineName}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.dosage}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.durationDays} Days ({p.quantity} Total)</td>
                <td className="px-4 py-3">
                  <p className="text-xs text-foreground">{p.timing}</p>
                  <p className="text-xs text-muted-foreground">{p.instructions}</p>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(p)} className="p-1.5 text-muted-foreground hover:text-primary"><Edit2 className="w-4 h-4"/></button>
                    <button onClick={() => onRemove(p.id)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4"/></button>
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