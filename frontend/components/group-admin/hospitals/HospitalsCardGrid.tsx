"use client";

import { Hospital } from "@/types/hospital";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  UserCircle2,
  Phone,
  Mail,
  Clock,
  CalendarDays,
  Building2,
  Calculator,
  LetterTextIcon,
} from "lucide-react";
import HospitalActionsMenu from "./HospitalActionsMenu";

interface HospitalsCardGridProps {
  data: Hospital[];
  onEdit: (hospital: Hospital) => void;
  onAssignAdmin: (hospital: Hospital) => void;
}

// Helper to format HH:mm:ss to 12-hour format
const formatTime = (timeString: string | null) => {
  if (!timeString) return "N/A";
  const [hourString, minute] = timeString.split(":");
  const hour = parseInt(hourString, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minute} ${ampm}`;
};

// Helper to get just the year from the ISO string
const getYear = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).getFullYear();
};

export default function HospitalsCardGrid({
  data,
  onEdit,
  onAssignAdmin,
}: HospitalsCardGridProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl border-border bg-muted/10">
        <Building2 className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-foreground">
          No Hospitals Found
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          There are currently no hospitals registered in the system.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {data.map((hospital) => (
        <Card
          key={hospital.hospital_id}
          className={`p-5 flex flex-col h-full transition-all duration-200 border-border hover:shadow-lg hover:border-primary/20 group relative overflow-hidden ${
            !hospital.is_active
              ? "bg-muted/30 grayscale-[0.4] opacity-90"
              : "bg-card"
          }`}
        >
          {/* Top Row: Badges & Actions */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-wrap gap-2 items-center">
              <Badge
                variant="outline"
                className="font-mono bg-background text-xs text-muted-foreground px-2"
              >
                {hospital.hospital_code}
              </Badge>
              {hospital.is_active ? (
                <Badge
                  variant="secondary"
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                >
                  Active
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-zinc-100 text-zinc-600 border-zinc-200"
                >
                  Inactive
                </Badge>
              )}
            </div>
            <div className="pl-2">
              <HospitalActionsMenu
                hospital={hospital}
                onEdit={() => onEdit(hospital)}
                onAssignAdmin={() => onAssignAdmin(hospital)}
              />
            </div>
          </div>

          {/* Title & Location */}
          <div className="mb-5">
            <h3
              className="font-bold text-lg text-foreground mb-1.5 leading-tight group-hover:text-primary transition-colors line-clamp-1"
              title={hospital.hospital_name}
            >
              {hospital.hospital_name}
            </h3>
            <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span className="line-clamp-2 leading-snug">
                {hospital.city_name || "Unknown City"},{" "}
                {hospital.state_name || "Unknown State"}
              </span>
            </div>
          </div>

          {/* Details Container (Grey Background Box) */}
          <div className="space-y-3 mt-auto p-4 rounded-lg bg-muted/30 border border-border/50">
            {/* Timings */}
            <div className="flex items-center gap-2.5 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="flex items-center gap-2 font-medium text-foreground">
                {hospital.is_24by7 ? (
                  <Badge
                    variant="default"
                    className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-1.5 h-5 font-semibold text-[10px] uppercase tracking-wider"
                  >
                    24x7 Open
                  </Badge>
                ) : (
                  <span>
                    {formatTime(hospital.opening_time)} -{" "}
                    {formatTime(hospital.closing_time)}
                  </span>
                )}
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-2.5 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-foreground truncate">
                {hospital.contact_phone ||
                  hospital.receptionist_contact ||
                  "No contact provided"}
              </span>
            </div>

            {/* Email (Optional, renders if exists) */}
            {hospital.contact_email && (
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <span
                  className="text-foreground truncate"
                  title={hospital.contact_email}
                >
                  {hospital.contact_email}
                </span>
              </div>
            )}

            {/* Established / Registration */}
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <CalendarDays className="w-4 h-4 shrink-0" />
              <span>
                Est. {new Date(hospital.opening_date).toLocaleDateString("en-IN")}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              {hospital.registration_no && (
                <>
                  <LetterTextIcon className="w-4 h-4 shrink-0" />
                  <span
                    className="truncate"
                    title={`Reg: ${hospital.registration_no}`}
                  >
                    Reg: {hospital.registration_no}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Footer: Admin Assignment */}
          <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <UserCircle2 className="w-4 h-4" />
              <span>Admin :</span>
            </div>
            {hospital.admin_name ? (
              <span className="text-sm font-semibold text-foreground bg-background px-2 py-1 rounded border border-border">
                {hospital.admin_name}
              </span>
            ) : (
              <Badge
                variant="outline"
                className="bg-orange-50/50 text-orange-700 border-orange-200 h-6 font-medium shadow-sm"
              >
                Unassigned
              </Badge>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
