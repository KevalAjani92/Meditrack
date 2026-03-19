"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Calendar, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/types/appointment";
import { appointmentService } from "@/services/appointment.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  appointment?: Appointment;
  mode: "cancel" | "reschedule" | null;
  onActionComplete: () => void;
}

export default function CancelRescheduleModal({ isOpen, onClose, appointment, mode, onActionComplete }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  // console.log(newDate,newTime);

  if (!appointment || !mode) return null;

  const handleSubmit = async () => {
    if (!appointment.appointment_id) return;
    setLoading(true);
    setError(null);
    try {
      if (mode === "cancel") {
        await appointmentService.cancelAppointment(appointment.appointment_id);
      } else {
        await appointmentService.rescheduleAppointment(appointment.appointment_id, {
          appointment_date: newDate,
          appointment_time: newTime,
        });
      }
      onActionComplete();
    } catch (err: any) {
      setError(err?.message || `Failed to ${mode} appointment`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-sm translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-0 shadow-lg border border-border animate-in fade-in zoom-in-95 overflow-hidden">

          <div className={`p-6 border-b border-border flex justify-between items-center ${mode === 'cancel' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
            <Dialog.Title className="text-lg font-bold">
              {mode === "cancel" ? "Cancel Appointment" : "Reschedule Appointment"}
            </Dialog.Title>
            <button onClick={onClose} className="hover:opacity-70"><X className="w-5 h-5" /></button>
          </div>

          <div className="p-6 space-y-5">
            <p className="text-sm text-foreground">
              {mode === "cancel"
                ? `Are you sure you want to cancel your appointment with ${appointment.doctorName} on ${appointment.date}?`
                : `Select a new date and time for your appointment with ${appointment.doctorName}.`
              }
            </p>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive">{error}</div>
            )}

            {mode === "cancel" && (
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20 flex gap-3 text-warning-foreground text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>This action cannot be undone. You will need to book a new appointment if you change your mind.</p>
              </div>
            )}

            {mode === "reschedule" && (
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">New Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-sm focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">New Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-sm focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-border bg-muted/20 flex justify-end gap-3">
             <Button variant="ghost" onClick={onClose} disabled={loading}>Close</Button>
             <Button
               variant={mode === "cancel" ? "destructive" : "default"}
               onClick={handleSubmit}
               disabled={loading || (mode === "reschedule" && (!newDate || !newTime))}
               className="gap-2"
             >
               {loading && <Loader2 className="w-4 h-4 animate-spin" />}
               {mode === "cancel" ? "Yes, Cancel It" : "Confirm Reschedule"}
             </Button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}