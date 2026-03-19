"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Loader2, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { MedicalTest, mockDepartments } from "@/types/medical-test";
import { useToast } from "@/components/ui/toast";
import { useAllDepartments } from "@/hooks/departments/useDepartments";
import { useCreateTest } from "@/hooks/medical-tests/useCreateTest";
import { useUpdateTest } from "@/hooks/medical-tests/useUpdateTest";

const testSchema = z.object({
  test_code: z.string().min(2, "Code must be at least 2 characters").max(10),
  test_name: z.string().min(3, "Name is required"),
  test_type: z.string().min(1, "Type is required"),
  description: z.string().optional(),
  department_id: z.number().min(1, "Please select a department"),
  is_active: z.boolean(),
});

type TestFormValues = z.infer<typeof testSchema>;

interface TestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: MedicalTest;
  preselectedDepartmentId?: number | null;
}

export default function TestFormModal({
  isOpen,
  onClose,
  defaultValues,
  preselectedDepartmentId,
}: TestFormModalProps) {
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
  } = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      is_active: true,
    },
  });

  const { mutateAsync: createTest, isPending: isCreating } = useCreateTest();

  const { mutateAsync: updateTest, isPending: isUpdating } = useUpdateTest();

  const isActive = watch("is_active");

  useEffect(() => {
    if (isOpen) {
      reset({
        test_code: defaultValues?.test_code || "",
        test_name: defaultValues?.test_name || "",
        test_type: defaultValues?.test_type || "",
        description: defaultValues?.description || "",
        department_id: Number(
          defaultValues?.department_id || preselectedDepartmentId || 0,
        ),
        is_active: defaultValues?.is_active ?? true,
      });
    }
  }, [isOpen, defaultValues, preselectedDepartmentId, reset]);

  const onSubmit = async (data: TestFormValues) => {
    try {
      const payload = {
        ...data,
        department_id: Number(data.department_id),
      };
      if (isEdit) {
        await updateTest({ id: defaultValues!.test_id, payload });
        addToast("Test updated successfully", "success");
      } else {
        await createTest(payload);
        addToast("Test created successfully", "success");
      }
      onClose();
    } catch (error: any) {
      addToast(
        error?.response?.data?.message || "Failed to save Test",
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
              {isEdit ? "Edit Test" : "Add Medical Test"}
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
                  Adding to{" "}
                  {
                    departments.find(
                      (d) => d.department_id === preselectedDepartmentId,
                    )?.department_name
                  }
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Test Code <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("test_code")}
                  onChange={(e) =>
                    setValue("test_code", e.target.value.toUpperCase())
                  }
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm font-mono focus:ring-1 focus:ring-primary outline-none uppercase placeholder:normal-case"
                  placeholder="CBC"
                />
                {errors.test_code && (
                  <span className="text-xs text-destructive">
                    {errors.test_code.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Department</label>
                <select
                  {...register("department_id", { valueAsNumber: true })}
                  disabled={isDepartmentLocked}
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
                Test Name <span className="text-destructive">*</span>
              </label>
              <input
                {...register("test_name")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
                placeholder="e.g. Complete Blood Count"
              />
              {errors.test_name && (
                <span className="text-xs text-destructive">
                  {errors.test_name.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Test Category <span className="text-destructive">*</span>
              </label>
              <select
                {...register("test_type")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="">Select Type...</option>
                <option value="Blood Test">Blood Test</option>
                <option value="Urine Test">Urine Test</option>
                <option value="Imaging">Imaging</option>
                <option value="Cardiac Test">Cardiac Test</option>
                <option value="Neurological Test">Neurological Test</option>
                <option value="Microbiology">Microbiology</option>
                <option value="Pathology">Pathology</option>
                <option value="Genetic Test">Genetic Test</option>
                <option value="Other">Other</option>
              </select>
              {errors.test_type && (
                <span className="text-xs text-destructive">
                  {errors.test_type.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <textarea
                {...register("description")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none min-h-[80px] resize-none"
                placeholder="Clinical details..."
              />
            </div>

            {/* Active Switch */}
            <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-foreground">
                  Operational Status
                </label>
                <p className="text-xs text-muted-foreground">
                  Is this test available for ordering?
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
                {isCreating || isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEdit ? "Save Changes" : "Create Test"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
