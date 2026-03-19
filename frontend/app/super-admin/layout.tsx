"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { RoleGuard } from "@/components/auth/role-guard";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["SuperAdmin"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </RoleGuard>
  );
}
