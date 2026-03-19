"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { FollowUp } from "@/types/consultation";
import { Button } from "@/components/ui/button";

const schema = z.object({
  date: z.string().min(1, "Date required"),
  reason: z.string().min(2, "Reason required"),
  status: z.enum(["Pending", "Completed", "Missed"]),
});

interface Props { isOpen: boolean; onClose: () => void; onSave: (data: any) => void; defaultValues: FollowUp | null; }

export default function AddFollowupModal({ isOpen, onClose, onSave, defaultValues }: Props) {
  const isEdit = !!defaultValues;
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({ 
    resolver: zodResolver(schema), 
    defaultValues: { status: "Pending" } 
  });
  
  const [days, setDays] = useState("");

  useEffect(() => { 
    if (isOpen) { 
      reset(defaultValues || { date: "", reason: "", status: "Pending" }); 
      setDays(""); 
    } 
  }, [isOpen, defaultValues, reset]);

  // Auto calculate date when days are entered
  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDays(val);
    if(val && !isNaN(parseInt(val))) {
      const d = new Date(); 
      d.setDate(d.getDate() + parseInt(val));
      setValue("date", d.toISOString().split('T')[0], { shouldValidate: true });
    }
  };

  const onSubmit = (data: any) => { 
    onSave({ id: defaultValues?.id || `fu-${Date.now()}`, ...data }); 
    onClose(); 
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-6 shadow-xl border border-border animate-in zoom-in-95">
          <div className="flex justify-between items-center mb-5">
            <Dialog.Title className="text-lg font-bold text-foreground">{isEdit ? "Edit Follow-Up" : "Schedule Follow-Up"}</Dialog.Title>
            <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground hover:text-foreground"/></button>
          </div>
          <div className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4 bg-muted/20 p-3 rounded-lg border border-border">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Days After</label>
                <input type="number" value={days} onChange={handleDaysChange} placeholder="e.g. 7" className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Specific Date</label>
                <input type="date" {...register("date")} className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-1 focus:ring-primary outline-none" />
                {errors.date && <p className="text-xs text-destructive">{(errors.date as any).message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Reason for Follow-up</label>
              <input {...register("reason")} placeholder="e.g. Review test reports" className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-1 focus:ring-primary outline-none" />
              {errors.reason && <p className="text-xs text-destructive">{(errors.reason as any).message}</p>}
            </div>

            {isEdit && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Status</label>
                <select {...register("status")} className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-1 focus:ring-primary outline-none">
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Missed">Missed</option>
                </select>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="button" onClick={handleSubmit(onSubmit)}>{isEdit ? "Save Changes" : "Add Schedule"}</Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}