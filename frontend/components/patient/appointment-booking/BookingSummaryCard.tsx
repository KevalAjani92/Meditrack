"use client";

import { Building2, Stethoscope, Calendar, Clock, User, ClipboardList, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Hospital, Department, Doctor } from "@/types/booking";

interface Props {
  hospital?: Hospital;
  department?: Department;
  doctor?: Doctor;
  date?: string;
  time?: string;
  symptoms: string;
}

/**
 * Convert 24h "HH:mm" to 12h "HH:mm AM/PM" for display.
 */
function formatTo12Hour(time24: string): string {
  if (!time24 || time24.includes("AM") || time24.includes("PM")) return time24;
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function BookingSummaryCard({ hospital, department, doctor, date, time, symptoms }: Props) {
  const formattedDate = date ? new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "—";
  const formattedTime = time ? formatTo12Hour(time) : "—";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Review & Confirm</h2>
        <p className="text-sm text-muted-foreground mt-1">Please verify your appointment details before booking.</p>
      </div>

      <Card className="p-0 border-border overflow-hidden shadow-sm">
        <div className="p-5 bg-muted/20 border-b border-border flex justify-between items-center">
           <div className="flex items-center gap-3">
             <Calendar className="w-5 h-5 text-primary" />
             <div>
               <p className="text-sm font-bold text-foreground">{formattedDate}</p>
               <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                 <Clock className="w-3 h-3" /> {formattedTime}
               </p>
             </div>
           </div>
           {doctor && (
             <div className="text-right">
               <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Total Fee</p>
               <p className="text-lg font-bold text-foreground flex items-center gap-0.5 justify-end">
                 ₹{doctor.fee}
               </p>
             </div>
           )}
        </div>

        <div className="p-5 space-y-4">
          <SummaryRow icon={Building2} label="Hospital" value={hospital?.hospital_name} subValue={[hospital?.address, hospital?.city_name].filter(Boolean).join(", ")} />
          <SummaryRow icon={Stethoscope} label="Department" value={department?.department_name} />
          <SummaryRow icon={User} label="Consulting Doctor" value={doctor?.name} subValue={doctor?.specialization} />
          
          {symptoms && (
            <div className="pt-4 border-t border-border/50">
              <SummaryRow icon={ClipboardList} label="Symptoms" value={symptoms} />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value, subValue }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-medium text-foreground">{value || "—"}</p>
        {subValue && <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>}
      </div>
    </div>
  );
}