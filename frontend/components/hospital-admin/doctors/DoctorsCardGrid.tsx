"use client";

import { Doctor } from "@/types/doctor";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Briefcase } from "lucide-react";
import DoctorActionsMenu from "./DoctorActionsMenu";
import { useRouter } from "next/navigation";

interface DoctorsCardGridProps {
  data: Doctor[];
  onEdit: (doctor: Doctor) => void;
  onToggleStatus: (doctor: Doctor) => void;
  onResetPassword: (doctor: Doctor) => void;
}

export default function DoctorsCardGrid({ data, onEdit, onToggleStatus, onResetPassword }: DoctorsCardGridProps) {
  const router = useRouter();

  const handleCardClick = (id: number) => {
    router.push(`/hospital-admin/doctors/${id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((doctor) => (
        <Card
          key={doctor.doctor_id}
          onClick={() => handleCardClick(doctor.doctor_id)}
          className={`p-5 border-border hover:shadow-md transition-all flex flex-col h-full cursor-pointer group ${
            doctor.status !== "Active" ? "opacity-75" : ""
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-lg font-bold border border-border text-foreground">
                {doctor.avatar_initials}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{doctor.doctor_name}</h3>
                <p className="text-xs text-muted-foreground">{doctor.qualification}</p>
                <Badge variant="secondary" className="mt-1 text-[10px] h-5">
                  {doctor.department_name}
                </Badge>
              </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <DoctorActionsMenu 
                doctor={doctor} 
                onEdit={() => onEdit(doctor)}
                onView={() => handleCardClick(doctor.doctor_id)}
                onToggleStatus={() => onToggleStatus(doctor)}
                onResetPassword={() => onResetPassword(doctor)}
              />
            </div>
          </div>

          <div className="space-y-2 mb-4">
             <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                   <Briefcase className="w-3.5 h-3.5" /> Exp
                </span>
                <span className="font-medium text-foreground">{doctor.experience_years} Years</span>
             </div>
             <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Consultation Fee</span>
                <span className="font-bold text-foreground">${doctor.consultation_fees}</span>
             </div>
          </div>

          <div className="pt-3 border-t border-border mt-auto flex justify-between items-center">
             <Badge 
               variant={doctor.availability === "Available" ? "outline" : "secondary"} 
               className={doctor.availability === "Available" ? "text-success border-success/30 bg-success/5 gap-1" : "text-muted-foreground"}
             >
               {doctor.availability === "Available" && <Clock className="w-3 h-3" />}
               {doctor.availability}
             </Badge>
             <span className={`text-xs font-medium ${doctor.status === 'Active' ? 'text-foreground' : 'text-muted-foreground'}`}>
               {doctor.status}
             </span>
          </div>
        </Card>
      ))}
    </div>
  );
}