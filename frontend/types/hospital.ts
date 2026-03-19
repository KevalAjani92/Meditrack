export interface HospitalAdmin {
  id: string;
  name: string;
  email: string;
  assigned_hospital_id: string | null;
  assigned_hospital_name: string | null;
  avatar_initials: string;
}

export interface Hospital {
  hospital_id: number;
  hospital_group_id: number;

  hospital_code: string;
  hospital_name: string;

  registration_validity_months: number;

  receptionist_contact: string;

  opening_date: string; // ISO Date string

  address: string;
  pincode: string;

  city_id: number | null;
  city_name: string | null;

  state_id: number | null;
  state_name: string | null;

  description: string | null;

  registration_no: string | null;
  license_no: string | null;
  gst_no: string | null;

  contact_phone: string | null;
  contact_email: string | null;

  opening_time: string | null;   // Time string (HH:mm:ss)
  closing_time: string | null;

  is_24by7: boolean;
  is_active: boolean;

  admin_id: number | null;
  admin_name: string | null;

  created_by: number;
  modified_by: number;

  created_at: string;   // ISO timestamp
  modified_at: string;  // ISO timestamp
}

export const mockAdmins: HospitalAdmin[] = [
  { id: "1", name: "Dr. Alice Brown", email: "alice@apex.com", assigned_hospital_id: "hosp-1", assigned_hospital_name: "Apex Heart Institute", avatar_initials: "AB" },
  { id: "2", name: "Dr. Bob Smith", email: "bob@city.com", assigned_hospital_id: null, assigned_hospital_name: null, avatar_initials: "BS" },
  { id: "3", name: "Dr. Charlie Davis", email: "charlie@west.com", assigned_hospital_id: "hosp-2", assigned_hospital_name: "City West Clinic", avatar_initials: "CD" },
  { id: "4", name: "Sarah Connor", email: "sarah@free.com", assigned_hospital_id: null, assigned_hospital_name: null, avatar_initials: "SC" },
];

export const mockHospitals: Hospital[] = [
  {
    hospital_id: "hosp-1",
    hospital_code: "APEX-01",
    hospital_name: "Apex Heart Institute",
    city: "New York",
    state: "NY",
    contact_phone: "+1 555-0101",
    contact_email: "contact@apex.com",
    is_24by7: true,
    status: "Active",
    admin_id: "adm-1",
    admin_name: "Dr. Alice Brown",
    registration_no: "REG-998877",
    created_at: "2023-01-10",
  },
  {
    hospital_id: "hosp-2",
    hospital_code: "CITY-W",
    hospital_name: "City West Clinic",
    city: "Jersey City",
    state: "NJ",
    contact_phone: "+1 555-0202",
    contact_email: "info@citywest.com",
    is_24by7: false,
    opening_time: "08:00",
    closing_time: "20:00",
    status: "Active",
    admin_id: "adm-3",
    admin_name: "Dr. Charlie Davis",
    registration_no: "REG-112233",
    created_at: "2023-03-15",
  },
  {
    hospital_id: "hosp-3",
    hospital_code: "NORTH-GEN",
    hospital_name: "North General",
    city: "Yonkers",
    state: "NY",
    contact_phone: "+1 555-0303",
    contact_email: "admin@northgen.com",
    is_24by7: true,
    status: "Inactive",
    admin_id: null,
    admin_name: null,
    registration_no: "REG-445566",
    created_at: "2023-06-20",
  },
];