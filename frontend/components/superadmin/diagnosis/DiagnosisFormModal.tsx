"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Loader2, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Diagnosis } from "@/types/diagnosis";
import { useAllDepartments } from "@/hooks/departments/useDepartments";
import { useToast } from "@/components/ui/toast";
import { useCreateDiagnosis } from "@/hooks/diagnosis/useCreateDiagnosis";
import { useUpdateDiagnosis } from "@/hooks/diagnosis/useUpdateDiagnosis";

// Schema
const diagnosisSchema = z.object({
  diagnosis_code: z.string().min(2, "Code must be at least 2 characters"),
  diagnosis_name: z.string().min(3, "Name is required"),
  description: z.string().optional(),
  department_id: z.number().min(1, "Please select a department"),
});

type DiagnosisFormValues = z.infer<typeof diagnosisSchema>;

interface DiagnosisFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Diagnosis;
  preselectedDepartmentId?: number | null; // Scoped mode ID
}

export default function DiagnosisFormModal({
  isOpen,
  onClose,
  defaultValues,
  preselectedDepartmentId,
}: DiagnosisFormModalProps) {
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
    formState: { errors, isSubmitting },
  } = useForm<DiagnosisFormValues>({
    resolver: zodResolver(diagnosisSchema),
  });

  const { mutateAsync: createDiag, isPending: isCreating } =
    useCreateDiagnosis();

  const { mutateAsync: updateDiag, isPending: isUpdating } =
    useUpdateDiagnosis();

  const isLoadingDiag = isCreating || isUpdating;

  useEffect(() => {
    if (isOpen) {
      reset({
        diagnosis_code: defaultValues?.diagnosis_code || "",
        diagnosis_name: defaultValues?.diagnosis_name || "",
        description: defaultValues?.description || "",
        department_id:
          defaultValues?.department_id || preselectedDepartmentId || 0,
      });
    }
  }, [isOpen, defaultValues, preselectedDepartmentId, reset]);

  const onSubmit = async (data: DiagnosisFormValues) => {
    try {
      const payload = {
        ...data,
      };
      if (isEdit) {
        await updateDiag({ id: defaultValues!.diagnosis_id, payload });
        addToast("Diagnosis updated successfully", "success");
      } else {
        await createDiag(payload);
        addToast("Diagnosis created successfully", "success");
      }
      onClose();
    } catch (error: any) {
      addToast(
        error?.response?.data?.message || "Failed to save diagnosis",
        "error",
      );
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-6 shadow-lg border border-border animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-lg font-semibold text-foreground">
              {isEdit ? "Edit Diagnosis" : "Add Diagnosis"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Context Banner inside Modal if Locked */}
            {isDepartmentLocked && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-primary" />
                <span className="text-xs text-primary font-medium">
                  Adding to{" "}
                  {
                    departments.find(
                      (d) => d.department_id === preselectedDepartmentId,
                    )?.department_name
                  }
                </span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 space-y-1.5">
                <label className="text-sm font-medium">
                  Code <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("diagnosis_code")}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm font-mono focus:ring-1 focus:ring-primary outline-none uppercase"
                  placeholder="A00.0"
                />
                {errors.diagnosis_code && (
                  <span className="text-xs text-destructive">
                    {errors.diagnosis_code.message}
                  </span>
                )}
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-sm font-medium">Department</label>
                <select
                  {...register("department_id",{valueAsNumber: true})}
                  disabled={isDepartmentLocked} // UX Rule: Lock if scoped
                  className={`w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none ${isDepartmentLocked ? "opacity-60 cursor-not-allowed bg-muted" : ""}`}
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

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Diagnosis Name <span className="text-destructive">*</span>
              </label>
              <input
                {...register("diagnosis_name")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
                placeholder="e.g. Essential Hypertension"
              />
              {errors.diagnosis_name && (
                <span className="text-xs text-destructive">
                  {errors.diagnosis_name.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <textarea
                {...register("description")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none min-h-[80px] resize-none"
                placeholder="Clinical description..."
              />
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoadingDiag} className="gap-2">
                {isLoadingDiag && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEdit ? "Save Changes" : "Add Diagnosis"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
