"use client";

import { Receptionist } from "@/types/receptionist";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail } from "lucide-react";
import ReceptionistActionsMenu from "./ReceptionistActionsMenu";

interface ReceptionistsCardGridProps {
  data: Receptionist[];
  onView: (rec: Receptionist) => void;
  onEdit: (rec: Receptionist) => void;
  onToggleStatus: (rec: Receptionist) => void;
  onResetPassword: (rec: Receptionist) => void;
}

export default function ReceptionistsCardGrid({ data, onView, onEdit, onToggleStatus, onResetPassword }: ReceptionistsCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((rec) => (
        <Card
          key={rec.user_id}
          onClick={() => onView(rec)}
          className={`p-5 border-border hover:shadow-md transition-all flex flex-col h-full cursor-pointer group ${
            rec.status !== "Active" ? "opacity-75 grayscale-[0.5]" : ""
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold border border-border text-foreground">
                {rec.avatar_initials}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{rec.name}</h3>
                <Badge variant={rec.status === "Active" ? "default" : "secondary"} className="mt-1 h-5 text-[10px]">
                  {rec.status}
                </Badge>
              </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <ReceptionistActionsMenu 
                receptionist={rec} 
                onView={() => onView(rec)}
                onEdit={() => onEdit(rec)}
                onToggleStatus={() => onToggleStatus(rec)}
                onResetPassword={() => onResetPassword(rec)}
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-border mt-auto">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span className="truncate">{rec.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span className="font-mono text-foreground font-medium">{rec.phone}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}