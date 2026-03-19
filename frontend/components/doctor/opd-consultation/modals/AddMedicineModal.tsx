"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Prescription } from "@/types/consultation";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";

const schema = z.object({
  medicineName: z.string().min(2, "Medicine required"),
  dosage: z.string().min(1, "Dosage required"),
  quantity: z.coerce.number().min(1),
  durationDays: z.coerce.number().min(1),
  instructions: z.string().optional(),
  timing: z.enum(["Before Food", "After Food", "Anytime"]),
});

interface Props { isOpen: boolean; onClose: () => void; onSave: (data: any) => void; defaultValues: Prescription | null; }

const mockMedicines = [
  { label: "Paracetamol 500mg", value: "Paracetamol 500mg" },
  { label: "Amoxicillin 250mg", value: "Amoxicillin 250mg" },
  { label: "Amlodipine 5mg", value: "Amlodipine 5mg" },
];

export default function AddMedicineModal({ isOpen, onClose, onSave, defaultValues }: Props) {
  const isEdit = !!defaultValues;
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { timing: "After Food", durationDays: 5, quantity: 10 } });

  useEffect(() => { if (isOpen) reset(defaultValues || { medicineName: "", dosage: "1-0-1", quantity: 10, durationDays: 5, instructions: "", timing: "After Food" }); }, [isOpen, defaultValues, reset]);

  const onSubmit = (data: any) => { onSave({ id: defaultValues?.id || `med-${Date.now()}`, ...data }); onClose(); };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-6 shadow-xl border border-border animate-in zoom-in-95">
          <div className="flex justify-between items-center mb-5"><Dialog.Title className="text-lg font-bold">{isEdit ? "Edit Medicine" : "Add Medicine"}</Dialog.Title><button onClick={onClose}><X className="w-5 h-5 text-muted-foreground"/></button></div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Search Medicine</label>
              <SearchableSelect options={mockMedicines} onChange={(v) => setValue("medicineName", v)} value={watch("medicineName")} placeholder="Type to search..." />
              {errors.medicineName && <p className="text-xs text-destructive">{(errors.medicineName as any).message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Dosage</label>
                <input {...register("dosage")} placeholder="1-0-1" className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Timing</label>
                <select {...register("timing")} className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-1 focus:ring-primary outline-none">
                  <option value="Before Food">Before Food</option>
                  <option value="After Food">After Food</option>
                  <option value="Anytime">Anytime</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Duration (Days)</label>
                <input type="number" {...register("durationDays")} className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Total Quantity</label>
                <input type="number" {...register("quantity")} className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-1 focus:ring-primary outline-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Special Instructions</label>
              <input {...register("instructions")} className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. Take with warm water" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="button" onClick={handleSubmit(onSubmit)}>{isEdit ? "Save Changes" : "Add Medicine"}</Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}