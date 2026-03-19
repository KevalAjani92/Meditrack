"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Loader2, Scissors } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Procedure } from "@/types/procedure";
import { useUpdateProcedure } from "@/hooks/procedure/useUpdateProcedure";
import { useCreateProcedure } from "@/hooks/procedure/useCreateProcedure";
import { useToast } from "@/components/ui/toast";

const procedureSchema = z.object({
  procedure_code: z.string().min(2).max(15),
  procedure_name: z.string().min(3),
  description: z.string().optional(),
  is_surgical: z.boolean(),
  is_active: z.boolean(),
});

type ProcedureFormValues = z.infer<typeof procedureSchema>;

interface ProcedureFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Procedure;
  treatmentTypeId: number;
}

export default function ProcedureFormModal({
  isOpen,
  onClose,
  defaultValues,
  treatmentTypeId,
}: ProcedureFormModalProps) {
  const isEdit = !!defaultValues;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProcedureFormValues>({
    resolver: zodResolver(procedureSchema),
    defaultValues: {
      is_active: true,
      is_surgical: false,
    },
  });

  const { addToast } = useToast();

  const { mutateAsync: createProcedure, isPending: isCreating } =
    useCreateProcedure();

  const { mutateAsync: updateProcedure, isPending: isUpdating } =
    useUpdateProcedure();

  const isLoading = isCreating || isUpdating;

  const isSurgical = watch("is_surgical");
  const isActive = watch("is_active");

  useEffect(() => {
    if (isOpen) {
      reset({
        procedure_code: defaultValues?.procedure_code || "",
        procedure_name: defaultValues?.procedure_name || "",
        description: defaultValues?.description || "",
        is_surgical: defaultValues?.is_surgical ?? false,
        is_active: defaultValues?.is_active ?? true,
      });
    }
  }, [isOpen, defaultValues, reset]);

  const onSubmit = async (data: ProcedureFormValues) => {
    try {
      const payload = {
        ...data,
        treatment_type_id: treatmentTypeId,
      };
      
      if (isEdit) {
        await updateProcedure({
          id: defaultValues!.procedure_id,
          payload: data,
        });
        addToast("Procedure updated successfully", "success");
      } else {
        await createProcedure({
          treatmentId: treatmentTypeId,
          payload: payload,
        });
        addToast("Procedure created successfully", "success");
      }

      onClose();
    } catch (err : any) {
      addToast(
        err?.response?.data?.message ||
          `Failed to ${isEdit ? "update" : "create"} procedure`,
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
              {isEdit ? "Edit Procedure" : "Add Procedure"}
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
                Procedure Code <span className="text-destructive">*</span>
              </label>
              <input
                {...register("procedure_code")}
                onChange={(e) =>
                  setValue("procedure_code", e.target.value.toUpperCase())
                }
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm font-mono focus:ring-1 focus:ring-primary outline-none uppercase placeholder:normal-case"
                placeholder="THR-101"
              />
              {errors.procedure_code && (
                <span className="text-xs text-destructive">
                  {errors.procedure_code.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Procedure Name <span className="text-destructive">*</span>
              </label>
              <input
                {...register("procedure_name")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
                placeholder="e.g. Pre-op Assessment"
              />
              {errors.procedure_name && (
                <span className="text-xs text-destructive">
                  {errors.procedure_name.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <textarea
                {...register("description")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none min-h-[80px] resize-none"
                placeholder="Details about this procedure step..."
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-4">
              {/* Surgical Toggle */}
              <div
                className={`flex flex-col gap-2 p-3 border rounded-lg transition-colors ${isSurgical ? "bg-destructive/5 border-destructive/20" : "bg-muted/20 border-border"}`}
              >
                <div className="flex items-center gap-2">
                  <Scissors
                    className={`w-4 h-4 ${isSurgical ? "text-destructive" : "text-muted-foreground"}`}
                  />
                  <span className="text-sm font-medium">Surgical?</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("is_surgical")}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-destructive"></div>
                </label>
              </div>

              {/* Active Toggle */}
              <div className="flex flex-col gap-2 p-3 border border-border rounded-lg bg-muted/20">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Is Active?</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("is_active")}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-success"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEdit ? "Save Procedure" : "Add Procedure"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
