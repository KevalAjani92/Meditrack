"use client";

import { DashboardView } from "@/components/modules/dashboard/dashboard-view";

export default function DoctorDashboardPage() {
    return <DashboardView allowedRoles={['Doctor']} />;
}
