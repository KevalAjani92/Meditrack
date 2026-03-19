"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, ActivitySquare, PlusCircle, Settings2 } from "lucide-react";
import { Diagnosis, HospitalDiagnosis } from "@/types/diagnosis";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  isActive: z.boolean(),
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
  diagnosis: Diagnosis | HospitalDiagnosis | null;
  mode: "add" | "edit";
  onSave: (
    diagId: string,
    hospitalDiagnosisId: number,
    isActive: boolean,
  ) => void;
}

export default function DiagnosisFormModal({
  isOpen,
  onClose,
  diagnosis,
  mode,
  onSave,
}: Props) {
  const isAdd = mode === "add";

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { isActive: true },
  });

  useEffect(() => {
    if (isOpen && diagnosis) {
      reset({
        isActive: isAdd ? true : (diagnosis as HospitalDiagnosis).isActive,
      });
    }
  }, [isOpen, diagnosis, isAdd, reset]);

  if (!diagnosis) return null;

  const onSubmit = (data: { isActive: boolean }) => {
    onSave(
      diagnosis.diagnosis_id.toString(),
      (diagnosis as HospitalDiagnosis).hospital_diagnosis_id,
      data.isActive,
    );
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-6 shadow-xl border border-border animate-in zoom-in-95">
          <div className="flex justify-between items-center mb-5 border-b border-border pb-3">
            <Dialog.Title className="text-lg font-bold flex items-center gap-2">
              {isAdd ? (
                <PlusCircle className="w-5 h-5 text-primary" />
              ) : (
                <Settings2 className="w-5 h-5 text-primary" />
              )}
              {isAdd ? "Enable Diagnosis" : "Manage Diagnosis"}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            <div
              className={`p-4 rounded-lg border border-border ${isAdd ? "bg-muted/10" : "bg-muted/30 opacity-80"}`}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Diagnosis Details
                </p>
                <Badge variant="secondary" className="text-[10px]">
                  {diagnosis.department_name}
                </Badge>
              </div>
              <h3 className="font-bold text-foreground text-lg leading-tight">
                {diagnosis.diagnosis_name}
              </h3>
              <p className="text-sm font-mono text-primary font-semibold mt-0.5">
                {diagnosis.diagnosis_code}
              </p>
              {isAdd && (
                <p className="text-sm mt-3 text-muted-foreground border-t border-border/50 pt-2">
                  {diagnosis.description}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div
                className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${isAdd ? "bg-card border-border" : (diagnosis as HospitalDiagnosis).isActive ? "border-success/30 bg-success/5" : "border-border bg-card"}`}
              >
                <div>
                  <label
                    className="text-sm font-bold text-foreground cursor-pointer"
                    htmlFor="isActiveToggle"
                  >
                    {isAdd ? "Set Active Immediately" : "Active Status"}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {isAdd
                      ? "Diagnosis will be visible to doctors."
                      : "Uncheck to disable for doctors."}
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  {...register("isActive")}
                  className="w-5 h-5 accent-primary cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isAdd ? "Enable Diagnosis" : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
