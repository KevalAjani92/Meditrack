export interface GroupAdmin {
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  profile_image_url: string | null;

  employee_id: number;
  hospital_group_id: number | null;
  group_name: string | null;

  is_active: boolean; // from users table
  joined_date: string; // employees.joining_date
  last_login_at: string | null;
}

export const mockAdmins: GroupAdmin[] = [
  {
    id: "adm-1",
    name: "Dr. Sarah Smith",
    email: "sarah.smith@apex.health",
    phone_number: "+1 (555) 123-4567",
    profileImageUrl: null,
    group_id: "grp-1",
    groupName: "Apex Healthcare Systems",
    status: "Active",
    lastActive: "2 hours ago",
    joinedDate: "2023-01-15",
  },
  {
    id: "adm-2",
    name: "James Wilson",
    email: "j.wilson@citycare.com",
    profileImageUrl: null,
    group_id: null,
    groupName: null,
    status: "Inactive",
    lastActive: "5 days ago",
    joinedDate: "2023-03-10",
  },
  {
    id: "adm-3",
    name: "Elena Rodriguez",
    email: "elena@green.com",
    profileImageUrl: null,
    group_id: "grp-2",
    groupName: "Green Valley Medical Network",
    status: "Active",
    lastActive: "30 mins ago",
    joinedDate: "2023-06-22",
  },
  {
    id: "adm-4",
    name: "Michael Lee",
    email: "michael.lee@blue.com",
    profileImageUrl: null,
    group_id: null,
    groupName: null,
    status: "Suspended",
    lastActive: "1 hour ago",
    joinedDate: "2023-07-15",
  },
  {
    id: "adm-5",
    name: "Dr. Priya Sharma",
    email: "priya.sharma@sunrise.com",
    profileImageUrl: null,
    group_id: null,
    groupName: null,
    status: "Active",
    lastActive: "10 mins ago",
    joinedDate: "2023-08-01",
  },
];
