"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, IndianRupee, Printer, Download, FileText, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Payment, getStatusStyles } from "@/types/payment";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
}

export default function PaymentDetailModal({ isOpen, onClose, payment }: Props) {
  if (!payment) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-card p-0 shadow-xl border border-border animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          
          {/* Header */}
          <div className="p-6 border-b border-border bg-muted/10 flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Transaction Receipt</p>
              <h2 className="text-2xl font-mono font-bold text-foreground">{payment.paymentId}</h2>
              <p className="text-sm text-muted-foreground mt-1">{payment.date} at {payment.time}</p>
            </div>
            <Badge variant="outline" className={`${getStatusStyles(payment.status)} text-xs px-2.5 py-1`}>
              {payment.status === "Success" && <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
              {payment.status === "Failed" && <AlertTriangle className="w-3.5 h-3.5 mr-1" />}
              {payment.status === "Pending" && <Clock className="w-3.5 h-3.5 mr-1" />}
              {payment.status}
            </Badge>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Amount Highlight */}
            <div className="flex flex-col items-center justify-center p-6 bg-primary/5 border border-primary/20 rounded-xl">
               <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-2">Amount Paid</p>
               <p className="text-4xl font-black text-foreground flex items-center">
                 <IndianRupee className="w-8 h-8 mr-1 opacity-50" /> {payment.amount.toLocaleString('en-IN')}
               </p>
               <Badge className="mt-3 bg-background text-foreground border-border">{payment.mode} Payment</Badge>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
               <div>
                 <p className="text-xs text-muted-foreground mb-0.5">Patient Name</p>
                 <p className="font-semibold text-foreground">{payment.patientName}</p>
               </div>
               <div>
                 <p className="text-xs text-muted-foreground mb-0.5">Phone Number</p>
                 <p className="font-medium text-foreground">{payment.patientPhone}</p>
               </div>
               <div>
                 <p className="text-xs text-muted-foreground mb-0.5">Bill Number</p>
                 <p className="font-mono font-medium text-primary">{payment.billNumber}</p>
               </div>
               <div>
                 <p className="text-xs text-muted-foreground mb-0.5">Consulting Doctor</p>
                 <p className="font-medium text-foreground">{payment.doctorName}</p>
               </div>
               <div>
                 <p className="text-xs text-muted-foreground mb-0.5">Reference ID</p>
                 <p className="font-mono text-foreground">{payment.referenceNumber}</p>
               </div>
               <div>
                 <p className="text-xs text-muted-foreground mb-0.5">Received By</p>
                 <p className="font-medium text-foreground">{payment.receivedBy}</p>
               </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-muted/30 border-t border-border flex justify-between gap-3">
             <Button variant="outline" className="text-xs h-9 gap-1.5">
               <FileText className="w-3.5 h-3.5" /> View Bill
             </Button>
             <div className="flex gap-2">
                <Button variant="secondary" className="gap-1.5 h-9 text-xs">
                  <Download className="w-3.5 h-3.5" /> PDF
                </Button>
                <Button className="gap-1.5 h-9 text-xs">
                  <Printer className="w-3.5 h-3.5" /> Print
                </Button>
             </div>
          </div>
          
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground bg-background/50 rounded-full p-1"><X className="w-5 h-5" /></button>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}