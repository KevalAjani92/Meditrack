"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Staff } from "@/types/hospital-monitor";

export default function StaffTab({ data }: { data: Staff[] }) {
  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Joined Date</th>
            <th className="px-6 py-4 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((staff) => (
            <tr key={staff.id} className="hover:bg-muted/5 transition-colors">
              <td className="px-6 py-4 font-medium text-foreground">{staff.name}</td>
              <td className="px-6 py-4 text-muted-foreground">{staff.role}</td>
              <td className="px-6 py-4 text-muted-foreground">{staff.joined_date}</td>
              <td className="px-6 py-4 text-right">
                <Badge variant={staff.status === "Active" ? "outline" : "secondary"}>
                  {staff.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}