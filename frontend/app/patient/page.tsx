"use client";

import { DashboardView } from "@/components/modules/dashboard/dashboard-view";

export default function PatientDashboardPage() {
    return <DashboardView allowedRoles={['Patient']} />;
}
