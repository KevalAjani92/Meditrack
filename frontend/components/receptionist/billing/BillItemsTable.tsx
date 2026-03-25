"use client";

import { BillItem } from "@/types/billing";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  items: BillItem[];
  isReadOnly: boolean;
  onUpdateItem: (index: number, field: "quantity" | "unitPrice", value: number) => void;
  onRemoveItem: (index: number) => void;
  onOpenAddModal: () => void;
}

export default function BillItemsTable({ items, isReadOnly, onUpdateItem, onRemoveItem, onOpenAddModal }: Props) {
  return (
    <Card className="border-border shadow-sm mb-6 flex flex-col">
      <div className="p-4 border-b border-border bg-muted/10 flex justify-between items-center">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" /> Service & Procedure Charges
        </h3>
        {!isReadOnly && (
          <Button size="sm" onClick={onOpenAddModal} className="gap-1.5 h-8">
            <Plus className="w-3.5 h-3.5" /> Add Charge
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-4 py-3 w-1/4">Item Type</th>
              <th className="px-4 py-3 w-1/3">Description</th>
              <th className="px-4 py-3 w-24 text-right">Qty</th>
              <th className="px-4 py-3 w-32 text-right">Unit Price</th>
              <th className="px-4 py-3 w-32 text-right">Total</th>
              <th className="px-4 py-3 w-16 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No service items added yet.
                </td>
              </tr>
            ) : items.map((item, index) => (
              <tr key={index} className="hover:bg-muted/5 transition-colors group">
                <td className="px-4 py-3 font-medium text-foreground">{item.itemType}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.itemDescription}</td>
                <td className="px-4 py-3 text-right">
                  <input 
                    type="number" min="1" disabled={isReadOnly}
                    value={item.quantity}
                    onChange={(e) => onUpdateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-right border border-input rounded bg-background focus:ring-1 focus:ring-primary disabled:opacity-50 outline-none"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="relative inline-block w-24">
                    <span className="absolute left-2 top-1.5 text-muted-foreground">₹</span>
                    <input 
                      type="number" min="0" step="0.01" disabled={isReadOnly}
                      value={item.unitPrice}
                      onChange={(e) => onUpdateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                      className="w-full pl-6 pr-2 py-1 text-right border border-input rounded bg-background focus:ring-1 focus:ring-primary disabled:opacity-50 outline-none"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-medium text-foreground">
                  ₹{(item.quantity * item.unitPrice).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  {!isReadOnly && (
                    <button onClick={() => onRemoveItem(index)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors opacity-0 group-hover:opacity-100">
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