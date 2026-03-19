/** Types aligned with backend API response shapes */

export interface Hospital {
  hospital_id: number;
  hospital_name: string;
  address: string;
  city_name: string | null;
  state_name: string | null;
  pincode: string;
  contact_phone: string | null;
  opening_time: string | null;
  closing_time: string | null;
  is_24by7: boolean;
}

export interface Department {
  department_id: number;
  department_name: string;
  department_code: string;
  description: string | null;
}

export interface Doctor {
  doctor_id: number;
  name: string;
  specialization: string;
  experience: number;
  fee: number;
  available: boolean;
  avatar: string;
  profile_image_url: string | null;
}

export interface TimeSlot {
  time: string;
  capacity: number;
  is_full: boolean;
}

export interface DoctorAvailability {
  doctor_id: number;
  date: string;
  is_available: boolean;
  max_appointments?: number;
  slots: TimeSlot[];
}

export interface BookingResult {
  appointment_id: number;
  appointment_no: string;
  appointment_date: string;
  appointment_time: string;
  appointment_status: string;
  hospital_name: string;
  doctor_name: string;
  department: string;
  specialization: string;
  remarks: string | null;
}
