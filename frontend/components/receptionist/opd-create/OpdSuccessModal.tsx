"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle2, Printer, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  data: any; // Passed from parent
  onReset: () => void;
}

export default function OpdSuccessModal({ isOpen, data, onReset }: Props) {
  const router = useRouter();
  if (!data) return null;

  const handleNewVisit = () => {
    onReset();
    router.refresh(); // refresh current page
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-sm translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-card p-0 shadow-xl border border-border animate-in fade-in zoom-in-95 overflow-hidden text-center">
          
          <div className="bg-success/10 p-8 flex flex-col items-center border-b border-success/20">
            <div className="w-16 h-16 bg-success text-success-foreground rounded-full flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <Dialog.Title className="text-2xl font-bold text-foreground">OPD Visit Created</Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground mt-1">
              The patient has been added to the queue.
            </Dialog.Description>
          </div>

          <div className="p-6 space-y-4 text-left">
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30 border border-border">
              <span className="text-sm text-muted-foreground">OPD No:</span>
              <span className="font-mono font-bold text-foreground">{data.opd_no}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30 border border-border">
              <span className="text-sm text-muted-foreground">Patient:</span>
              <span className="font-medium text-foreground">{data.patient}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30 border border-border">
              <span className="text-sm text-muted-foreground">Doctor:</span>
              <span className="font-medium text-foreground">{data.doctor}</span>
            </div>
            
            <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
               <p className="text-xs uppercase font-bold text-primary tracking-widest mb-1">Queue Token</p>
               <p className="text-3xl font-black text-foreground">{data.token}</p>
            </div>
          </div>

          <div className="p-4 bg-muted/30 border-t border-border flex flex-col gap-2">
            <Button className="w-full gap-2"><Printer className="w-4 h-4" /> Print Token</Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleNewVisit} className="gap-1.5 text-xs"><Plus className="w-3.5 h-3.5" /> New Visit</Button>
              <Button variant="outline" className="gap-1.5 text-xs">Queue <ArrowRight className="w-3.5 h-3.5" /></Button>
            </div>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}