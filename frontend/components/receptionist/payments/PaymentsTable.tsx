"use client";

import { motion } from "framer-motion";
import { Payment, getStatusStyles } from "@/types/payment";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PaymentActionsMenu from "./PaymentActionsMenu";

interface Props {
  data: Payment[];
  onAction: (action: string, payment: Payment) => void;
}

export default function PaymentsTable({ data, onAction }: Props) {
  return (
    <Card className="overflow-hidden border-border shadow-sm relative">
      <div className="overflow-x-auto max-h-[600px] no-scrollbar">
        <table className="w-full text-sm text-left relative">
          <thead className="bg-muted text-muted-foreground font-medium sticky top-0 z-10 shadow-sm border-b border-border">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Payment ID</th>
              <th className="px-4 py-3 whitespace-nowrap">Date & Time</th>
              <th className="px-4 py-3 whitespace-nowrap">Patient / Bill No</th>
              <th className="px-4 py-3 whitespace-nowrap">Mode / Ref</th>
              <th className="px-4 py-3 whitespace-nowrap text-right">Amount (₹)</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 whitespace-nowrap text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  No payments found matching the selected filters.
                </td>
              </tr>
            ) : (
              data.map((payment, index) => {
                const isLarge = payment.amount > 5000;
                return (
                  <motion.tr 
                    key={payment.id} 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/10 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold text-foreground">{payment.paymentId}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">By: {payment.receivedBy}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-foreground">{payment.date}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{payment.time}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">{payment.patientName}</span>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{payment.billNumber}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[10px] font-bold uppercase">{payment.mode}</Badge>
                      <p className="text-xs text-muted-foreground font-mono mt-1">{payment.referenceNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`${isLarge ? 'text-base font-bold text-foreground' : 'font-medium text-foreground'}`}>
                        ₹{payment.amount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={getStatusStyles(payment.status)}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <PaymentActionsMenu 
                        payment={payment}
                        onView={() => onAction("view", payment)}
                        onViewBill={() => onAction("bill", payment)}
                        onPrint={() => onAction("print", payment)}
                        onDownload={() => onAction("download", payment)}
                        onRetry={() => onAction("retry", payment)}
                      />
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}