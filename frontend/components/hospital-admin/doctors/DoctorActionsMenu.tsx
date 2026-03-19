"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, Edit, Power, Lock, Eye } from "lucide-react";
import { Doctor } from "@/types/doctor";

interface DoctorActionsMenuProps {
  doctor: Doctor;
  onEdit: () => void;
  onView: () => void;
  onToggleStatus: () => void;
  onResetPassword: () => void;
}

export default function DoctorActionsMenu({ doctor, onEdit, onView, onToggleStatus, onResetPassword }: DoctorActionsMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors outline-none focus:ring-2 focus:ring-primary/20">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[160px] bg-popover text-popover-foreground rounded-lg border border-border shadow-lg p-1 z-50 animate-in fade-in zoom-in-95 duration-100"
          align="end"
          sideOffset={5}
        >
          <DropdownMenu.Item onClick={onView} className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <Eye className="w-4 h-4" /> View Details
          </DropdownMenu.Item>

          <DropdownMenu.Item onClick={onEdit} className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <Edit className="w-4 h-4" /> Edit Profile
          </DropdownMenu.Item>
          
          <DropdownMenu.Item onClick={onResetPassword} className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <Lock className="w-4 h-4" /> Reset Password
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-border my-1" />

          <DropdownMenu.Item 
            onClick={onToggleStatus}
            className={`flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-muted ${
              doctor.status === "Active" ? "text-destructive hover:text-destructive" : "text-success hover:text-success"
            }`}
          >
            <Power className="w-4 h-4" />
            {doctor.status === "Active" ? "Deactivate" : "Activate"}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}