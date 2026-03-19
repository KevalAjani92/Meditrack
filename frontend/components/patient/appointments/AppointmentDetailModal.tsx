"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Calendar, Clock, MapPin, User, Stethoscope, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Appointment, getStatusStyles } from "@/types/appointment";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  appointment?: Appointment;
  onCancel: () => void;
  onReschedule: () => void;
}

export default function AppointmentDetailModal({ isOpen, onClose, appointment, onCancel, onReschedule }: Props) {
  if (!appointment) return null;
  const isUpcoming = appointment.status === "Scheduled" || appointment.status === "Rescheduled";

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-0 shadow-lg border border-border animate-in fade-in zoom-in-95">
          
          {/* Header */}
          <div className="p-6 border-b border-border bg-muted/10 flex justify-between items-start">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-1 tracking-wider">Appointment Details</p>
              <h2 className="text-xl font-mono font-bold text-foreground">{appointment.appointmentNo}</h2>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className={getStatusStyles(appointment.status)}>{appointment.status}</Badge>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Timing */}
            <div className="flex items-center gap-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">{appointment.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">{appointment.time}</span>
              </div>
            </div>

            {/* Clinic Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{appointment.doctorName}</p>
                  <p className="text-xs text-muted-foreground">{appointment.specialization}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{appointment.hospitalName}</p>
                  <p className="text-xs text-muted-foreground">Dept: {appointment.department}</p>
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Patient Remarks / Symptoms</p>
              <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg border border-border">
                {appointment.symptoms || "No symptoms provided."}
              </p>
            </div>

            {/* Meta */}
            <p className="text-[10px] text-muted-foreground text-right">Booked on: {appointment.bookingDate}</p>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border bg-muted/20 flex justify-end gap-3">
             {isUpcoming && (
               <>
                 {!appointment.canCancel && (
                   <div className="flex items-center text-xs text-destructive mr-auto gap-1 px-2">
                     <AlertCircle className="w-3.5 h-3.5" /> Too late to cancel
                   </div>
                 )}
                 <Button variant="outline" onClick={onCancel} disabled={!appointment.canCancel} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                   Cancel Appointment
                 </Button>
                 <Button onClick={onReschedule}>Reschedule</Button>
               </>
             )}
             {!isUpcoming && <Button variant="ghost" onClick={onClose}>Close</Button>}
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}