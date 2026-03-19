export interface Receptionist {
  user_id: number;
  employee_id?: number;
  name: string;
  email: string;
  phone: string;
  profile_image_url?: string;
  status: "Active" | "Inactive";
  joined_date: string;
  last_active: string;
  avatar_initials: string;
}

export interface ReceptionistStats {
  totalReceptionists: number;
  activeReceptionists: number;
  inactiveReceptionists: number;
  recentlyAdded: number;
}