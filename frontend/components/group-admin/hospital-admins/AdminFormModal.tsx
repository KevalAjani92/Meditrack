"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { HospitalAdmin, mockHospitals } from "@/types/hospital-admin";
import { useToast } from "@/components/ui/toast";
import {
  useCreateHospitalAdmin,
  useUpdateHospitalAdmin,
} from "@/hooks/hospital-admins/useHospitalAdmins";

const adminSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(8),
  hospital_id: z.number().nullable().optional(),
  is_active: z.boolean().optional(),
});

type AdminFormValues = z.infer<typeof adminSchema>;

interface AdminFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: HospitalAdmin;
}

export default function AdminFormModal({
  isOpen,
  onClose,
  defaultValues,
}: AdminFormModalProps) {
  const isEdit = !!defaultValues;
  const { addToast } = useToast();

  // Filter available hospitals (Open ones + the one currently assigned to this admin)
  const availableHospitals = mockHospitals.filter(
    (h) =>
      !h.current_admin_id ||
      (isEdit && h.id === defaultValues.hospital_id?.toString()),
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      is_active: true,
      hospital_id: null,
    },
  });
  const { mutateAsync: createAdmin, isPending: isCreating } =
    useCreateHospitalAdmin();

  const { mutateAsync: updateAdmin, isPending: isUpdating } =
    useUpdateHospitalAdmin();

  const isLoading = isCreating || isUpdating;
  const isActive = watch("is_active");

  useEffect(() => {
    if (isOpen) {
      reset({
        full_name: defaultValues?.full_name || "",
        email: defaultValues?.email || "",
        phone_number: defaultValues?.phone_number || "",
        hospital_id: defaultValues?.hospital_id ?? null,
        is_active: defaultValues?.is_active ?? true,
      });
    }
  }, [isOpen, defaultValues, reset]);

  const onSubmit = async (data: AdminFormValues) => {
    try {
      if (isEdit) {
        await updateAdmin({
          userId: defaultValues!.user_id,
          payload: data,
        });
        addToast("Admin updated successfully", "success");
      } else {
        await createAdmin(data);
        addToast("Admin created successfully", "success");
      }
      onClose();
    } catch (error:any) {
      addToast(
        error?.response?.data?.message || "Something went wrong",
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
              {isEdit ? "Edit Admin Profile" : "Register New Admin"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Full Name</label>
              <input
                {...register("full_name")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
                placeholder="Dr. John Doe"
              />
              {errors.full_name && (
                <span className="text-xs text-destructive">
                  {errors.full_name.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email Address</label>
              <input
                {...register("email")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
                placeholder="admin@hospital.com"
              />
              {errors.email && (
                <span className="text-xs text-destructive">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Phone Number</label>
              <input
                {...register("phone_number")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone_number && (
                <span className="text-xs text-destructive">
                  {errors.phone_number.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Assign Hospital (Optional)
              </label>
              <select
                {...register("hospital_id")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="">Leave Unassigned</option>
                {availableHospitals.map((h) => (
                  <option key={h.id} value={Number(h.id)}>
                    {h.name} - {h.location}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-muted-foreground">
                Only hospitals without an active admin are shown.
              </p>
              {errors.hospital_id && (
                <span className="text-xs text-destructive">
                  {errors.hospital_id.message}
                </span>
              )}
            </div>

            {/* Status Toggle Switch */}
            <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Active Status</label>
                <p className="text-xs text-muted-foreground">
                  Enable or disable this admin account
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("is_active")}
                  className="sr-only peer"
                />
                <div
                  className={`w-11 h-6 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/20 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white ${isActive ? "bg-primary" : "bg-gray-300"}`}
                ></div>
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEdit ? "Save Changes" : "Create Admin"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
