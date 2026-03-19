"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Search } from "lucide-react";
import { Diagnosis } from "@/types/consultation";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select"; // Reusing the requested component

const schema = z.object({
  name: z.string().min(2, "Diagnosis required"),
  code: z.string().optional(),
  department: z.string().optional(),
  isPrimary: z.boolean(),
  remarks: z.string().optional(),
});

interface Props { isOpen: boolean; onClose: () => void; onSave: (data: any) => void; defaultValues: Diagnosis | null; }

const mockICD10 = [
  { label: "Essential (primary) hypertension (I10)", value: "Essential (primary) hypertension|I10" },
  { label: "Type 2 diabetes mellitus (E11.9)", value: "Type 2 diabetes mellitus|E11.9" },
  { label: "Migraine, unspecified (G43.909)", value: "Migraine, unspecified|G43.909" }
];

export default function AddDiagnosisModal({ isOpen, onClose, onSave, defaultValues }: Props) {
  const isEdit = !!defaultValues;
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { isPrimary: false } });

  useEffect(() => {
    if (isOpen) reset(defaultValues || { name: "", code: "", isPrimary: false, remarks: "" });
  }, [isOpen, defaultValues, reset]);

  const handleSelect = (val: string) => {
    if (!val) return;
    const [name, code] = val.split("|");
    setValue("name", name);
    setValue("code", code);
  };

  const onSubmit = (data: any) => {
    onSave({ id: defaultValues?.id || `diag-${Date.now()}`, ...data });
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-6 shadow-xl border border-border animate-in zoom-in-95">
          <div className="flex justify-between items-center mb-5"><Dialog.Title className="text-lg font-bold">{isEdit ? "Edit Diagnosis" : "Add Diagnosis"}</Dialog.Title><button onClick={onClose}><X className="w-5 h-5 text-muted-foreground"/></button></div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Search ICD-10 Diagnosis</label>
              <SearchableSelect 
                options={mockICD10} 
                onChange={handleSelect} 
                value={watch("code") ? `${watch("name")}|${watch("code")}` : ""} 
                placeholder="Type to search..." 
              />
              {errors.name && <p className="text-xs text-destructive">{(errors.name as any).message}</p>}
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/20 border border-border rounded-md">
              <input type="checkbox" id="primary" {...register("isPrimary")} className="w-4 h-4 accent-primary" />
              <label htmlFor="primary" className="text-sm font-medium cursor-pointer">Mark as Primary Diagnosis</label>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Remarks</label>
              <input {...register("remarks")} className="w-full px-3 py-2 border rounded-md bg-background focus:ring-1 focus:ring-primary outline-none text-sm" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="button" onClick={handleSubmit(onSubmit)}>{isEdit ? "Save Changes" : "Add Diagnosis"}</Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}