"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, Edit, Power, UserPlus, Eye } from "lucide-react";
import { Hospital } from "@/types/hospital";

interface HospitalActionsMenuProps {
  hospital: Hospital;
  onEdit: () => void;
  onAssignAdmin: () => void;
}

export default function HospitalActionsMenu({ hospital, onEdit, onAssignAdmin }: HospitalActionsMenuProps) {
  const handleViewDetails = (hos: Hospital) => {
    console.log("View Details clicked for hospital:", hos.hospital_id);
  }

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
          <DropdownMenu.Item onClick={() => handleViewDetails(hospital)} className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <Eye className="w-4 h-4" /> View Details
          </DropdownMenu.Item>

          <DropdownMenu.Item onClick={onEdit} className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <Edit className="w-4 h-4" /> Edit Details
          </DropdownMenu.Item>
          
          <DropdownMenu.Item onClick={onAssignAdmin} className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <UserPlus className="w-4 h-4" /> Assign Admin
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-border my-1" />

          <DropdownMenu.Item 
            className={`flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-muted ${
              hospital.is_active ? "text-destructive hover:text-destructive" : "text-success hover:text-success"
            }`}
          >
            <Power className="w-4 h-4" />
            {hospital.is_active ? "Deactivate" : "Activate"}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}