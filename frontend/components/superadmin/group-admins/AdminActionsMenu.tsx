"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Lock,
  Ban,
  CheckCircle2,
  Building,
} from "lucide-react";
import { GroupAdmin } from "@/types/admin";

interface AdminActionsMenuProps {
  admin: GroupAdmin;
  onEdit: () => void;
  onAssign: () => void;
}

export default function AdminActionsMenu({
  admin,
  onEdit,
  onAssign,
}: AdminActionsMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[180px] bg-popover rounded-lg border border-border shadow-lg p-1 z-50"
          align="end"
        >
          <DropdownMenu.Item
            onClick={onEdit}
            className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md cursor-pointer hover:bg-accent"
          >
            <Edit className="w-4 h-4" />
            Edit Details
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={onAssign}
            className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md cursor-pointer hover:bg-accent"
          >
            <Building className="w-4 h-4" />
            {admin.hospital_group_id
              ? "Reassign Group"
              : "Assign Group"}
          </DropdownMenu.Item>

          <DropdownMenu.Item className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md cursor-pointer hover:bg-accent">
            <Lock className="w-4 h-4" />
            Reset Password
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-border my-1" />

          <DropdownMenu.Item
            className={`flex items-center gap-2 px-2.5 py-2 text-sm rounded-md cursor-pointer ${
              admin.is_active
                ? "text-destructive"
                : "text-success"
            }`}
          >
            {admin.is_active ? (
              <Ban className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            {admin.is_active ? "Deactivate" : "Activate"}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}