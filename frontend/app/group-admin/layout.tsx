"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { RoleGuard } from "@/components/auth/role-guard";

export default function GroupAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["GroupAdmin"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </RoleGuard>
  );
}
