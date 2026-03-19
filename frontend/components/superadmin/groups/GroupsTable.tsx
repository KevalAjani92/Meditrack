"use client";

import { HospitalGroup } from "@/types/groups";
import GroupActionsMenu from "./GroupActionsMenu";
import { BadgeCheck, AlertCircle, XCircle, User } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge"; // Ensure correct import path

interface GroupsTableProps {
  data: HospitalGroup[];
  onEdit: (group: HospitalGroup) => void;
  onAssignAdmin: (group: HospitalGroup) => void;
}

export default function GroupsTable({ data, onEdit, onAssignAdmin }: GroupsTableProps) {
  return (
    <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Group Name</th>
              <th className="px-6 py-4">Admin</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Subscription</th>
              <th className="px-6 py-4">Hospitals</th>
              <th className="px-6 py-4">Created Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((group) => (
              <tr key={group.group_id} className="hover:bg-muted/10 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{group.group_name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-mono">
                     {group.group_code}
                  </div>
                </td>
                <td className="px-6 py-4">
                   {group.adminName ? (
                      <Badge variant="outline" className="gap-1 font-normal">
                         <User className="w-3 h-3 opacity-70" />
                         {group.adminName}
                      </Badge>
                   ) : (
                      <Badge variant="secondary" className="font-normal opacity-70">
                         Unassigned
                      </Badge>
                   )}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={group.status} />
                </td>
                <td className="px-6 py-4">
                  <SubscriptionBadge status={group.subscriptionStatus || "Active"} />
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {group.hospitalCount} Units
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(group.createdAt).toLocaleString(undefined, { dateStyle: "medium" })}
                </td>
                <td className="px-6 py-4 text-right">
                  <GroupActionsMenu 
                    group={group} 
                    onAssignAdmin={() => onAssignAdmin(group)} 
                    onEdit={() => onEdit(group)} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SubscriptionBadge({ status }: { status: string }) {
  if (status === "Active") return <span className="text-success flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5" /> Valid</span>;
  if (status === "Expiring Soon") return <span className="text-warning flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Expiring</span>;
  return <span className="text-destructive flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" /> Expired</span>;
}