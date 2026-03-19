"use client";

import { Hospital } from "@/types/hospital";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Clock, MapPin, User2Icon } from "lucide-react";
import HospitalActionsMenu from "./HospitalActionsMenu";
import { StatusBadge } from "@/components/common/StatusBadge";

interface HospitalsTableProps {
  data: Hospital[];
  onEdit: (hospital: Hospital) => void;
  onAssignAdmin: (hospital: Hospital) => void;
}

export default function HospitalsTable({ data, onEdit, onAssignAdmin }: HospitalsTableProps) {
  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Hospital Name / Code</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Timing</th>
              <th className="px-6 py-4">Admin</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((hospital) => (
              <tr 
                key={hospital.hospital_id} 
                className={`transition-colors group ${
                  hospital.is_active ? "hover:bg-muted/10" : "bg-muted/5 opacity-70"
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{hospital.hospital_name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{hospital.hospital_code}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {hospital.city_name}, {hospital.state_name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {hospital.is_24by7 ? (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      24 x 7
                    </Badge>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(hospital.opening_time).toLocaleTimeString("en-IN")} - {new Date(hospital.closing_time).toLocaleTimeString("en-IN")}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {hospital.admin_name ? (
                    <div className="flex items-center gap-2 text-foreground">
                      <User2Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      {hospital.admin_name}
                    </div>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200"
                    >
                      Unassigned
                    </Badge>
                  )}
                </td>
                <td className="px-6 py-4">
                   <StatusBadge status={hospital.is_active ? "Active" : "Inactive"} />
                </td>
                <td className="px-6 py-4 text-right">
                  <HospitalActionsMenu 
                    hospital={hospital} 
                    onEdit={() => onEdit(hospital)} 
                    onAssignAdmin={() => onAssignAdmin(hospital)} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}