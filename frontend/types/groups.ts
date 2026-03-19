export type GroupStatus = "Active" | "Inactive" | "Suspended";
export type SubscriptionStatus = "Active" | "Expiring Soon" | "Expired";

export interface GroupAdmin {
  id: string;
  name: string;
  email: string;
  assigned_group_id: string | null;
  assigned_group_name: string | null;
  avatar_initials: string;
}

export interface HospitalGroup {
  // --- Existing Fields ---
  group_id: number;
  group_name: string;
  admin_id: number | null;
  adminName: string | null;
  hospitalCount: number;
  userCount: number;
  status: GroupStatus;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionEndDate: string;
  createdAt: string;

  // --- New Fields ---
  group_code: string;
  description: string;
  registration_no: string;
  contact_phone: string;
  contact_email: string;
}

// Mock data helper (optional, for AssignAdminModal)
export const mockGroupAdmins = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar_initials: "JD",
    assigned_group_id: "g1",
    assigned_group_name: "Apex",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar_initials: "JS",
    assigned_group_id: null,
  },
  {
    id: "3",
    name: "Robert Fox",
    email: "robert@example.com",
    avatar_initials: "RF",
    assigned_group_id: "g2",
    assigned_group_name: "City Care",
  },
];
export const mockGroups: HospitalGroup[] = [
  {
    id: "grp-1",
    name: "Apex Healthcare Systems",
    admin_id: "adm-1",
    adminName: "Dr. Sarah Smith",
    hospitalCount: 12,
    userCount: 450,
    status: "Active",
    subscriptionStatus: "Active",
    subscriptionEndDate: "2025-12-01",
    createdAt: "2023-01-15",
  },
  {
    id: "grp-2",
    name: "Green Valley Medical Network",
    admin_id: "adm-3",
    adminName: "Elena Rodriguez",
    hospitalCount: 8,
    userCount: 310,
    status: "Active",
    subscriptionStatus: "Expiring Soon",
    subscriptionEndDate: "2026-03-01",
    createdAt: "2023-06-22",
  },
  {
    id: "grp-3",
    name: "City Care Alliance",
    admin_id: null,
    adminName: null,
    hospitalCount: 5,
    userCount: 120,
    status: "Inactive",
    subscriptionStatus: "Expired",
    subscriptionEndDate: "2023-11-20",
    createdAt: "2023-03-10",
  },
  {
    id: "grp-4",
    name: "Blue Cross Hospitals Group",
    admin_id: null,
    adminName: null,
    hospitalCount: 6,
    userCount: 180,
    status: "Suspended",
    subscriptionStatus: "Expired",
    subscriptionEndDate: "2024-02-15",
    createdAt: "2023-08-05",
  },
  {
    id: "grp-5",
    name: "Sunrise Medical Consortium",
    admin_id: null,
    adminName: null,
    hospitalCount: 10,
    userCount: 390,
    status: "Active",
    subscriptionStatus: "Active",
    subscriptionEndDate: "2026-09-30",
    createdAt: "2024-01-12",
  },
  {
    id: "grp-6",
    name: "Harmony Health Network",
    admin_id: null,
    adminName: null,
    hospitalCount: 4,
    userCount: 95,
    status: "Active",
    subscriptionStatus: "Expiring Soon",
    subscriptionEndDate: "2026-05-10",
    createdAt: "2024-04-18",
  },
];

export interface GroupDetail {
  id: string;
  name: string;
  status: "Active" | "Inactive" | "Suspended";
  createdAt: string;
  totalHospitals: number;
  totalUsers: number;
  admin: {
    name: string;
    email: string;
    role: string;
    lastActive: string;
    avatarInitials: string;
  } | null;
  subscription: {
    plan: "Enterprise" | "Standard";
    startDate: string;
    endDate: string;
    status: "Active" | "Expiring Soon" | "Expired";
  };
  hospitals: Array<{
    id: string;
    name: string;
    location: string;
    status: "Active" | "Inactive";
    usersCount: number;
    joinedAt: string;
  }>;
}
