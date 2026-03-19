"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import GroupProfileCard from "@/components/superadmin/groups/detail/GroupProfileCard";
import GroupAdminCard from "@/components/superadmin/groups/detail/GroupAdminCard";
import SubscriptionTimeline from "@/components/superadmin/groups/detail/SubscriptionTimeline";
import GroupHospitalsTable from "@/components/superadmin/groups/detail/GroupHospitalsTable";
import { GroupDetail } from "@/types/groups";
import React from "react";

// --- Mock Data Fetcher ---
const getGroupDetails = (id: string): GroupDetail => {
  return {
    id,
    name: "Apex Healthcare Systems",
    status: "Active",
    createdAt: "Jan 15, 2023",
    totalHospitals: 4,
    totalUsers: 450,
    admin: {
      name: "Dr. Sarah Smith",
      email: "sarah.smith@apex.health",
      role: "Super Admin",
      lastActive: "2 hours ago",
      avatarInitials: "SS",
    },
    subscription: {
      plan: "Enterprise",
      status: "Active",
      startDate: "2023-01-01",
      endDate: "2024-01-01",
    },
    hospitals: [
      { id: "h1", name: "Apex General", location: "New York, NY", status: "Active", usersCount: 200, joinedAt: "Jan 20, 2023" },
      { id: "h2", name: "Apex West", location: "Jersey City, NJ", status: "Active", usersCount: 120, joinedAt: "Feb 10, 2023" },
      { id: "h3", name: "Apex Clinic", location: "Brooklyn, NY", status: "Inactive", usersCount: 10, joinedAt: "Mar 05, 2023" },
      { id: "h4", name: "Apex North", location: "Queens, NY", status: "Active", usersCount: 120, joinedAt: "Apr 12, 2023" },
    ],
  };
};

export default function GroupDetailsPage({ params }: { params: { groupId: string } }) {
  // In real app: useQuery or server component fetch
  const { groupId } = React.use(params) as { groupId: string };
  const data = getGroupDetails(groupId);

  return (
    <main className="min-h-screen bg-background p-6 space-y-6">
      
      {/* 1. Navigation Header */}
      <div className="flex items-center gap-2 mb-2">
        <Link 
          href="/super-admin/groups" 
          className="p-2 -ml-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Group Details</span>
          <h1 className="text-2xl font-bold text-foreground">{data.name}</h1>
        </div>
      </div>

      {/* 2. Top Grid: Identity & Ownership */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[280px]">
        <GroupProfileCard group={data} />
        <GroupAdminCard admin={data.admin} />
      </div>

      {/* 3. Subscription Status */}
      <SubscriptionTimeline subscription={data.subscription} />

      {/* 4. Operational Data (Table) */}
      <GroupHospitalsTable hospitals={data.hospitals} />
      
    </main>
  );
}