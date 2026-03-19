"use client";

import { ProfileView } from "@/components/modules/settings/profile-view";

export default function HospitalAdminProfilePage() {
    return <ProfileView allowedRoles={['HospitalAdmin']} />;
}
