"use client";

import { HospitalSummary } from "@/types/reports";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface HospitalSummaryTableProps {
  data: HospitalSummary[];
}

export default function HospitalSummaryTable({ data }: HospitalSummaryTableProps) {
  const router = useRouter();

  return (
    <Card className="overflow-hidden border-border shadow-sm mb-6">
      <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
        <h3 className="font-semibold text-foreground">Hospital Performance Breakdown</h3>
        <span className="text-xs text-muted-foreground">{data.length} Locations</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-3 cursor-pointer hover:text-foreground">Hospital Name <ArrowUpDown className="w-3 h-3 inline ml-1" /></th>
              <th className="px-6 py-3 text-right">Appointments</th>
              <th className="px-6 py-3 text-right">Doctors</th>
              <th className="px-6 py-3 text-right">Patients</th>
              <th className="px-6 py-3 text-right">Revenue</th>
              <th className="px-6 py-3 text-right">No-Show %</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((hospital) => (
              <tr 
                key={hospital.id} 
                onClick={() => router.push(`/group-admin/hospitals/${hospital.id}`)}
                className="hover:bg-muted/5 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4 font-medium text-foreground">{hospital.name}</td>
                <td className="px-6 py-4 text-right text-muted-foreground">{hospital.appointments.toLocaleString()}</td>
                <td className="px-6 py-4 text-right text-muted-foreground">{hospital.doctors}</td>
                <td className="px-6 py-4 text-right text-muted-foreground">{hospital.patients.toLocaleString()}</td>
                <td className="px-6 py-4 text-right font-medium text-emerald-600">{hospital.revenue}</td>
                <td className="px-6 py-4 text-right text-muted-foreground">{hospital.noShowRate}</td>
                <td className="px-6 py-4 text-center">
                  <Badge variant={hospital.status === "Active" ? "outline" : "secondary"} className={hospital.status === "Active" ? "text-success border-success/30 bg-success/5" : ""}>
                    {hospital.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}