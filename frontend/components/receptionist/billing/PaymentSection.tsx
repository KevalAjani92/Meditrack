"use client";

import { PaymentEntry } from "@/types/billing";
import { Card } from "@/components/ui/card";
import { CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  total: number;
  paidAmount: number;
  remainingAmount: number;
  payments: PaymentEntry[];
  isFinalized: boolean;
  onOpenPaymentModal: () => void;
}

export default function PaymentSection({ total, paidAmount, remainingAmount, payments, isFinalized, onOpenPaymentModal }: Props) {
  return (
    <Card className="p-5 border-border shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center border-b border-border pb-3 mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" /> Payments
        </h3>
        {isFinalized && remainingAmount > 0 && (
          <Button size="sm" onClick={onOpenPaymentModal} className="gap-1 h-8">
            <Plus className="w-3.5 h-3.5" /> Add Payment
          </Button>
        )}
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="p-3 bg-muted/30 rounded border border-border text-center">
          <p className="text-[10px] uppercase font-bold text-muted-foreground">Total Bill</p>
          <p className="font-bold text-foreground mt-0.5">${total.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-success/10 rounded border border-success/20 text-center">
          <p className="text-[10px] uppercase font-bold text-success">Paid</p>
          <p className="font-bold text-success mt-0.5">${paidAmount.toFixed(2)}</p>
        </div>
        <div className={`p-3 rounded border text-center ${remainingAmount > 0 ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-muted border-border text-muted-foreground'}`}>
          <p className="text-[10px] uppercase font-bold">Due Balance</p>
          <p className="font-bold mt-0.5">${remainingAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* History Table */}
      <div className="flex-1 overflow-y-auto">
        {payments.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground opacity-70 border-2 border-dashed border-border rounded-lg py-4">
            No payments recorded yet.
          </div>
        ) : (
          <table className="w-full text-xs text-left">
            <thead className="text-muted-foreground uppercase tracking-wider font-semibold border-b border-border">
              <tr>
                <th className="pb-2">Date</th>
                <th className="pb-2">Mode</th>
                <th className="pb-2">Ref No</th>
                <th className="pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map(p => (
                <tr key={p.id}>
                  <td className="py-2 text-muted-foreground">{p.date}</td>
                  <td className="py-2 font-medium">{p.mode}</td>
                  <td className="py-2 font-mono text-[10px] text-muted-foreground">{p.referenceNumber}</td>
                  <td className="py-2 text-right font-bold text-success">${p.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}