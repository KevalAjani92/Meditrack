export interface Doctor {
  doctor_id: number;
  user_id: number;
  doctor_name: string;
  email: string;
  phone_number: string;
  profile_image_url?: string;
  department_id: number;
  department_name: string;
  specialization_id: number;
  specialization: string;
  gender: "Male" | "Female" | "Other";
  qualification: string;
  experience_years: number;
  consultation_fees: number;
  medical_license_no: string;
  availability: "Available" | "Unavailable";
  status: "Active" | "Inactive";
  description?: string;
  joined_date: string;
  avatar_initials: string;
}

export interface DepartmentDropdown {
  department_id: number;
  department_name: string;
}

export interface SpecializationDropdown {
  specialization_id: number;
  specialization_name: string;
}

export interface DoctorStats {
  totalDoctors: number;
  availableDoctors: number;
  unavailableDoctors: number;
  departmentsCovered: number;
}