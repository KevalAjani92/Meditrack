"use client";

import { Receptionist } from "@/types/receptionist";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import ReceptionistActionsMenu from "./ReceptionistActionsMenu";

interface ReceptionistsTableProps {
  data: Receptionist[];
  onView: (rec: Receptionist) => void;
  onEdit: (rec: Receptionist) => void;
  onToggleStatus: (rec: Receptionist) => void;
  onResetPassword: (rec: Receptionist) => void;
}

export default function ReceptionistsTable({ data, onView, onEdit, onToggleStatus, onResetPassword }: ReceptionistsTableProps) {
  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email Address</th>
              <th className="px-6 py-4">Contact Phone</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Active</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((rec) => (
              <tr 
                key={rec.user_id} 
                onClick={() => onView(rec)}
                className={`transition-colors cursor-pointer group ${
                  rec.status === "Active" ? "hover:bg-muted/10" : "bg-muted/5 opacity-70 grayscale-[0.5]"
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-semibold text-xs border border-border">
                      {rec.avatar_initials}
                    </div>
                    <span className="font-medium text-foreground">{rec.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {rec.email}
                </td>
                <td className="px-6 py-4 font-mono text-foreground">
                  {rec.phone}
                </td>
                <td className="px-6 py-4">
                   <Badge variant={rec.status === "Active" ? "outline" : "secondary"} className={rec.status === "Active" ? "text-success border-success/30 bg-success/5" : "text-muted-foreground"}>
                     {rec.status}
                   </Badge>
                </td>
                <td className="px-6 py-4 text-muted-foreground text-xs">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {rec.last_active}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div onClick={(e) => e.stopPropagation()}>
                    <ReceptionistActionsMenu 
                      receptionist={rec} 
                      onView={() => onView(rec)}
                      onEdit={() => onEdit(rec)}
                      onToggleStatus={() => onToggleStatus(rec)}
                      onResetPassword={() => onResetPassword(rec)}
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