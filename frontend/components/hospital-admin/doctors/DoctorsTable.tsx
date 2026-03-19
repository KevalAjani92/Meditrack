"use client";

import { Doctor } from "@/types/doctor";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import DoctorActionsMenu from "./DoctorActionsMenu";
import { useRouter } from "next/navigation";

interface DoctorsTableProps {
  data: Doctor[];
  onEdit: (doctor: Doctor) => void;
  onToggleStatus: (doctor: Doctor) => void;
  onResetPassword: (doctor: Doctor) => void;
}

export default function DoctorsTable({ data, onEdit, onToggleStatus, onResetPassword }: DoctorsTableProps) {
  const router = useRouter();

  const handleRowClick = (id: number) => {
    router.push(`/hospital-admin/doctors/${id}`);
  };

  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Doctor Name</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Experience</th>
              <th className="px-6 py-4">Fees</th>
              <th className="px-6 py-4">Availability</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((doctor) => (
              <tr 
                key={doctor.doctor_id} 
                onClick={() => handleRowClick(doctor.doctor_id)}
                className={`transition-colors cursor-pointer group ${
                  doctor.status === "Active" ? "hover:bg-muted/10" : "bg-muted/5 opacity-70"
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-semibold text-xs border border-border">
                      {doctor.avatar_initials}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{doctor.doctor_name}</p>
                      <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-foreground">
                  {doctor.department_name}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {doctor.experience_years} Years
                </td>
                <td className="px-6 py-4 font-medium text-foreground">
                  ${doctor.consultation_fees}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-xs">
                    {doctor.availability === "Available" ? (
                      <Badge variant="outline" className="text-success border-success/30 bg-success/5 gap-1">
                        <Clock className="w-3 h-3" /> Available
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-muted-foreground">Unavailable</Badge>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className={`w-2 h-2 rounded-full inline-block mr-2 ${doctor.status === 'Active' ? 'bg-success' : 'bg-muted-foreground'}`} />
                   {doctor.status}
                </td>
                <td className="px-6 py-4 text-right">
                  <div onClick={(e) => e.stopPropagation()}>
                    <DoctorActionsMenu 
                      doctor={doctor} 
                      onEdit={() => onEdit(doctor)}
                      onView={() => handleRowClick(doctor.doctor_id)}
                      onToggleStatus={() => onToggleStatus(doctor)}
                      onResetPassword={() => onResetPassword(doctor)}
                    />
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