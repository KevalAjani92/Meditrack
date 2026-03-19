"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Building, CheckCircle2, AlertTriangle, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GroupAdmin, mockAdmins } from "@/types/admin";
import { mockGroups } from "@/types/groups";

interface AssignGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin?: GroupAdmin;
}

export default function AssignGroupModal({ isOpen, onClose, admin }: AssignGroupModalProps) {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(admin?.hospital_group_id || null);

  if (!admin) return null;

  // 1. Find the hospital currently assigned to THIS admin
  const currentHospital = mockGroups.find(h => h.id === admin.hospital_group_id);

  // 2. Filter Available (No admin assigned)
  const availableHospitals = mockGroups.filter(h => !h.admin_id);

  // 3. Filter Occupied (Assigned to SOMEONE ELSE)
  const occupiedHospitals = mockGroups.filter(h => h.admin_id && h.admin_id !== admin.user_id);

  const handleSave = () => {
    // Logic to update backend
    console.log(`Assigning Admin ${admin.user_id} to ${selectedHospitalId}`);
    onClose();
  };

  const isReassigningToOccupied = occupiedHospitals.some(h => h.id === selectedHospitalId);

  // Helper to find admin name based on ID in the group
  const getAdminName = (adminId: string) => {
    return mockAdmins.find((a) => a.user_id === adminId)?.full_name || "Unknown Admin";
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
                  Assign Group
                </Dialog.Title>
                <Dialog.Description className="text-sm text-muted-foreground mt-1">
                  Select a group for <span className="font-medium text-foreground">{admin.name}</span>
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
            
            {/* 1. Unassign Option */}
            <div 
              onClick={() => setSelectedHospitalId(null)}
              className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${selectedHospitalId === null ? "bg-blue-50 border-blue-200" : "hover:bg-muted"}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <X className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium">Unassigned (Bench)</span>
              </div>
              {selectedHospitalId === null && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
            </div>

            {/* 2. Current Assignment (NEW SECTION) */}
            {currentHospital && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> Current Assignment
                </h4>
                <HospitalCard 
                  hospital={currentHospital} 
                  isSelected={selectedHospitalId === currentHospital.id} 
                  onClick={() => setSelectedHospitalId(currentHospital.id)}
                  isCurrent
                />
              </div>
            )}

            {/* 3. Available Hospitals */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available Hospitals</h4>
              {availableHospitals.length > 0 ? availableHospitals.map(h => (
                <HospitalCard 
                  key={h.id} 
                  hospital={h} 
                  isSelected={selectedHospitalId === h.id} 
                  onClick={() => setSelectedHospitalId(h.id)} 
                />
              )) : (
                <p className="text-sm text-muted-foreground italic pl-1">No available hospitals.</p>
              )}
            </div>

            {/* 4. Occupied (Reassign) */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-destructive/80 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Occupied (Will Replace Existing Admin)
              </h4>
              <div className="space-y-2">
                {occupiedHospitals.map(h => (
                  <HospitalCard 
                    key={h.id} 
                    hospital={h} 
                    isSelected={selectedHospitalId === h.id} 
                    onClick={() => setSelectedHospitalId(h.id)}
                    isOccupied 
                    assignedAdminName={getAdminName(h.admin_id!)}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Footer Warning if Reassigning */}
          <div className="p-4 border-t border-border bg-muted/30">
             {isReassigningToOccupied && (
               <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2 text-xs text-amber-800">
                 <AlertTriangle className="w-4 h-4 shrink-0" />
                 <p>Warning: This hospital already has an admin. Proceeding will unassign the current admin.</p>
               </div>
             )}
             <div className="flex justify-end gap-3">
               <Button variant="ghost" onClick={onClose}>Cancel</Button>
               <Button onClick={handleSave} variant={isReassigningToOccupied ? "destructive" : "default"}>
                 {selectedHospitalId === null ? "Save as Unassigned" : "Confirm Assignment"}
               </Button>
             </div>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function HospitalCard({ hospital, isSelected, onClick, isOccupied, assignedAdminName, isCurrent }: any) {
  return (
    <div 
      onClick={onClick}
      className={`relative p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
        isSelected 
          ? "bg-primary/5 border-primary shadow-sm" 
          : "bg-card border-border hover:border-primary/30 hover:bg-muted/10"
      } ${isOccupied && !isSelected ? "opacity-75" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
           isSelected ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border"
        }`}>
          <Building className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                {hospital.name}
            </p>
            {isCurrent && (
                <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                    Current
                </span>
            )}
          </div>
          
          {/* Display Assigned Admin Name for Occupied groups */}
          {assignedAdminName && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <User className="w-3 h-3 text-muted-foreground/70" />
              <p className="text-xs text-muted-foreground truncate">
                Assigned: <span className="font-medium text-foreground/80">{assignedAdminName}</span>
              </p>
            </div>
          )}
        </div>
      </div>
      {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
    </div>
  );
}