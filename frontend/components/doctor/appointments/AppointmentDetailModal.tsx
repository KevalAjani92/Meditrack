"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Calendar, Clock, User, Phone, MapPin, Activity, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Appointment, getStatusBadgeStyles } from "@/types/doctor-schedule";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export default function AppointmentDetailModal({ isOpen, onClose, appointment }: Props) {
  if (!appointment) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-card p-0 shadow-xl border border-border animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="p-6 border-b border-border bg-muted/10 flex justify-between items-start">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Appointment Details</p>
              <h2 className="text-xl font-mono font-bold text-foreground flex items-center gap-3">
                {appointment.appointmentNo}
                <Badge variant="outline" className={getStatusBadgeStyles(appointment.status)}>{appointment.status}</Badge>
              </h2>
            </div>
            <button onClick={onClose} className="p-1.5 text-muted-foreground hover:bg-muted rounded-full transition-colors"><X className="w-5 h-5"/></button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6">
            
            {/* Timing & Patient Identity */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-primary/5 border border-primary/20 flex-1">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Date & Time</p>
                  <p className="font-semibold text-foreground">{appointment.date} • {appointment.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border flex-1">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Patient Identity</p>
                  <p className="font-semibold text-foreground">{appointment.patientName} <span className="text-muted-foreground font-normal">({appointment.age}Y, {appointment.gender})</span></p>
                </div>
              </div>
            </div>

            {/* Complaint */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground uppercase tracking-wider">Chief Complaint</p>
              <p className="p-3 bg-muted/30 border border-border rounded-lg text-sm text-foreground">{appointment.chiefComplaint}</p>
            </div>

            {/* Quick Medical Info */}
            <div className="space-y-3 pt-2">
              <p className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Medical Quick Info
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                 <div className="p-2 border border-border rounded bg-card">
                   <p className="text-[10px] text-muted-foreground uppercase">Blood Group</p>
                   <p className="font-bold text-destructive">{appointment.medicalInfo.bloodGroup}</p>
                 </div>
                 <div className="p-2 border border-border rounded bg-card">
                   <p className="text-[10px] text-muted-foreground uppercase">Allergies</p>
                   <p className="font-medium text-foreground truncate" title={appointment.medicalInfo.allergies}>{appointment.medicalInfo.allergies}</p>
                 </div>
                 <div className="p-2 border border-border rounded bg-card col-span-2">
                   <p className="text-[10px] text-muted-foreground uppercase">Conditions</p>
                   <p className="font-medium text-foreground truncate">{appointment.medicalInfo.chronicConditions}</p>
                 </div>
              </div>
              <div className="p-3 border border-border rounded-lg bg-card flex items-start gap-3">
                 <Pill className="w-4 h-4 text-muted-foreground mt-0.5" />
                 <div>
                   <p className="text-[10px] text-muted-foreground uppercase font-semibold">Current Medications</p>
                   <p className="text-sm font-medium text-foreground">{appointment.medicalInfo.currentMedications}</p>
                 </div>
              </div>
            </div>

            {/* Contact & Remarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground font-semibold uppercase tracking-wider text-xs">Contact Info</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /> {appointment.phone}</p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /> {appointment.city}</p>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground font-semibold uppercase tracking-wider text-xs">Reception Remarks</p>
                <p className="italic text-foreground">{appointment.remarks || "No remarks added."}</p>
              </div>
            </div>

          </div>

          <div className="p-4 border-t border-border bg-muted/20 flex justify-end">
             <Button variant="ghost" onClick={onClose}>Close Preview</Button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}