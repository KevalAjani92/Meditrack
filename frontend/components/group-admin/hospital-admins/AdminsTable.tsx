"use client";

import { HospitalAdmin } from "@/types/hospital-admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Clock } from "lucide-react";
import AdminActionsMenu from "./AdminActionsMenu";
import Image from "next/image";
import { StatusBadge } from "@/components/common/StatusBadge";

interface AdminsTableProps {
  data: HospitalAdmin[];
  onView: (admin: HospitalAdmin) => void;
  onEdit: (admin: HospitalAdmin) => void;
  onAssign: (admin: HospitalAdmin) => void;
}

export default function AdminsTable({
  data,
  onView,
  onEdit,
  onAssign,
}: AdminsTableProps) {
  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Admin Name</th>
              <th className="px-6 py-4">Assigned Hospital</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Active</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((admin) => (
              <tr
                key={admin.user_id}
                onClick={() => onView(admin)}
                className={`transition-colors cursor-pointer group ${
                  admin.is_active
                    ? "hover:bg-muted/10"
                    : "bg-muted/5 opacity-70"
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar Container */}
                    <div className="w-9 h-9 rounded-full bg-secondary overflow-hidden flex items-center justify-center border border-border shrink-0">
                      <Image
                        src={admin.profile_image_url || "/avatar_1.png"}
                        alt={admin.full_name}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {admin.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {admin.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {admin.hospital_name ? (
                    <div className="flex items-center gap-2 text-foreground">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                      {admin.hospital_name}
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
                  <StatusBadge status={admin.is_active ? "Active" : "Inactive"} />
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    {admin.last_active || "Never"}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div onClick={(e) => e.stopPropagation()}>
                    <AdminActionsMenu
                      admin={admin}
                      onView={() => onView(admin)}
                      onEdit={() => onEdit(admin)}
                      onAssign={() => onAssign(admin)}
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
