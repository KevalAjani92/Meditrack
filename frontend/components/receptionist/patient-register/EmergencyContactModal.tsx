"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emergencyContactSchema, EmergencyContact } from "@/types/patient-registration";
import { X, Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EmergencyContact) => void;
  defaultValues?: EmergencyContact;
}

export default function EmergencyContactModal({ isOpen, onClose, onSave, defaultValues }: Props) {
  const isEdit = !!defaultValues;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EmergencyContact>({
    resolver: zodResolver(emergencyContactSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues || { name: "", phone: "", relation: "", isPrimary: false });
    }
  }, [isOpen, defaultValues, reset]);

  // Local submit handler to prevent parent form submission
  const handleLocalSubmit = async (data: EmergencyContact) => {
    await new Promise(r => setTimeout(r, 600)); // Mock small delay for UX
    onSave(data);
  };
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // 🛑 Stops React from triggering the parent page.tsx form
    handleSubmit(handleLocalSubmit)();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-6 shadow-xl border border-border animate-in fade-in zoom-in-95 duration-200">
          
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-lg font-bold text-foreground">
              {isEdit ? "Edit Contact" : "Add Emergency Contact"}
            </Dialog.Title>
            <button 
              type="button" 
              onClick={onClose} 
              className="text-muted-foreground hover:text-foreground outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* FIX: Changed <form> to <div> to prevent nested form submission.
            The main page already has a <form> wrapping this component. 
          */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Contact Name</label>
              <input 
                {...register("name")} 
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:ring-2 focus:ring-ring outline-none" 
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Relation</label>
                <input 
                  {...register("relation")} 
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:ring-2 focus:ring-ring outline-none" 
                  placeholder="e.g. Spouse" 
                />
                {errors.relation && <p className="text-xs text-destructive">{errors.relation.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <input 
                  {...register("phone")} 
                  className="w-full px-3 py-2 border border-input rounded-md bg-background font-mono text-sm focus:ring-2 focus:ring-ring outline-none" 
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 mt-2 rounded-lg border border-border bg-muted/20">
              <input 
                type="checkbox" 
                id="isPrimary" 
                {...register("isPrimary")} 
                className="w-4 h-4 accent-primary" 
              />
              <label htmlFor="isPrimary" className="text-sm font-medium text-foreground cursor-pointer">
                Set as Primary Contact
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 border border-input bg-transparent text-foreground text-sm font-medium rounded-md hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              {/* FIX: type="button" instead of "submit", and trigger handleSubmit manually */}
              <button 
                type="button" 
                onClick={handleSaveClick}
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEdit ? "Update Contact" : "Save Contact"}
              </button>
            </div>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}