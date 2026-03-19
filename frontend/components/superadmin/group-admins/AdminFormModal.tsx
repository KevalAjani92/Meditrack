"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { GroupAdmin } from "@/types/admin";
import { groupAdminSchema } from "@/schemas/groupAdminSchema";
import { useCreateGroupAdmin } from "@/hooks/group-admins/useCreateGroupAdmin";
import { useUpdateGroupAdmin } from "@/hooks/group-admins/useUpdateGroupAdmin";
import { useToast } from "@/components/ui/toast";

type AdminFormValues = z.infer<typeof groupAdminSchema>;

interface AdminFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: GroupAdmin;
}

export default function AdminFormModal({
  isOpen,
  onClose,
  defaultValues,
}: AdminFormModalProps) {
  const isEdit = !!defaultValues;
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AdminFormValues>({
    resolver: zodResolver(groupAdminSchema),
    defaultValues: {
      is_active: true,
      hospital_group_id: null,
    },
  });

  const { mutateAsync: createAdmin, isPending: isCreating } =
    useCreateGroupAdmin();

  const { mutateAsync: updateAdmin, isPending: isUpdating } =
    useUpdateGroupAdmin();

  const isLoading = isCreating || isUpdating;

  const isActive = watch("is_active");

  useEffect(() => {
    if (isOpen) {
      reset({
        full_name: defaultValues?.full_name || "",
        email: defaultValues?.email || "",
        phone_number: defaultValues?.phone_number || "",
        hospital_group_id: defaultValues?.hospital_group_id ?? null,
        is_active: defaultValues?.is_active ?? true,
      });
    }
  }, [isOpen, defaultValues, reset]);

  const onSubmit = async (data: AdminFormValues) => {
    try {
      const payload = {
        ...data,
        hospital_group_id:
          data.hospital_group_id === null
            ? null
            : Number(data.hospital_group_id),
      };

      if (isEdit) {
        await updateAdmin({
          userId: defaultValues!.user_id,
          payload,
        });
        addToast("Admin updated successfully", "success");
      } else {
        await createAdmin(payload);
        addToast("Admin created successfully", "success");
      }

      onClose();
    } catch (error: any) {
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
              {isEdit ? "Edit Group Admin" : "New Group Admin"}
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
                placeholder="e.g. Dr. Sarah Smith"
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
              <label className="text-sm font-medium">Assigned Group</label>
              <select
                {...register("hospital_group_id")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="">Select a Group...</option>
                <option value={1}>Apex Healthcare Systems</option>
                <option value={2}>City Care Alliance</option>
                <option value={3}>Green Valley Medical</option>
              </select>
              {errors.hospital_group_id && (
                <span className="text-xs text-destructive">
                  {errors.hospital_group_id.message}
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
