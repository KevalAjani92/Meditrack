"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { TestOrder } from "@/types/consultation";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";

const schema = z.object({
  testName: z.string().min(2, "Test name required"),
  code: z.string().optional(),
  status: z.enum(["Ordered", "Sample Collected", "Completed", "Cancelled"]),
  remarks: z.string().optional(),
});

interface Props { isOpen: boolean; onClose: () => void; onSave: (data: any) => void; defaultValues: TestOrder | null; }

const mockTests = [
  { label: "Complete Blood Count (CBC) | LAB-101", value: "Complete Blood Count (CBC)|LAB-101" },
  { label: "Lipid Profile | LAB-105", value: "Lipid Profile|LAB-105" },
  { label: "Chest X-Ray | IMG-201", value: "Chest X-Ray|IMG-201" },
];

export default function AddTestModal({ isOpen, onClose, onSave, defaultValues }: Props) {
  const isEdit = !!defaultValues;
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({ 
    resolver: zodResolver(schema), 
    defaultValues: { status: "Ordered" } 
  });

  useEffect(() => { 
    if (isOpen) reset(defaultValues || { testName: "", code: "", status: "Ordered", remarks: "" }); 
  }, [isOpen, defaultValues, reset]);

  const handleSelect = (val: string) => {
    if (!val) return;
    const [testName, code] = val.split("|");
    setValue("testName", testName);
    setValue("code", code);
  };

  const onSubmit = (data: any) => { 
    onSave({ id: defaultValues?.id || `test-${Date.now()}`, ...data }); 
    onClose(); 
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-6 shadow-xl border border-border animate-in zoom-in-95">
          <div className="flex justify-between items-center mb-5">
            <Dialog.Title className="text-lg font-bold text-foreground">{isEdit ? "Edit Test Order" : "Order New Test"}</Dialog.Title>
            <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground hover:text-foreground"/></button>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Search Test Catalog</label>
              <SearchableSelect 
                options={mockTests} 
                onChange={handleSelect} 
                value={watch("code") ? `${watch("testName")}|${watch("code")}` : ""} 
                placeholder="Search by test name or code..." 
              />
              {errors.testName && <p className="text-xs text-destructive">{(errors.testName as any).message}</p>}
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <select {...register("status")} className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-1 focus:ring-primary outline-none">
                <option value="Ordered">Ordered (Pending)</option>
                <option value="Sample Collected">Sample Collected</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Instructions / Remarks</label>
              <textarea {...register("remarks")} className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-1 focus:ring-primary outline-none resize-none h-20" placeholder="e.g., Fasting required for 12 hours" />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="button" onClick={handleSubmit(onSubmit)}>{isEdit ? "Save Changes" : "Order Test"}</Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}