"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Loader2 } from "lucide-react";
import { EmergencyContact } from "@/types/patient";
import { patientService } from "@/services/patient.service";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  relation: z.string().min(2, "Relation is required"),
  phone: z.string().min(10, "Phone is required"),
  isPrimary: z.boolean(),
});

type FormValues = z.infer<typeof contactSchema>;

interface EmergencyContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: EmergencyContact;
  onSaved: () => void;
}

export default function EmergencyContactsModal({ isOpen, onClose, defaultValues, onSaved }: EmergencyContactsModalProps) {
  const isEdit = !!defaultValues;
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { isPrimary: false }
  });

  useEffect(() => {
    if (isOpen) {
      setError(null);
      reset({
        name: defaultValues?.name || "",
        relation: defaultValues?.relation || "",
        phone: defaultValues?.phone || "",
        isPrimary: defaultValues?.isPrimary || false,
      });
    }
  }, [isOpen, defaultValues, reset]);

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      const payload = {
        contact_name: data.name,
        contact_number: data.phone,
        relation: data.relation,
        is_primary: data.isPrimary,
      };

      if (isEdit && defaultValues) {
        await patientService.updateEmergencyContact(defaultValues.id, payload);
      } else {
        await patientService.createEmergencyContact(payload);
      }
      onSaved();
    } catch (err: any) {
      setError(err?.message || "Failed to save contact");
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-6 shadow-xl border border-border animate-in fade-in zoom-in-95 duration-200">

          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-lg font-semibold text-foreground">
              {isEdit ? "Edit Emergency Contact" : "Add Emergency Contact"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors outline-none">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive">{error}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Contact Name</label>
              <input {...register("name")} className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:ring-2 focus:ring-ring outline-none" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Relation</label>
                <input {...register("relation")} placeholder="e.g. Spouse, Brother" className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:ring-2 focus:ring-ring outline-none" />
                {errors.relation && <p className="text-xs text-destructive">{errors.relation.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Phone</label>
                <input {...register("phone")} className="w-full px-3 py-2 border border-input rounded-md bg-background font-mono text-sm focus:ring-2 focus:ring-ring outline-none" />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 mt-2 rounded-lg border border-border bg-muted/20">
              <input type="checkbox" {...register("isPrimary")} id="primary-check" className="w-4 h-4 rounded border-input accent-primary text-primary focus:ring-primary" />
              <label htmlFor="primary-check" className="text-sm font-medium text-foreground cursor-pointer">
                Set as Primary Contact
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-input bg-transparent hover:bg-muted text-foreground text-sm font-medium rounded-md transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEdit ? "Update Contact" : "Add Contact"}
              </button>
            </div>
          </form>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}