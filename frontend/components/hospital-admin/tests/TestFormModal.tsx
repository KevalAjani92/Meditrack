"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, PlusCircle, Settings2, IndianRupee } from "lucide-react";
import { MedicalTest, HospitalTest } from "@/types/medical-test";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  isActive: z.boolean(),
  price: z.coerce.number().min(0, "Price must be at least 0"),
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
  test: MedicalTest | HospitalTest | null;
  mode: "add" | "edit";
  onSave: (
    testId: number,
    hospitalTestId: number,
    isActive: boolean,
    price: number,
  ) => void;
}

export default function TestFormModal({
  isOpen,
  onClose,
  test,
  mode,
  onSave,
}: Props) {
  const isAdd = mode === "add";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { isActive: true, price: 0 },
  });

  useEffect(() => {
    if (isOpen && test) {
      reset({
        isActive: isAdd ? true : (test as HospitalTest).isActive,
        price: isAdd ? 0 : (test as HospitalTest).price || 0,
      });
    }
  }, [isOpen, test, isAdd, reset]);

  if (!test) return null;

  const onSubmit = (data: { isActive: boolean; price: number }) => {
    onSave(
      test.test_id,
      (test as HospitalTest).hospital_test_id,
      data.isActive,
      data.price,
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
              {isAdd ? "Enable Diagnostic Test" : "Manage Test Settings"}
            </Dialog.Title>
            <button
              type="button"
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
                  Test Details
                </p>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-[10px]">
                    {test.test_type}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {test.department_name}
                  </Badge>
                </div>
              </div>
              <h3 className="font-bold text-foreground text-lg leading-tight">
                {test.test_name}
              </h3>
              <p className="text-sm font-mono text-primary font-semibold mt-0.5">
                {test.test_code}
              </p>
              {isAdd && (
                <p className="text-sm mt-3 text-muted-foreground border-t border-border/50 pt-2">
                  {test.description}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground flex items-center gap-1">
                  Hospital Price <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    step="0.01"
                    {...register("price")}
                    className="w-full pl-9 pr-4 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary outline-none transition-shadow"
                    placeholder="Enter price..."
                  />
                </div>
                {errors.price && (
                  <p className="text-xs text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div
                className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${isAdd ? "bg-card border-border" : (test as HospitalTest).isActive ? "border-success/30 bg-success/5" : "border-border bg-card"}`}
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
                      ? "Test will be available for doctor prescriptions."
                      : "Uncheck to disable in this hospital."}
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
                  {isAdd ? "Enable Test" : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
