"use client";

import { HospitalGroup } from "@/types/groups";
import { Building2, Users, User } from "lucide-react";
import GroupActionsMenu from "./GroupActionsMenu";
import { Badge } from "@/components/ui/badge"; // Ensure correct import path

interface GroupsCardGridProps {
  data: HospitalGroup[];
  onEdit: (group: HospitalGroup) => void;
  onAssignAdmin: (group: HospitalGroup) => void;
}

export default function GroupsCardGrid({ data, onEdit, onAssignAdmin }: GroupsCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.map((group) => (
        <div
          key={group.group_id}
          className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0 pr-3">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-2.5 h-2.5 flex-shrink-0 rounded-full ${
                    group.status === "Active"
                      ? "bg-success"
                      : "bg-muted-foreground"
                  }`}
                />
                <h3 className="font-semibold text-foreground truncate" title={group.group_name}>
                  {group.group_name}
                </h3>
              </div>
              <div className="text-xs text-muted-foreground font-mono mb-2">
                {group.group_code}
              </div>
              
              {/* Admin Badge Section */}
              <div className="mt-2">
                {group.adminName ? (
                    <Badge variant="outline" className="gap-1.5 py-0.5 px-2 font-normal text-xs">
                        <User className="w-3 h-3 opacity-60" />
                        {group.adminName}
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="py-0.5 px-2 font-normal text-xs opacity-70">
                        Unassigned
                    </Badge>
                )}
              </div>
            </div>
            <GroupActionsMenu group={group} onAssignAdmin={() => onAssignAdmin(group)} onEdit={() => onEdit(group)} />
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-border my-auto">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">Hospitals</p>
                <p className="font-semibold">{group.hospitalCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg text-secondary-foreground shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">Users</p>
                <p className="font-semibold">{group.userCount}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs mt-4 pt-1">
            <span
              className={`px-2 py-1 rounded-md font-medium ${
                group.subscriptionStatus === "Active"
                  ? "bg-success/10 text-success"
                  : group.subscriptionStatus === "Expiring Soon"
                    ? "bg-warning/10 text-warning"
                    : "bg-destructive/10 text-destructive"
              }`}
            >
              {group.subscriptionStatus}
            </span>
            <span className="text-muted-foreground truncate ml-2">
              Ends: {new Date(group.subscriptionEndDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}