"use client";

import { Appointment, getStatusStyles } from "@/types/appointment";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, RefreshCw, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  data: Appointment[];
  tab: "Upcoming" | "Past";
  onView: (apt: Appointment) => void;
  onCancel: (apt: Appointment) => void;
  onReschedule: (apt: Appointment) => void;
  onRebook: (apt: Appointment) => void;
}

export default function AppointmentsCardGrid({ data, tab, onView, onCancel, onReschedule, onRebook }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((apt) => (
        <Card key={apt.appointment_id} onClick={() => onView(apt)} className={`p-5 border-border hover:shadow-md transition-all flex flex-col h-full cursor-pointer group ${tab === "Past" ? "bg-muted/5 opacity-90" : ""}`}>
          
          <div className="flex justify-between items-start mb-3">
            <Badge variant="outline" className={getStatusStyles(apt.status)}>{apt.status}</Badge>
            <span className="font-mono text-xs text-muted-foreground">{apt.appointmentNo}</span>
          </div>

          <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{apt.doctorName}</h3>
          <p className="text-xs text-muted-foreground mb-3">{apt.specialization} • {apt.department}</p>
          
          <div className="flex items-center gap-1.5 text-sm text-foreground mb-1.5">
             <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> {apt.hospitalName}
          </div>
          
          <div className="flex items-center gap-3 text-sm text-foreground mb-4 p-3 rounded-lg bg-muted/30 border border-border">
             <div className="flex items-center gap-1.5">
               <Calendar className="w-4 h-4 text-primary" />
               <span className="font-medium">{apt.date}</span>
             </div>
             <div className="flex items-center gap-1.5">
               <Clock className="w-4 h-4 text-primary" />
               <span className="font-medium">{apt.time}</span>
             </div>
          </div>

          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
            {tab === "Upcoming" ? (
              <>
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => onReschedule(apt)}>Reschedule</Button>
                <Button variant="outline" size="sm" className="w-full text-xs text-destructive hover:text-destructive hover:bg-destructive/10" disabled={!apt.canCancel} onClick={() => onCancel(apt)}>Cancel</Button>
              </>
            ) : (
              <Button variant="secondary" size="sm" className="w-full text-primary gap-1.5" onClick={() => onRebook(apt)}>
                <RefreshCw className="w-3.5 h-3.5" /> Book Again
              </Button>
            )}
          </div>

        </Card>
      ))}
    </div>
  );
}