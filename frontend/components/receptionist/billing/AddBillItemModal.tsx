"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Loader2 } from "lucide-react";
import { BillItem } from "@/types/billing";
import { Button } from "@/components/ui/button";

const itemSchema = z.object({
  type: z.enum(["Consultation", "Test", "Procedure", "Other"]),
  description: z.string().min(2, "Description required"),
  quantity: z.coerce.number().min(1),
  unitPrice: z.coerce.number().min(0),
});

type FormData = z.infer<typeof itemSchema>;

interface Props { isOpen: boolean; onClose: () => void; onAdd: (item: BillItem) => void; }

export default function AddBillItemModal({ isOpen, onClose, onAdd }: Props) {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(itemSchema), defaultValues: { quantity: 1, unitPrice: 0 } });
  
  const q = watch("quantity") || 0;
  const p = watch("unitPrice") || 0;

  const onSubmit = (data: FormData) => {
    onAdd({ id: `item-${Date.now()}`, ...data });
    reset();
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-sm translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-6 shadow-xl border border-border animate-in zoom-in-95">
          <div className="flex justify-between items-center mb-5 border-b border-border pb-3">
            <Dialog.Title className="text-lg font-bold text-foreground">Add Bill Item</Dialog.Title>
            <button onClick={onClose} className="text-muted-foreground"><X className="w-5 h-5"/></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1 block">Item Type</label>
              <select {...register("type")} className="w-full p-2 border rounded-md bg-background text-sm outline-none focus:ring-1 focus:ring-primary">
                <option value="Consultation">Consultation</option>
                <option value="Test">Test</option>
                <option value="Procedure">Procedure</option>
                <option value="Other">Other Charges</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Description</label>
              <input {...register("description")} className="w-full p-2 border rounded-md bg-background text-sm outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. Service Fee" />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium mb-1 block">Quantity</label>
                <input type="number" {...register("quantity")} className="w-full p-2 border rounded-md bg-background text-sm outline-none focus:ring-1 focus:ring-primary text-right" />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Unit Price ($)</label>
                <input type="number" step="0.01" {...register("unitPrice")} className="w-full p-2 border rounded-md bg-background text-sm outline-none focus:ring-1 focus:ring-primary text-right" />
              </div>
            </div>
            <div className="pt-2 flex justify-between items-center text-sm font-bold border-t border-border">
               <span>Total:</span>
               <span className="text-primary">${(q * p).toFixed(2)}</span>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit">Add Item</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}