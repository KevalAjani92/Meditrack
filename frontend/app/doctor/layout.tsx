"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { RoleGuard } from "@/components/auth/role-guard";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["Doctor"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </RoleGuard>
  );
}
