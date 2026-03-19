"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Doctor } from "@/types/hospital-monitor";

export default function DoctorsTab({ data }: { data: Doctor[] }) {
  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
          <tr>
            <th className="px-6 py-4">Doctor Name</th>
            <th className="px-6 py-4">Specialization</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Daily Load</th>
            <th className="px-6 py-4 text-right">Patients Today</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((doc) => (
            <tr key={doc.id} className={`hover:bg-muted/5 transition-colors ${doc.status === 'Inactive' ? 'opacity-60 bg-muted/10' : ''}`}>
              <td className="px-6 py-4 font-medium text-foreground">{doc.name}</td>
              <td className="px-6 py-4 text-muted-foreground">{doc.specialization}</td>
              <td className="px-6 py-4">
                <Badge variant={doc.status === "Active" ? "default" : "secondary"}>
                  {doc.status}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all" 
                    style={{ width: `${doc.appointment_load}%` }} 
                  />
                </div>
                <span className="text-xs text-muted-foreground mt-1 inline-block">{doc.appointment_load}% Capacity</span>
              </td>
              <td className="px-6 py-4 text-right font-medium text-foreground">
                {doc.patients_today}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}