"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Mail, Phone, Calendar, Edit, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Receptionist } from "@/types/receptionist";

interface ReceptionistDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  receptionist?: Receptionist;
  onEdit: () => void;
  onResetPassword: () => void;
}

export default function ReceptionistDetailModal({ isOpen, onClose, receptionist, onEdit, onResetPassword }: ReceptionistDetailModalProps) {
  if (!receptionist) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-0 shadow-lg border border-border animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-6 border-b border-border bg-muted/10 flex items-start justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-bold text-primary">
                {receptionist.avatar_initials}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{receptionist.name}</h2>
                <Badge variant={receptionist.status === "Active" ? "default" : "secondary"} className="mt-1 h-5 text-[10px]">
                  {receptionist.status}
                </Badge>
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-6 space-y-5">
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Email</p>
                  <p className="text-sm font-medium text-foreground">{receptionist.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Phone</p>
                  <p className="text-sm font-medium text-foreground font-mono">{receptionist.phone}</p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
               <div className="flex items-center gap-2 text-xs text-muted-foreground">
                 <Calendar className="w-4 h-4" /> Joined: {receptionist.joined_date}
               </div>
               <div className="flex items-center gap-2 text-xs text-muted-foreground">
                 <Shield className="w-4 h-4" /> Role: Receptionist
               </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 border-t border-border flex justify-between gap-3">
            <Button variant="outline" className="text-xs h-9" onClick={onResetPassword}>
               <Lock className="w-3 h-3 mr-1" /> Reset Password
            </Button>
            <div className="flex gap-2">
                <Button variant="ghost" onClick={onClose}>Close</Button>
                <Button onClick={onEdit} className="gap-2">
                <Edit className="w-4 h-4" /> Edit Profile
                </Button>
            </div>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}