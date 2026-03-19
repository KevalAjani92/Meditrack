export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  status: "Active" | "Inactive" | "On Leave";
  appointment_load: number; // percentage
  patients_today: number;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  status: "Active" | "Inactive";
  joined_date: string;
}

export interface DepartmentSummary {
  id: string;
  name: string;
  code: string;
  diagnosis_count: number;
  treatment_count: number;
  test_count: number;
  preview_items: { code: string; name: string }[];
}

export interface HospitalDetails {
  id: string;
  name: string;
  reg_id: string;
  address: string;
  contact_phone: string;
  contact_email: string;
  status: "Active" | "Inactive";
  subscription_status: "Active" | "Expiring Soon" | "Expired";
  admin_name: string;
  created_at: string;
  stats: {
    doctors: number;
    staff: number;
    patients: number;
    appointments_today: number;
    revenue_month: string;
    active_departments: number;
  };
}

// --- Mock Data ---
export const mockHospital: HospitalDetails = {
  id: "h1",
  name: "Apex Heart Institute",
  reg_id: "REG-998877",
  address: "123 Healthcare Ave, New York, NY 10001",
  contact_phone: "+1 555-0101",
  contact_email: "admin@apexheart.com",
  status: "Active",
  subscription_status: "Expiring Soon",
  admin_name: "Dr. Alice Brown",
  created_at: "Jan 10, 2023",
  stats: {
    doctors: 24,
    staff: 12,
    patients: 8540,
    appointments_today: 145,
    revenue_month: "$145,000",
    active_departments: 6,
  },
};

export const mockDoctors: Doctor[] = [
  { id: "d1", name: "Dr. Sarah Smith", specialization: "Cardiology", status: "Active", appointment_load: 85, patients_today: 12 },
  { id: "d2", name: "Dr. James Wilson", specialization: "Neurology", status: "On Leave", appointment_load: 0, patients_today: 0 },
  { id: "d3", name: "Dr. Emily Chen", specialization: "General Medicine", status: "Active", appointment_load: 60, patients_today: 8 },
  { id: "d4", name: "Dr. Robert Fox", specialization: "Orthopedics", status: "Inactive", appointment_load: 0, patients_today: 0 },
];

export const mockStaff: Staff[] = [
  { id: "s1", name: "Linda Johnson", role: "Head Receptionist", status: "Active", joined_date: "2023-02-01" },
  { id: "s2", name: "Mark Taylor", role: "Front Desk", status: "Active", joined_date: "2023-05-15" },
  { id: "s3", name: "Susan Lee", role: "Billing Coordinator", status: "Inactive", joined_date: "2022-11-20" },
];

export const mockDepartments: DepartmentSummary[] = [
  {
    id: "dept1",
    name: "Cardiology",
    code: "CARD",
    diagnosis_count: 45,
    treatment_count: 12,
    test_count: 28,
    preview_items: [
      { code: "I10", name: "Hypertension" },
      { code: "I20", name: "Angina Pectoris" },
      { code: "CABG", name: "Bypass Surgery" },
    ],
  },
  {
    id: "dept2",
    name: "Orthopedics",
    code: "ORTHO",
    diagnosis_count: 32,
    treatment_count: 8,
    test_count: 15,
    preview_items: [
      { code: "M16", name: "Osteoarthritis" },
      { code: "THR", name: "Hip Replacement" },
    ],
  },
];