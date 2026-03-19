"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Procedure } from "@/types/consultation";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";

const schema = z.object({
  name: z.string().min(2, "Procedure required"),
  code: z.string().optional(),
  date: z.string().min(1, "Date required"),
  remarks: z.string().optional(),
});

interface Props { isOpen: boolean; onClose: () => void; onSave: (data: any) => void; defaultValues: Procedure | null; }

const mockProcedures = [
  { label: "ECG - Electrocardiogram (PR-001)", value: "ECG - Electrocardiogram|PR-001" },
  { label: "Wound Dressing (PR-002)", value: "Wound Dressing|PR-002" },
];

export default function AddProcedureModal({ isOpen, onClose, onSave, defaultValues }: Props) {
  const isEdit = !!defaultValues;
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { date: new Date().toISOString().split('T')[0] } });

  useEffect(() => { if (isOpen) reset(defaultValues || { name: "", code: "", date: new Date().toISOString().split('T')[0], remarks: "" }); }, [isOpen, defaultValues, reset]);

  const handleSelect = (val: string) => {
    if (!val) return;
    const [name, code] = val.split("|");
    setValue("name", name); setValue("code", code);
  };

  const onSubmit = (data: any) => { onSave({ id: defaultValues?.id || `proc-${Date.now()}`, ...data }); onClose(); };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-6 shadow-xl border border-border animate-in zoom-in-95">
          <div className="flex justify-between items-center mb-5"><Dialog.Title className="text-lg font-bold">{isEdit ? "Edit Procedure" : "Add Procedure"}</Dialog.Title><button onClick={onClose}><X className="w-5 h-5 text-muted-foreground"/></button></div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Search Procedure</label>
              <SearchableSelect options={mockProcedures} onChange={handleSelect} value={watch("code") ? `${watch("name")}|${watch("code")}` : ""} placeholder="Type to search..." />
              {errors.name && <p className="text-xs text-destructive">{(errors.name as any).message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Procedure Date</label>
              <input type="date" {...register("date")} className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-1 focus:ring-primary outline-none" />
              {errors.date && <p className="text-xs text-destructive">{(errors.date as any).message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Remarks</label>
              <input {...register("remarks")} className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="button" onClick={handleSubmit(onSubmit)}>{isEdit ? "Save Changes" : "Add Procedure"}</Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}