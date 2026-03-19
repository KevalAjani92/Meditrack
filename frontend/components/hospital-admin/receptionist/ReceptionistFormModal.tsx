"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Receptionist } from "@/types/receptionist";
import { receptionistService } from "@/services/receptionist.service";
import { toast } from "sonner";

const receptionistSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(10, "Phone number required"),
  is_active: z.boolean(),
});

type ReceptionistFormValues = z.infer<typeof receptionistSchema>;

interface ReceptionistFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Receptionist;
  hospitalId: number;
  onSuccess: (password?: string) => void;
}

export default function ReceptionistFormModal({ isOpen, onClose, defaultValues, hospitalId, onSuccess }: ReceptionistFormModalProps) {
  const isEdit = !!defaultValues;
  const [backendError, setBackendError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReceptionistFormValues>({
    resolver: zodResolver(receptionistSchema),
    defaultValues: {
      is_active: true,
    }
  });

  const isActive = watch("is_active");

  useEffect(() => {
    if (isOpen) {
      setBackendError(null);
      reset({
        full_name: defaultValues?.name || "",
        email: defaultValues?.email || "",
        phone_number: defaultValues?.phone || "",
        is_active: defaultValues?.status === "Inactive" ? false : true,
      });
    }
  }, [isOpen, defaultValues, reset]);

  const onSubmit = async (data: ReceptionistFormValues) => {
    setBackendError(null);
    try {
      if (isEdit) {
        await receptionistService.updateReceptionist(defaultValues!.user_id, data);
        toast.success("Receptionist updated successfully");
        onSuccess();
      } else {
        const res = await receptionistService.createReceptionist(hospitalId, data);
        toast.success("Receptionist created successfully");
        onSuccess(res.generatedPassword);
      }
    } catch (err: any) {
      const msg = err?.message || err?.errors?.[0] || "Something went wrong";
      setBackendError(msg);
      toast.error(msg);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-6 shadow-lg border border-border animate-in fade-in zoom-in-95 duration-200">
          
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-lg font-semibold text-foreground">
              {isEdit ? "Edit Receptionist" : "Add Receptionist"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {backendError && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
              {backendError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Full Name</label>
              <input
                {...register("full_name")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
                placeholder="Jane Doe"
              />
              {errors.full_name && <span className="text-xs text-destructive">{errors.full_name.message}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email Address</label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
                placeholder="jane@hospital.com"
              />
              {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Contact Phone</label>
              <input
                {...register("phone_number")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
                placeholder="+91 9876543210"
              />
              {errors.phone_number && <span className="text-xs text-destructive">{errors.phone_number.message}</span>}
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20 mt-2">
              <div className="space-y-0.5">
                 <label className="text-sm font-medium">Account Status</label>
                 <p className="text-xs text-muted-foreground">Access to dashboard</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" {...register("is_active")} />
                <div className={`w-9 h-5 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${isActive ? 'bg-success after:translate-x-full after:border-white' : 'bg-gray-200'}`}></div>
              </label>
            </div>

            {!isEdit && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  🔐 A password will be auto-generated and displayed after creation.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEdit ? "Save Changes" : "Create Account"}
              </Button>
            </div>

          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}