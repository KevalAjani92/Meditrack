"use client";

import { DashboardView } from "@/components/modules/dashboard/dashboard-view";
import { UserRole } from "@/context/auth-context";

export default function DashboardPage() {
  // Allow all admin types to access the main admin dashboard path
  // Granular permissions will be handled inside specific modules if needed
  const adminRoles: UserRole[] = ['HospitalAdmin'];
  return <DashboardView allowedRoles={adminRoles} />;
}
