"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, CheckCircle2, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hospital, mockAdmins, HospitalAdmin } from "@/types/hospital";

interface AssignAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospital?: Hospital;
}

export default function AssignAdminModal({ isOpen, onClose, hospital }: AssignAdminModalProps) {
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(hospital?.admin_id || null);

  if (!hospital) return null;

  // Separate admins into categories
  const currentAdmin = mockAdmins.find(a => a.id === hospital.admin_id);
  const unassignedAdmins = mockAdmins.filter(a => !a.assigned_hospital_id);
  const otherAdmins = mockAdmins.filter(a => a.assigned_hospital_id && a.id !== hospital.admin_id);

  const handleSave = () => {
    console.log(`Assigning Admin ${selectedAdminId} to Hospital ${hospital.hospital_id}`);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-0 shadow-lg border border-border animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
          
          <div className="p-6 border-b border-border bg-muted/10">
            <div className="flex justify-between items-start">
              <div>
                <Dialog.Title className="text-lg font-semibold text-foreground">
                  Assign Hospital Admin
                </Dialog.Title>
                <Dialog.Description className="text-sm text-muted-foreground mt-1">
                  Managing admin for <span className="font-medium text-foreground">{hospital.hospital_name}</span>
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
            
            {/* 1. Currently Assigned */}
            {currentAdmin && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Currently Assigned</h4>
                <AdminCard 
                  admin={currentAdmin} 
                  isSelected={selectedAdminId === currentAdmin.id} 
                  onClick={() => setSelectedAdminId(currentAdmin.id)}
                  isCurrent={true}
                />
              </div>
            )}

            {/* 2. Available Admins */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available (Unassigned)</h4>
              <div className="space-y-2">
                {unassignedAdmins.length > 0 ? unassignedAdmins.map(admin => (
                  <AdminCard 
                    key={admin.id}
                    admin={admin} 
                    isSelected={selectedAdminId === admin.id} 
                    onClick={() => setSelectedAdminId(admin.id)}
                  />
                )) : (
                  <p className="text-sm text-muted-foreground italic pl-1">No unassigned admins available.</p>
                )}
              </div>
            </div>

            {/* 3. Reassign from Others */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reassign (Currently at other hospitals)</h4>
              <div className="space-y-2">
                {otherAdmins.map(admin => (
                  <AdminCard 
                    key={admin.id}
                    admin={admin} 
                    isSelected={selectedAdminId === admin.id} 
                    onClick={() => setSelectedAdminId(admin.id)}
                    showHospitalContext={true}
                  />
                ))}
              </div>
            </div>

          </div>

          <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-3">
             <Button variant="ghost" onClick={onClose}>Cancel</Button>
             <Button onClick={handleSave} disabled={selectedAdminId === hospital.admin_id}>
               Save Assignment
             </Button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Sub-component for Admin Cards
function AdminCard({ admin, isSelected, onClick, isCurrent, showHospitalContext }: any) {
  return (
    <div 
      onClick={onClick}
      className={`relative p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
        isSelected 
          ? "bg-primary/5 border-primary shadow-sm" 
          : "bg-card border-border hover:border-primary/30 hover:bg-muted/10"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border ${
           isSelected ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border"
        }`}>
          {admin.avatar_initials}
        </div>
        <div>
          <p className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>{admin.name}</p>
          <p className="text-xs text-muted-foreground">{admin.email}</p>
          {showHospitalContext && (
             <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded w-fit">
                <Building className="w-3 h-3" />
                Currently at: {admin.assigned_hospital_name}
             </div>
          )}
        </div>
      </div>
      
      {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
      {isCurrent && !isSelected && <span className="text-xs text-muted-foreground">Current</span>}
    </div>
  );
}