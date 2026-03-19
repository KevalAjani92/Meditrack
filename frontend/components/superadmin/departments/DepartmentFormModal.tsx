"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Loader2, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Department } from "@/types/department";
import { useToast } from "@/components/ui/toast";
import { useUpdateDepartment } from "@/hooks/departments/useUpdateDepartment";
import { useCreateDepartment } from "@/hooks/departments/useCreateDepartment";

const departmentSchema = z.object({
  department_code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(10, "Code is too long"),
  department_name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
});

type DeptFormValues = z.infer<typeof departmentSchema>;

interface DepartmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Department;
}

export default function DepartmentFormModal({
  isOpen,
  onClose,
  defaultValues,
}: DepartmentFormModalProps) {
  const isEdit = !!defaultValues;
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DeptFormValues>({
    resolver: zodResolver(departmentSchema),
  });

  const { mutateAsync: createDept, isPending: isCreating } =
    useCreateDepartment();

  const { mutateAsync: updateDept, isPending: isUpdating } =
    useUpdateDepartment();

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (isOpen) {
      reset({
        department_code: defaultValues?.department_code || "",
        department_name: defaultValues?.department_name || "",
        description: defaultValues?.description || "",
      });
    }
  }, [isOpen, defaultValues, reset]);

  const onSubmit = async (data: DeptFormValues) => {
    try {
      const payload = {
        ...data,
        department_code: data.department_code.toUpperCase(),
      };

      if (isEdit) {
        await updateDept({
          id: defaultValues!.department_id,
          payload,
        });
        addToast("Department updated successfully", "success");
      } else {
        await createDept(payload);
        addToast("Department created successfully", "success");
      }

      onClose();
    } catch (error: any) {
      addToast(
        error?.response?.data?.message || "Failed to save department",
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
              {isEdit ? "Edit Department" : "Add Department"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Department Code */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Department Code <span className="text-destructive">*</span>
              </label>
              <input
                {...register("department_code")}
                onChange={(e) => {
                  // UI formatting hint: Force uppercase instantly
                  setValue("department_code", e.target.value.toUpperCase());
                }}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none uppercase placeholder:normal-case"
                placeholder="e.g. CARD"
                maxLength={10}
              />
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
                <Info className="w-3 h-3" /> Standard practice is 3-4 uppercase
                letters.
              </div>
              {errors.department_code && (
                <span className="text-xs text-destructive">
                  {errors.department_code.message}
                </span>
              )}
            </div>

            {/* Department Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Department Name <span className="text-destructive">*</span>
              </label>
              <input
                {...register("department_name")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
                placeholder="e.g. Cardiology"
              />
              {errors.department_name && (
                <span className="text-xs text-destructive">
                  {errors.department_name.message}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <textarea
                {...register("description")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none min-h-[80px] resize-none"
                placeholder="Briefly describe the department's focus..."
              />
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEdit ? "Save Changes" : "Add Department"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
