export interface PatientProfile {
  id: string;
  patient_id: number;
  name: string;
  gender: "Male" | "Female" | "Other" | "";
  dob: string;
  is_minor: boolean;
  address: string;
  city: string;
  city_id: number | null;
  state: string;
  state_id: number | null;
  pincode: string;
  phone: string;
  email: string;
  bloodGroup: string;
  blood_group_id: number | null;
  allergies: string;
  chronicConditions: string;
  currentMedications: string;
  profileCompletion: number;
  avatarUrl: string | null;
  status: "Active" | "Inactive";
  emergencyContacts: EmergencyContact[];
}

export interface EmergencyContact {
  id: number;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
}