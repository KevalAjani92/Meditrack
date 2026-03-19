"use client";

import { ProfileView } from "@/components/modules/settings/profile-view";

export default function GroupAdminProfilePage() {
    return <ProfileView allowedRoles={['GroupAdmin']} />;
}
