"use client";

import { Card } from "@/components/ui/card";

interface Props {
  subtotal: number;
  taxPct: number;
  discountAmt: number;
  total: number;
  isReadOnly: boolean;
  onUpdateTax: (val: number) => void;
  onUpdateDiscount: (val: number) => void;
}

export default function BillSummaryCard({ subtotal, taxPct, discountAmt, total, isReadOnly, onUpdateTax, onUpdateDiscount }: Props) {
  const taxAmount = (subtotal * taxPct) / 100;

  return (
    <Card className="p-5 border-border shadow-sm h-full flex flex-col justify-between">
      <h3 className="font-bold text-foreground mb-4 border-b border-border pb-2">Bill Summary</h3>
      
      <div className="space-y-4 flex-1">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground font-medium">Subtotal</span>
          <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground font-medium">Tax (%)</span>
          <input 
            type="number" min="0" disabled={isReadOnly} value={taxPct}
            onChange={(e) => onUpdateTax(parseFloat(e.target.value) || 0)}
            className="w-20 px-2 py-1 text-right border border-input rounded bg-background focus:ring-1 focus:ring-primary disabled:opacity-50 outline-none"
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground font-medium">Discount ($)</span>
          <input 
            type="number" min="0" disabled={isReadOnly} value={discountAmt}
            onChange={(e) => onUpdateDiscount(parseFloat(e.target.value) || 0)}
            className="w-24 px-2 py-1 text-right border border-input rounded bg-background focus:ring-1 focus:ring-primary disabled:opacity-50 outline-none text-success"
          />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border border-dashed flex justify-between items-center">
        <span className="text-lg font-bold text-foreground uppercase tracking-wider">Total Amount</span>
        <span className="text-2xl font-black text-primary">${total.toFixed(2)}</span>
      </div>
    </Card>
  );
}