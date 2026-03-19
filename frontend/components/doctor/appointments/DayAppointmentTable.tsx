"use client";

import { Appointment, getStatusBadgeStyles } from "@/types/doctor-schedule";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Clock } from "lucide-react";

interface Props {
  data: Appointment[];
  onView: (apt: Appointment) => void;
}

export default function DayAppointmentTable({ data, onView }: Props) {
  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Appointment</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Chief Complaint</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No appointments found.</td></tr>
            ) : data.map((apt) => (
              <tr key={apt.id} className="hover:bg-muted/10 transition-colors group cursor-pointer" onClick={() => onView(apt)}>
                <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" /> {apt.time}
                </td>
                <td className="px-4 py-3 font-mono text-muted-foreground">{apt.appointmentNo}</td>
                <td className="px-4 py-3">
                  <p className="font-bold text-foreground group-hover:text-primary transition-colors">{apt.patientName}</p>
                  <p className="text-xs text-muted-foreground">{apt.age}Y, {apt.gender}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate" title={apt.chiefComplaint}>
                  {apt.chiefComplaint}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={`${getStatusBadgeStyles(apt.status)} whitespace-nowrap`}>{apt.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground group-hover:text-primary">
                    <Eye className="w-4 h-4" /> View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}