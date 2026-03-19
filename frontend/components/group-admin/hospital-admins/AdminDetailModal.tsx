"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Building2, Mail, Calendar, Edit, ShieldCheck, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HospitalAdmin } from "@/types/hospital-admin";
import Image from "next/image";

interface AdminDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin?: HospitalAdmin;
  onEdit: () => void;
}

export default function AdminDetailModal({
  isOpen,
  onClose,
  admin,
  onEdit,
}: AdminDetailModalProps) {
  if (!admin) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-0 shadow-lg border border-border animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-6 border-b border-border bg-muted/10 flex items-start justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden flex items-center justify-center border border-border shrink-0">
                <Image
                  src={admin.profile_image_url || "/avatar_1.png"}
                  alt={admin.full_name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {admin.full_name}
                </h2>
                <Badge
                  variant={admin.is_active ? "default" : "secondary"}
                  className="mt-1 h-5 text-[10px]"
                >
                  {admin.is_active ? "Active":"InActive"}
                </Badge>
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-6 space-y-6">
            {/* Info Grid */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Assigned Hospital
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {admin.hospital_name || "Unassigned"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Email Address
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {admin.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Phone Number
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    +91 {admin.phone_number}
                  </p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-4 h-4" /> Joined: {new Date(admin.joined_date).toLocaleString("en-IN")}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4" /> Role: Hospital Admin
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 border-t border-border flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onEdit} className="gap-2">
              <Edit className="w-4 h-4" /> Edit Profile
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
