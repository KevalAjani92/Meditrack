"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Settings2 } from "lucide-react";
import { HospitalDepartment } from "@/types/department";
import { Button } from "@/components/ui/button";

const schema = z.object({
  isActive: z.boolean(),
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
  department: HospitalDepartment | null;
  onSave: (deptId: number, isActive: boolean) => void;
}

export default function EditDepartmentModal({ isOpen, onClose, department, onSave }: Props) {
  const { register, handleSubmit, reset } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => { 
    if (isOpen && department) reset({ isActive: department.isActive }); 
  }, [isOpen, department, reset]);

  if (!department) return null;

  const onSubmit = (data: { isActive: boolean }) => {
    onSave(department.hospital_department_id, data.isActive);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-6 shadow-xl border border-border animate-in zoom-in-95">
          
          <div className="flex justify-between items-center mb-5 border-b border-border pb-3">
            <Dialog.Title className="text-lg font-bold flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" /> Manage Department
            </Dialog.Title>
            <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground hover:text-foreground"/></button>
          </div>

          <div className="space-y-5">
            <div className="p-3 bg-muted/30 rounded-lg border border-border opacity-80 cursor-not-allowed">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Locked Details</p>
              <h3 className="font-bold text-foreground text-lg mt-1">{department.department_name}</h3>
              <p className="text-sm font-mono text-muted-foreground">{department.department_code}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${department.isActive ? 'border-success/30 bg-success/5' : 'border-border bg-card'}`}>
                <div>
                  <label className="text-sm font-bold text-foreground cursor-pointer" htmlFor="isActiveEdit">Active Status</label>
                  <p className="text-xs text-muted-foreground">Uncheck to disable appointments.</p>
                </div>
                <input type="checkbox" id="isActiveEdit" {...register("isActive")} className="w-5 h-5 accent-primary cursor-pointer" />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}