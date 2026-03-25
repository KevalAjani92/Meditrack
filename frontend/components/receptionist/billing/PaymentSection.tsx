"use client";

import { PaymentEntry } from "@/types/billing";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStatusStyles } from "@/types/payment";

interface Props {
  totalAmount: number;
  payments: PaymentEntry[];
  isFinalized: boolean;
  onOpenPaymentModal: () => void;
}

export default function PaymentSection({ totalAmount, payments, isFinalized, onOpenPaymentModal }: Props) {
  const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const balance = totalAmount - totalPaid;

  return (
    <Card className="border-border shadow-sm mb-6 flex flex-col">
      <div className="p-4 border-b border-border bg-muted/10 flex justify-between items-center">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" /> Payments
        </h3>
        {isFinalized && balance > 0 && (
          <Button size="sm" onClick={onOpenPaymentModal} className="gap-1.5 h-8">
            <Plus className="w-3.5 h-3.5" /> Record Payment
          </Button>
        )}
      </div>

      <div className="p-4 grid grid-cols-3 gap-4 border-b border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Total Bill</p>
          <p className="text-lg font-bold text-foreground">₹{totalAmount.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Amount Paid</p>
          <p className="text-lg font-bold text-success">₹{totalPaid.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Balance Due</p>
          <p className={`text-lg font-bold ${balance > 0 ? 'text-destructive' : 'text-success'}`}>
            ₹{balance.toFixed(2)}
          </p>
        </div>
      </div>

      {payments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Mode</th>
                <th className="px-4 py-2">Reference</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((p, i) => (
                <tr key={p.paymentId} className="hover:bg-muted/5">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{new Date(p.paymentDate).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-2">{p.paymentMode}</td>
                  <td className="px-4 py-2 font-mono text-xs">{p.referenceNumber}</td>
                  <td className="px-4 py-2">
                    <Badge variant="outline" className={getStatusStyles(p.paymentStatus)}>
                      {p.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-right font-medium">₹{p.amountPaid.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}