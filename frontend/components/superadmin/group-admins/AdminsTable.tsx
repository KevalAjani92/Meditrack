"use client";

import Image from "next/image";
import { GroupAdmin } from "@/types/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/StatusBadge"; // Reuse Common Component
import AdminActionsMenu from "./AdminActionsMenu";
import { Building2, Clock } from "lucide-react";

interface AdminsTableProps {
  data: GroupAdmin[];
  onEdit: (admin: GroupAdmin) => void;
  onAssign: (admin: GroupAdmin) => void;
}

export default function AdminsTable({
  data,
  onEdit,
  onAssign,
}: AdminsTableProps) {
  return (
    <Card className="overflow-hidden border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Admin Name</th>
              <th className="px-6 py-4">Assigned Group</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Active</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((admin) => (
              <tr
                key={admin.user_id}
                className="hover:bg-muted/10 transition-colors"
              >
                {/* Name & Email */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar Container */}
                    <div className="w-9 h-9 rounded-full bg-secondary overflow-hidden flex items-center justify-center border border-border shrink-0">
                      <Image
                        src={
                          admin.profile_image_url || "/avatar_1.png"
                        }
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

                {/* Assigned Group */}
                <td className="px-6 py-4">
                  {admin.group_name ? (
                    <div className="flex items-center gap-2 text-foreground">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                      {admin.group_name}
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

                {/* Status */}
                <td className="px-6 py-4">
                  <StatusBadge status={admin.is_active ? "Active" : "Inactive"} />
                </td>

                {/* Last Active */}
                <td className="px-6 py-4 text-muted-foreground">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    {admin.last_login_at || "Never"}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <AdminActionsMenu
                    admin={admin}
                    onAssign={() => onAssign(admin)}
                    onEdit={() => onEdit(admin)}
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
