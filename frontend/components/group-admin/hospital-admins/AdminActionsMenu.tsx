"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, Edit, Building, Lock, Power, Eye, Loader2 } from "lucide-react";
import { HospitalAdmin } from "@/types/hospital-admin";
import { useToggleHospitalAdminStatus } from "@/hooks/hospital-admins/useHospitalAdmins";
import { useToast } from "@/components/ui/toast";

interface AdminActionsMenuProps {
  admin: HospitalAdmin;
  onView: () => void;
  onEdit: () => void;
  onAssign: () => void;
}

export default function AdminActionsMenu({ admin, onView, onEdit, onAssign }: AdminActionsMenuProps) {
  const { addToast } = useToast();
  const { mutate: toggleStatus, isPending } =
    useToggleHospitalAdminStatus();

  const handleToggle = async () => {
    try {
      await toggleStatus(admin.user_id);
      addToast("Status updated successfully", "success");
    } catch (error:any) {
      addToast(
        error?.response?.data?.message || "Failed to update status",
        "error"
      );
    }
  };
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors outline-none focus:ring-2 focus:ring-primary/20">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[180px] bg-popover text-popover-foreground rounded-lg border border-border shadow-lg p-1 z-50 animate-in fade-in zoom-in-95 duration-100"
          align="end"
          sideOffset={5}
        >
          <DropdownMenu.Item onClick={onView} className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <Eye className="w-4 h-4" /> View Details
          </DropdownMenu.Item>

          <DropdownMenu.Item onClick={onEdit} className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <Edit className="w-4 h-4" /> Edit Profile
          </DropdownMenu.Item>
          
          <DropdownMenu.Item onClick={onAssign} className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <Building className="w-4 h-4" /> 
            {admin.hospital_id ? "Reassign Hospital" : "Assign Hospital"}
          </DropdownMenu.Item>

          <DropdownMenu.Item className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <Lock className="w-4 h-4" /> Reset Password
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-border my-1" />

          <DropdownMenu.Item 
          onClick={handleToggle}
            disabled={isPending}
            className={`flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-muted ${
              admin.is_active ? "text-destructive hover:text-destructive" : "text-success hover:text-success"
            }`}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Power className="w-4 h-4" />
            )}
            {admin.is_active ? "Deactivate" : "Activate"}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}