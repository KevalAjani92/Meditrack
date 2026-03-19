"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle2, UserCheck, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  patientName: string;
  patientId: string;
}

export default function RegistrationSuccessModal({ isOpen, patientName, patientId }: Props) {
  const router = useRouter();

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-sm translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-card p-0 shadow-xl border border-border animate-in fade-in zoom-in-95 overflow-hidden text-center">
          
          <div className="bg-success/10 p-8 flex flex-col items-center border-b border-success/20">
            <div className="w-16 h-16 bg-success text-success-foreground rounded-full flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <Dialog.Title className="text-2xl font-bold text-foreground">Patient Registered</Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground mt-2">
              Registration completed successfully.
            </Dialog.Description>
          </div>

          <div className="p-6">
            <div className="p-4 rounded-xl bg-secondary/50 border border-border border-dashed flex flex-col items-center">
               <UserCheck className="w-6 h-6 text-muted-foreground mb-2" />
               <p className="font-bold text-foreground text-lg">{patientName}</p>
               <p className="font-mono text-sm text-primary font-bold mt-1">ID: {patientId}</p>
            </div>
          </div>

          <div className="p-4 bg-muted/30 border-t border-border flex flex-col gap-2">
            <button 
              onClick={() => router.push("/receptionist/opd-visit")}
              className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Stethoscope className="w-4 h-4" /> Create OPD Visit
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-2.5 bg-transparent border border-input text-foreground font-medium rounded-lg hover:bg-muted transition-colors"
            >
              Register Another Patient
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}