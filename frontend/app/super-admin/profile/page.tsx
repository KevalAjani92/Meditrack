"use client";

import { ProfileView } from "@/components/modules/settings/profile-view";

export default function SuperAdminProfilePage() {
    return <ProfileView allowedRoles={['SuperAdmin']} />;
}
