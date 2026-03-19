"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle2, Ticket, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BookingResult } from "@/types/booking";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookingResult: BookingResult | null;
}

export default function BookingConfirmationModal({ isOpen, onClose, bookingResult }: Props) {
  if (!bookingResult) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-card p-0 shadow-xl border border-border animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
          
          <div className="bg-success/10 p-8 flex flex-col items-center justify-center border-b border-success/20 text-center">
            <div className="w-16 h-16 bg-success text-success-foreground rounded-full flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <Dialog.Title className="text-2xl font-bold text-foreground">Appointment Confirmed</Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground mt-2">
              Your appointment has been successfully scheduled.
            </Dialog.Description>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Ticket Info */}
            <div className="p-4 rounded-xl bg-secondary/50 border border-border border-dashed flex justify-between items-center">
               <div>
                 <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Appointment No</p>
                 <p className="font-mono text-lg font-bold text-primary flex items-center gap-2">
                   <Ticket className="w-4 h-4" /> {bookingResult.appointment_no}
                 </p>
               </div>
               <div className="text-right">
                 <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded uppercase tracking-wide">
                   {bookingResult.appointment_status}
                 </span>
               </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hospital</span>
                <span className="font-medium text-foreground">{bookingResult.hospital_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Doctor</span>
                <span className="font-medium text-foreground">{bookingResult.doctor_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium text-foreground">{bookingResult.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">{new Date(bookingResult.appointment_date).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">Important Instructions</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  Please visit the hospital exactly on the scheduled time.
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  Show this confirmation at the reception to get your queue token.
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  Wait patiently in the designated waiting area.
                </li>
              </ul>
              
              <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg flex items-start gap-2 text-xs text-warning-foreground">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>If you are unable to attend, please cancel your appointment from the dashboard to free the slot for others.</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 border-t border-border flex flex-col gap-2">
            <Button className="w-full" onClick={() => window.location.href = "/patient/appointments"}>
              View My Appointments
            </Button>
            <Button variant="ghost" className="w-full" onClick={onClose}>
              Close Window
            </Button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}