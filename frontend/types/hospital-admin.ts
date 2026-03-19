export interface HospitalAdmin {
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  profile_image_url: string | null;
  hospital_id: number | null;
  hospital_name: string | null;
  is_active: boolean;
  last_active: string;
  joined_date: string;
}

export interface HospitalOption {
  id: string;
  name: string;
  location: string;
  current_admin_id: string | null; // Null means available
}

export const mockHospitals: HospitalOption[] = [
  { id: "1", name: "Apex Heart Institute", location: "New York, NY", current_admin_id: "adm-1" },
  { id: "2", name: "City West Clinic", location: "Jersey City, NJ", current_admin_id: null }, // Available
  { id: "3", name: "North General", location: "Yonkers, NY", current_admin_id: "adm-3" },
  { id: "4", name: "Southside OPD", location: "Brooklyn, NY", current_admin_id: null }, // Available
];

export const mockAdmins: HospitalAdmin[] = [
  {
    id: "adm-1",
    name: "Dr. Alice Brown",
    email: "alice@apex.com",
    avatar_initials: "AB",
    hospital_id: "h1",
    hospital_name: "Apex Heart Institute",
    status: "Active",
    last_active: "10 mins ago",
    joined_date: "2023-01-10",
  },
  {
    id: "adm-2",
    name: "John Doe",
    email: "john.d@citywest.com",
    avatar_initials: "JD",
    hospital_id: null,
    hospital_name: null,
    status: "Active",
    last_active: "2 days ago",
    joined_date: "2023-02-15",
  },
  {
    id: "adm-3",
    name: "Sarah Connor",
    email: "s.connor@northgen.com",
    avatar_initials: "SC",
    hospital_id: "h3",
    hospital_name: "North General",
    status: "Inactive",
    last_active: "1 month ago",
    joined_date: "2022-11-20",
  },
];