"use client";

import { Appointment, getStatusStyles } from "@/types/appointment";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, Clock, RefreshCw, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  data: Appointment[];
  tab: "Upcoming" | "Past";
  onView: (apt: Appointment) => void;
  onCancel: (apt: Appointment) => void;
  onReschedule: (apt: Appointment) => void;
  onRebook: (apt: Appointment) => void;
}

export default function AppointmentsTable({ data, tab, onView, onCancel, onReschedule, onRebook }: Props) {
  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Appointment</th>
              <th className="px-6 py-4">Hospital & Dept</th>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((apt) => (
              <tr key={apt.appointment_id} onClick={() => onView(apt)} className={`transition-colors cursor-pointer group ${tab === "Past" ? "bg-muted/5 opacity-90 hover:opacity-100" : "hover:bg-muted/10"}`}>
                
                {/* ID & Doctor */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{apt.doctorName}</span>
                    <span className="font-mono text-xs text-muted-foreground">{apt.appointmentNo}</span>
                  </div>
                </td>

                {/* Hospital */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground" /> {apt.hospitalName}
                    </span>
                    <span className="text-xs text-muted-foreground ml-5">{apt.department}</span>
                  </div>
                </td>

                {/* Date & Time */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> {apt.date}
                      {apt.isToday && <Badge variant="default" className="ml-2 h-4 px-1 text-[9px] uppercase tracking-wide">Today</Badge>}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-5">
                      <Clock className="w-3 h-3" /> {apt.time}
                    </div>
                    {apt.timelineText && tab === "Upcoming" && (
                      <span className="text-[10px] font-bold text-primary ml-5 mt-0.5">{apt.timelineText}</span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <Badge variant="outline" className={getStatusStyles(apt.status)}>
                    {apt.status}
                  </Badge>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    {tab === "Upcoming" ? (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => onReschedule(apt)} className="h-8 text-muted-foreground hover:text-primary">
                          Reschedule
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => apt.canCancel && onCancel(apt)} 
                          className={`h-8 ${apt.canCancel ? 'text-destructive hover:text-destructive hover:bg-destructive/10' : 'text-muted-foreground opacity-50 cursor-not-allowed'}`}
                          title={!apt.canCancel ? "Too close to appointment time" : ""}
                        >
                          Cancel {!apt.canCancel && <AlertCircle className="w-3 h-3 ml-1" />}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" onClick={() => onRebook(apt)} className="h-8 gap-1.5 text-primary border-primary/20 hover:bg-primary/5">
                          <RefreshCw className="w-3 h-3" /> Rebook
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => onView(apt)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}