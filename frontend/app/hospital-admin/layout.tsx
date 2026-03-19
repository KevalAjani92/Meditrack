"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { RoleGuard } from "@/components/auth/role-guard";

export default function HospitalAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["HospitalAdmin"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </RoleGuard>
  );
}
