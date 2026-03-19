"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Medicine } from "@/types/medicine";
import { useCreateMedicine } from "@/hooks/medicines/useCreateMedicine";
import { useToast } from "@/components/ui/toast";
import { useUpdateMedicine } from "@/hooks/medicines/useUpdateMedicine";

const medicineSchema = z.object({
  medicine_code: z.string().min(2).max(15),
  medicine_name: z.string().min(3, "Name must be at least 3 characters"),
  medicine_type: z.string().min(1, "Type is required"),
  strength: z.string().min(1, "Strength is required (e.g. 500mg)"),
  manufacturer: z.string().min(2, "Manufacturer is required"),
  is_active: z.boolean(),
});

type MedicineFormValues = z.infer<typeof medicineSchema>;

interface MedicineFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Medicine;
}

export default function MedicineFormModal({
  isOpen,
  onClose,
  defaultValues,
}: MedicineFormModalProps) {
  const isEdit = !!defaultValues;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      is_active: true,
      medicine_type: "Tablet",
    },
  });

   const { addToast } = useToast();
  
    const { mutateAsync: createMedicine, isPending: isCreating } = useCreateMedicine();
  
    const { mutateAsync: updateMedicine, isPending: isUpdating } = useUpdateMedicine();

  const isActive = watch("is_active");

  useEffect(() => {
    if (isOpen) {
      reset({
        medicine_code: defaultValues?.medicine_code || "",
        medicine_name: defaultValues?.medicine_name || "",
        medicine_type: defaultValues?.medicine_type || "Tablet",
        strength: defaultValues?.strength || "",
        manufacturer: defaultValues?.manufacturer || "",
        is_active: defaultValues?.is_active ?? true,
      });
    }
  }, [isOpen, defaultValues, reset]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: MedicineFormValues): Promise<void> => {
    try {
      if (!isEdit) {
        await createMedicine(data);
        addToast("Medicine created successfully", "success");
      } else {
        await updateMedicine({
          id: defaultValues!.medicine_id,
          payload: data,
        });
        addToast("Medicine updated successfully", "success");
      }

      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";

      addToast(message, "error");
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-6 shadow-lg border border-border animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-lg font-semibold text-foreground">
              {isEdit ? "Edit Medicine" : "Add Medicine"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Medicine Code <span className="text-destructive">*</span>
              </label>
              <input
                {...register("medicine_code")}
                onChange={(e) =>
                  setValue("medicine_code", e.target.value.toUpperCase())
                }
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm font-mono focus:ring-1 focus:ring-primary outline-none uppercase placeholder:normal-case"
                placeholder="PARA-500"
              />
              {errors.medicine_code && (
                <span className="text-xs text-destructive">
                  {errors.medicine_code.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Medicine Name <span className="text-destructive">*</span>
              </label>
              <input
                {...register("medicine_name")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
                placeholder="e.g. Paracetamol"
              />
              {errors.medicine_name && (
                <span className="text-xs text-destructive">
                  {errors.medicine_name.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Type</label>
                <select
                  {...register("medicine_type")}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="Tablet">Tablet</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Injection">Injection</option>
                  <option value="Infusion">Infusion</option>
                  <option value="Ointment">Ointment</option>
                  <option value="Cream">Cream</option>
                  <option value="Gel">Gel</option>
                  <option value="Lotion">Lotion</option>
                  <option value="Eye Drops">Eye Drops</option>
                  <option value="Ear Drops">Ear Drops</option>
                  <option value="Nasal Spray">Nasal Spray</option>
                  <option value="Inhaler">Inhaler</option>
                  <option value="Powder">Powder</option>
                  <option value="Suppository">Suppository</option>
                  <option value="Patch">Patch</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Strength <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("strength")}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
                  placeholder="e.g. 500mg"
                />
                {errors.strength && (
                  <span className="text-xs text-destructive">
                    {errors.strength.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Manufacturer <span className="text-destructive">*</span>
              </label>
              <input
                {...register("manufacturer")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
                placeholder="e.g. Global Pharma"
              />
              {errors.manufacturer && (
                <span className="text-xs text-destructive">
                  {errors.manufacturer.message}
                </span>
              )}
            </div>

            {/* Active Switch */}
            <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-foreground">
                  Stock Status
                </label>
                <p className="text-xs text-muted-foreground">
                  Is this medicine currently available?
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("is_active")}
                  className="sr-only peer"
                />
                <div
                  className={`w-11 h-6 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isActive ? "bg-primary" : "bg-gray-200"}`}
                ></div>
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating} className="gap-2">
                {isCreating || isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isEdit ? "Save Changes" : "Create Medicine"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
