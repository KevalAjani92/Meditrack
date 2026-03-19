"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, CheckCircle2, Building, UserMinus } from "lucide-react"; // Added UserMinus icon
import { Button } from "@/components/ui/button";
import { HospitalGroup } from "@/types/groups";
import { useAllGroupAdmins } from "@/hooks/group-admins/useGroupAdmins";
import Image from "next/image";
import { useAssignGroupAdmin } from "@/hooks/groups/useAssignGroupAdmin";
import { useToast } from "@/components/ui/toast";

interface AssignAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  group?: HospitalGroup;
}

export default function AssignGroupAdminModal({
  isOpen,
  onClose,
  group,
}: AssignAdminModalProps) {
  // Use number | null to allow "Unassigned" state
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);
  const { mutateAsync: assignAdmin, isPending } = useAssignGroupAdmin();

  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen && group) {
      setSelectedAdminId(group.admin_id || null);
    }
  }, [isOpen, group]);

  const { data: admins, isLoading } = useAllGroupAdmins();

  if (!group) return null;

  const currentAdmin = admins?.find(
    (a) => a.hospital_group_id === group.group_id,
  );

  const unassignedAdmins = admins?.filter((a) => !a.hospital_group_id) || [];

  const otherAdmins =
    admins?.filter(
      (a) => a.hospital_group_id && a.hospital_group_id !== group.group_id,
    ) || [];

  const handleSave = async () => {
    try {
      await assignAdmin({
        groupId: group.group_id,
        adminId: selectedAdminId, // can be null
      });

      if (selectedAdminId === null) {
        addToast("Admin unassigned successfully", "success");
      } else {
        addToast("Admin assigned successfully", "success");
      }

      onClose();
    } catch (error: any) {
      addToast(
        error?.response?.data?.message || "Failed to update assignment",
        "error",
      );
    }
  };

  // Logic for button state
  const hasChanged = selectedAdminId !== (group.admin_id || null);
  const isUnassigning = selectedAdminId === null && group.admin_id !== null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-0 shadow-lg border border-border animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
          <div className="p-6 border-b border-border bg-muted/10">
            <div className="flex justify-between items-start">
              <div>
                <Dialog.Title className="text-lg font-semibold text-foreground">
                  Assign Group Admin
                </Dialog.Title>
                <Dialog.Description className="text-sm text-muted-foreground mt-1">
                  Managing admin for{" "}
                  <span className="font-medium text-foreground">
                    {group.group_name}
                  </span>
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          <div className="overflow-y-auto p-6 space-y-6">
            {/* 0. Option to Unassign (Deselct Current) */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Management Actions
              </h4>
              <div
                onClick={() => setSelectedAdminId(null)}
                className={`flex items-center justify-between p-3 rounded-lg border border-dashed cursor-pointer transition-all ${
                  selectedAdminId === null
                    ? "bg-destructive/5 border-destructive text-destructive"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border ${selectedAdminId === null ? "bg-destructive/10 border-destructive" : "bg-muted"}`}
                  >
                    <UserMinus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Leave Unassigned</p>
                    <p className="text-xs opacity-80">
                      No admin will be responsible for this group
                    </p>
                  </div>
                </div>
                {selectedAdminId === null && (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </div>
            </div>

            {/* 1. Currently Assigned */}
            {currentAdmin && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Currently Assigned
                </h4>
                <AdminCard
                  admin={currentAdmin}
                  isSelected={selectedAdminId === currentAdmin.user_id}
                  onClick={() => setSelectedAdminId(currentAdmin.user_id)}
                  isCurrent={true}
                />
              </div>
            )}

            {/* 2. Available Admins */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Available (Unassigned)
              </h4>
              <div className="space-y-2">
                {unassignedAdmins.length > 0 ? (
                  unassignedAdmins.map((admin) => (
                    <AdminCard
                      key={admin.user_id}
                      admin={admin}
                      isSelected={selectedAdminId === admin.user_id}
                      onClick={() => setSelectedAdminId(admin.user_id)}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic pl-1">
                    No unassigned admins available.
                  </p>
                )}
              </div>
            </div>

            {/* 3. Reassign from Others */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Reassign (Currently at other hospitals)
              </h4>
              <div className="space-y-2">
                {otherAdmins.map((admin) => (
                  <AdminCard
                    key={admin.user_id}
                    admin={admin}
                    isSelected={selectedAdminId === admin.user_id}
                    onClick={() => setSelectedAdminId(admin.user_id)}
                    showHospitalContext={true}
                    isPending={isPending}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanged || isPending}
              variant={isUnassigning ? "destructive" : "default"}
            >
              {isPending ? "Saving..." : isUnassigning ? "Save as Unassigned" : "Save Assignment"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function AdminCard({
  admin,
  isSelected,
  onClick,
  isCurrent,
  isPending,
  showHospitalContext,
}: any) {
  return (
    <div
      onClick={onClick}
      className={`relative p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
        isPending ? "pointer-events-none opacity-70" : ""
      } ${
        isSelected
          ? "bg-primary/5 border-primary shadow-sm"
          : "bg-card border-border hover:border-primary/30 hover:bg-muted/10"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-border">
          <Image
            src={admin.profile_image_url || "/avatar_1.png"}
            alt={admin.full_name}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p
            className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}
          >
            {admin.full_name}
          </p>
          <p className="text-xs text-muted-foreground">{admin.email}</p>
          {showHospitalContext && (
            <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded w-fit">
              <Building className="w-3 h-3" />
              Currently at: {admin.group_name}
            </div>
          )}
        </div>
      </div>

      {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
      {isCurrent && !isSelected && (
        <span className="text-[10px] font-bold uppercase text-muted-foreground bg-muted px-2 py-1 rounded">
          Current
        </span>
      )}
    </div>
  );
}
