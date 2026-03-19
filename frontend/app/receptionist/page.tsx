"use client";

import { DashboardView } from "@/components/modules/dashboard/dashboard-view";

export default function ReceptionistDashboardPage() {
    return <DashboardView allowedRoles={['Receptionist']} />;
}
