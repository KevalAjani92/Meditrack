"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HospitalGroup } from "@/types/groups";
import { useToast } from "@/components/ui/toast";
import { groupSchema } from "@/schemas/groupSchema";
import { useUpdateGroup } from "@/hooks/groups/useUpdateGroup";
import { useCreateGroup } from "@/hooks/groups/useCreateGroup";

type GroupFormValues = z.infer<typeof groupSchema>;

interface GroupFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  defaultValues?: HospitalGroup;
  onSuccess?: () => void;
}

export default function GroupFormModal({
  isOpen,
  onClose,
  mode,
  defaultValues,
  onSuccess,
}: GroupFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
  });

  const { addToast } = useToast();

  const { mutateAsync: createGroup, isPending: isCreating } = useCreateGroup();

  const { mutateAsync: updateGroup, isPending: isUpdating } = useUpdateGroup();

  const isLoading = isCreating || isUpdating;

  // Reset form when modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      reset({
        group_name: defaultValues?.group_name || "",
        group_code: defaultValues?.group_code || "",
        registration_no: defaultValues?.registration_no || "",
        contact_phone: defaultValues?.contact_phone || "",
        contact_email: defaultValues?.contact_email || "",
        description: defaultValues?.description || "",
      });
    }
  }, [isOpen, defaultValues, reset]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: GroupFormValues): Promise<void> => {
    try {
      if (mode === "create") {
        await createGroup(data);
        addToast("Hospital group created successfully", "success");
      } else {
        await updateGroup({
          id: defaultValues!.group_id,
          payload: data,
        });
        addToast("Hospital group updated successfully", "success");
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
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) {
          onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-6 shadow-lg border border-border animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-lg font-semibold text-foreground">
              {mode === "create"
                ? "Create Hospital Group"
                : "Edit Hospital Group"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Row 1: Name & Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Group Name <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("group_name")}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  placeholder="e.g. Apex Healthcare"
                />
                {errors.group_name && (
                  <span className="text-xs text-destructive">
                    {errors.group_name.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Group Code <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("group_code")}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  placeholder="e.g. APEX-01"
                />
                {errors.group_code && (
                  <span className="text-xs text-destructive">
                    {errors.group_code.message}
                  </span>
                )}
              </div>
            </div>

            {/* Row 2: Reg No & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Registration No.
                </label>
                <input
                  {...register("registration_no")}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  placeholder="Optional"
                />
                {errors.registration_no && (
                  <span className="text-xs text-destructive">
                    {errors.registration_no.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Contact Phone
                </label>
                <input
                  {...register("contact_phone")}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  placeholder="Optional"
                />
                {errors.contact_phone && (
                  <span className="text-xs text-destructive">
                    {errors.contact_phone.message}
                  </span>
                )}
              </div>
            </div>

            {/* Contact Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Contact Email
              </label>
              <input
                type="email"
                {...register("contact_email")}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                placeholder="Optional"
              />
              {errors.contact_email && (
                <span className="text-xs text-destructive">
                  {errors.contact_email.message}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none"
                placeholder="Brief description (optional)..."
              />
              {errors.description && (
                <span className="text-xs text-destructive">
                  {errors.description.message}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-2 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === "create" ? "Create Group" : "Save Changes"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
