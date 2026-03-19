"use client";

import { MedicineItem } from "@/types/billing";
import { Card } from "@/components/ui/card";
import { Pill, Trash2 } from "lucide-react";

interface Props {
  items: MedicineItem[];
  isReadOnly: boolean;
  onUpdateItem: (id: string, field: "quantity" | "unitPrice", value: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function MedicineBillingSection({ items, isReadOnly, onUpdateItem, onRemoveItem }: Props) {
  if (items.length === 0) return null;

  return (
    <Card className="border-border shadow-sm mb-6 flex flex-col">
      <div className="p-4 border-b border-border bg-muted/10 flex justify-between items-center">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Pill className="w-4 h-4 text-primary" /> Pharmacy & Prescription Medicines
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-4 py-3">Medicine</th>
              <th className="px-4 py-3">Type & Strength</th>
              <th className="px-4 py-3">Dosage Info</th>
              <th className="px-4 py-3 w-24 text-right">Qty</th>
              <th className="px-4 py-3 w-32 text-right">Unit Price</th>
              <th className="px-4 py-3 w-32 text-right">Total</th>
              <th className="px-4 py-3 w-16 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-muted/5 transition-colors group">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{item.code}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.type} <span className="mx-1">•</span> {item.strength}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.dosage} <span className="mx-1">•</span> {item.durationDays} Days
                </td>
                <td className="px-4 py-3 text-right">
                  <input 
                    type="number" min="1" disabled={isReadOnly}
                    value={item.quantity}
                    onChange={(e) => onUpdateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-right border border-input rounded bg-background focus:ring-1 focus:ring-primary disabled:opacity-50 outline-none"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="relative inline-block w-24">
                    <span className="absolute left-2 top-1.5 text-muted-foreground">$</span>
                    <input 
                      type="number" min="0" step="0.01" disabled={isReadOnly}
                      value={item.unitPrice}
                      onChange={(e) => onUpdateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                      className="w-full pl-6 pr-2 py-1 text-right border border-input rounded bg-background focus:ring-1 focus:ring-primary disabled:opacity-50 outline-none"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-medium text-foreground">
                  ${(item.quantity * item.unitPrice).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  {!isReadOnly && (
                    <button onClick={() => onRemoveItem(item.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}