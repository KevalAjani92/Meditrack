"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { PaymentEntry } from "@/types/billing";
import { Button } from "@/components/ui/button";

const paymentSchema = z.object({
  mode: z.enum(["Cash", "Card", "UPI", "Insurance", "Other"]),
  amount: z.coerce.number().min(1, "Amount required"),
  referenceNumber: z.string().optional(),
});

type FormData = z.infer<typeof paymentSchema>;

interface Props { isOpen: boolean; onClose: () => void; onAdd: (payment: PaymentEntry) => void; maxAmount: number; }

export default function PaymentEntryModal({ isOpen, onClose, onAdd, maxAmount }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(paymentSchema), defaultValues: { amount: maxAmount } });

  const onSubmit = (data: FormData) => {
    onAdd({ id: `pay-${Date.now()}`, date: new Date().toISOString().split('T')[0], status: "Success", ...data });
    reset(); onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-sm translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-6 shadow-xl border border-border animate-in zoom-in-95">
          <div className="flex justify-between items-center mb-5 border-b border-border pb-3">
            <Dialog.Title className="text-lg font-bold text-foreground">Record Payment</Dialog.Title>
            <button onClick={onClose} className="text-muted-foreground"><X className="w-5 h-5"/></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1 block">Payment Mode</label>
              <select {...register("mode")} className="w-full p-2 border rounded-md bg-background text-sm outline-none focus:ring-1 focus:ring-primary">
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Insurance">Insurance</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Amount ($) <span className="text-muted-foreground font-normal">(Max: {maxAmount.toFixed(2)})</span></label>
              <input type="number" step="0.01" max={maxAmount} {...register("amount")} className="w-full p-2 border rounded-md bg-background text-sm outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Ref / Trans ID (Optional)</label>
              <input {...register("referenceNumber")} className="w-full p-2 border rounded-md bg-background text-sm outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. TXN123..." />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit">Confirm Payment</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}