"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Loader2, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { TreatmentType, mockDepartments } from "@/types/treatment";
import { useAllDepartments } from "@/hooks/departments/useDepartments";
import { useToast } from "@/components/ui/toast";
import { useUpdateTreatment } from "@/hooks/treatment/useUpdateTreatment";
import { useCreateTreatment } from "@/hooks/treatment/useCreateTreatment";

const treatmentSchema = z.object({
  treatment_code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(10),
  treatment_name: z.string().min(3, "Name is required"),
  description: z.string().optional(),
  department_id: z.number().min(1, "Please select a department"),
  is_active: z.boolean(),
});

type TreatmentFormValues = z.infer<typeof treatmentSchema>;

interface TreatmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: TreatmentType;
  preselectedDepartmentId?: number | null;
}

export default function TreatmentFormModal({
  isOpen,
  onClose,
  defaultValues,
  preselectedDepartmentId,
}: TreatmentFormModalProps) {
  const isEdit = !!defaultValues;
  const isDepartmentLocked = !!preselectedDepartmentId && !isEdit;
  const { addToast } = useToast();
  const { data, isLoading } = useAllDepartments();
  const departments = data || [];
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TreatmentFormValues>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      is_active: true,
    },
  });

  const { mutateAsync: createTreatment, isPending: isCreating } =
    useCreateTreatment();

  const { mutateAsync: updateTreatment, isPending: isUpdating } =
    useUpdateTreatment();

  // Watch for styling active switch
  const isActive = watch("is_active");

  useEffect(() => {
    if (isOpen) {
      reset({
        treatment_code: defaultValues?.treatment_code || "",
        treatment_name: defaultValues?.treatment_name || "",
        description: defaultValues?.description || "",
        department_id: 
          defaultValues?.department_id || preselectedDepartmentId || 0,
        is_active: defaultValues?.is_active ?? true,
      });
    }
  }, [isOpen, defaultValues, preselectedDepartmentId, reset]);

  const onSubmit = async (data: TreatmentFormValues) => {
    try {
      const payload = {
        ...data,
        department_id: Number(data.department_id),
      };
      if (isEdit) {
        await updateTreatment({ id: defaultValues!.treatment_type_id, payload });
        addToast("Treatment updated successfully", "success");
      } else {
        await createTreatment(payload);
        addToast("Treatment created successfully", "success");
      }
      onClose();
    } catch (error: any) {
      addToast(
        error?.response?.data?.message || "Failed to save Treatment",
        "error",
      );
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-6 shadow-lg border border-border animate-in fade-in zoom-in-95 duration-200">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-lg font-semibold text-foreground">
              {isEdit ? "Edit Treatment Type" : "Add Treatment Type"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Context Banner */}
            {isDepartmentLocked && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-primary" />
                <span className="text-xs text-primary font-medium">
                  Configuring for{" "}
                  {
                    departments.find(
                      (d) => d.department_id === preselectedDepartmentId,
                    )?.department_name
                  }
                </span>
              </div>
            )}

            {/* Row 1: Code & Dept */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 space-y-1.5">
                <label className="text-sm font-medium">
                  Code <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("treatment_code")}
                  onChange={(e) =>
                    setValue("treatment_code", e.target.value.toUpperCase())
                  }
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm font-mono focus:ring-1 focus:ring-primary outline-none uppercase placeholder:normal-case"
                  placeholder="CABG"
                />
                {errors.treatment_code && (
                  <span className="text-xs text-destructive">
                    {errors.treatment_code.message}
                  </span>
                )}
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-sm font-medium">Department</label>
                <select
                  {...register("department_id",{valueAsNumber: true})}
                  disabled={isDepartmentLocked}
                  className={`w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none ${
                    isDepartmentLocked
                      ? "opacity-60 cursor-not-allowed bg-muted"
                      : ""
                  }`}
                >
                  <option value={0}>Select Dept...</option>
                  {isLoading ? (
                    <option disabled>Loading...</option>
                  ) : (
                    departments.map((dept: any) => (
                      <option
                        key={dept.department_id}
                        value={dept.department_id}
                      >
                        {dept.department_name}
                      </option>
                    ))
                  )}
                </select>
                {errors.department_id && (
                  <span className="text-xs text-destructive">
                    {errors.department_id.message}
                  </span>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Treatment Name <span className="text-destructive">*</span>
              </label>
              <input
                {...register("treatment_name")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
                placeholder="e.g. Coronary Artery Bypass Graft"
              />
              {errors.treatment_name && (
                <span className="text-xs text-destructive">
                  {errors.treatment_name.message}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <textarea
                {...register("description")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none min-h-[80px] resize-none"
                placeholder="Clinical description for internal reference..."
              />
            </div>

            {/* Active Status Switch (Custom styled checkbox) */}
            <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-foreground">
                  Operational Status
                </label>
                <p className="text-xs text-muted-foreground">
                  Is this treatment available for booking?
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

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating|| isUpdating} className="gap-2">
                {isCreating || isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEdit ? "Save Changes" : "Create Treatment"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
