"use client";

import { HospitalAdmin } from "@/types/hospital-admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Clock, Mail, Phone } from "lucide-react";
import AdminActionsMenu from "./AdminActionsMenu";
import Image from "next/image";
import { StatusBadge } from "@/components/common/StatusBadge";

interface AdminsCardGridProps {
  data: HospitalAdmin[];
  onView: (admin: HospitalAdmin) => void;
  onEdit: (admin: HospitalAdmin) => void;
  onAssign: (admin: HospitalAdmin) => void;
}

export default function AdminsCardGrid({
  data,
  onView,
  onEdit,
  onAssign,
}: AdminsCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((admin) => (
        <Card
          key={admin.user_id}
          onClick={() => onView(admin)}
          className={`p-5 border-border hover:shadow-md transition-all flex flex-col h-full cursor-pointer group ${
            !admin.is_active ? "opacity-75" : ""
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden flex items-center justify-center border border-border shrink-0">
                <Image
                  src={admin.profile_image_url || "/avatar_1.png"}
                  alt={admin.full_name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {admin.full_name}
                </h3>
                <StatusBadge
                  status={admin.is_active ? "Active" : "Inactive"}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <AdminActionsMenu
                admin={admin}
                onView={() => onView(admin)}
                onEdit={() => onEdit(admin)}
                onAssign={() => onAssign(admin)}
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-border mt-auto">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span className="truncate">{admin.email}</span>
            </div>

            {/* Phone Number Row - NEW */}
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Phone className="w-4 h-4 shrink-0" />
              <span>{admin.phone_number || "No phone provided"}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Building className="w-4 h-4 text-muted-foreground" />
              {admin.hospital_name ? (
                <span className="text-foreground">{admin.hospital_name}</span>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-orange-50 text-orange-700 border-orange-200 h-5 px-1.5 font-normal"
                >
                  Unassigned
                </Badge>
              )}
            </div>

            {/* Last Active Row */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 opacity-80">
              <Clock className="w-3.5 h-3.5" />
              <span>Active: {admin.last_active || "Never"}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
