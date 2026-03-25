"use client";

import { Card } from "@/components/ui/card";
import { Calculator } from "lucide-react";

interface Props {
  subtotal: number;
  taxPercent: number;
  discount: number;
  isReadOnly: boolean;
  onTaxChange: (val: number) => void;
  onDiscountChange: (val: number) => void;
}

export default function BillSummaryCard({ subtotal, taxPercent, discount, isReadOnly, onTaxChange, onDiscountChange }: Props) {
  const taxAmount = (subtotal * taxPercent) / 100;
  const total = subtotal + taxAmount - discount;

  return (
    <Card className="p-5 border-border shadow-sm mb-6">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <Calculator className="w-4 h-4 text-primary" /> Bill Summary
      </h3>
      <div className="space-y-3 max-w-xs ml-auto">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm items-center gap-2">
          <span className="text-muted-foreground">Tax (%)</span>
          <input 
            type="number" min="0" max="100" step="0.5" disabled={isReadOnly}
            value={taxPercent}
            onChange={(e) => onTaxChange(parseFloat(e.target.value) || 0)}
            className="w-20 px-2 py-1 text-right border border-input rounded bg-background text-sm focus:ring-1 focus:ring-primary disabled:opacity-50 outline-none"
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Tax Amount</span>
          <span>₹{taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm items-center gap-2">
          <span className="text-muted-foreground">Discount (₹)</span>
          <input 
            type="number" min="0" step="0.5" disabled={isReadOnly}
            value={discount}
            onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
            className="w-24 px-2 py-1 text-right border border-input rounded bg-background text-sm focus:ring-1 focus:ring-primary disabled:opacity-50 outline-none"
          />
        </div>
        <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
          <span className="text-foreground">Grand Total</span>
          <span className="text-primary">₹{total.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
}