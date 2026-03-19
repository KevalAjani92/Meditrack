"use client";

import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { GroupDetail } from "@/types/groups";

export default function GroupHospitalsTable({ hospitals }: { hospitals: GroupDetail["hospitals"] }) {
  if (hospitals.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <p className="text-muted-foreground">No hospitals added to this group yet.</p>
      </Card>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.3 }}
    >
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/20">
          <h3 className="font-semibold text-foreground">Associated Hospitals</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Hospital Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Users</th>
                <th className="px-6 py-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {hospitals.map((hospital) => (
                <tr key={hospital.id} className="hover:bg-muted/10 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {hospital.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {hospital.location}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={hospital.status} />
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {hospital.usersCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {hospital.joinedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}