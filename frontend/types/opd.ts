export type VisitType = "Scheduled" | "Walk-In" | "Emergency" | "Follow-Up";

export interface Patient {
  id: string;
  patientNo:string;
  name: string;
  phone: string;
  age: number;
  gender: string;
  bloodGroup: string;
  allergies: string;
  chronicConditions: string;
  lastVisit: string;
}

export interface Doctor {
  id: string;
  name: string;
  department: string;
  queueCount: number;
  status: "Active" | "On Break" | "Closed";
}

export interface Appointment {
  id: string;
  appointmentNo: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: string;
}

export interface PastOpd {
  opdId:number;
  opdNo: string;
  date: string;
  doctorId: string;
  doctorName: string;
  diagnosis: string;
}

// --- EXPANDED MOCK DATA ---
export const mockPatients: Patient[] = [
  { id: "PT-1001", name: "John Doe", phone: "+1 555-0100", age: 45, gender: "Male", bloodGroup: "O+", allergies: "None", chronicConditions: "Hypertension", lastVisit: "2023-11-15" },
  { id: "PT-1002", name: "Jane Smith", phone: "+1 555-0101", age: 32, gender: "Female", bloodGroup: "A-", allergies: "Penicillin", chronicConditions: "Asthma", lastVisit: "2024-01-05" },
  { id: "PT-1003", name: "Michael Johnson", phone: "+1 555-0102", age: 58, gender: "Male", bloodGroup: "B+", allergies: "Dust", chronicConditions: "Diabetes Type 2", lastVisit: "2024-02-10" },
  { id: "PT-1004", name: "Emily Davis", phone: "+1 555-0103", age: 28, gender: "Female", bloodGroup: "AB+", allergies: "None", chronicConditions: "None", lastVisit: "2023-09-22" },
  { id: "PT-1005", name: "Robert Wilson", phone: "+1 555-0104", age: 65, gender: "Male", bloodGroup: "O-", allergies: "Sulfa Drugs", chronicConditions: "Arthritis", lastVisit: "2024-01-30" },
  { id: "PT-1006", name: "Sarah Connor", phone: "+1 555-0105", age: 40, gender: "Female", bloodGroup: "A+", allergies: "Latex", chronicConditions: "None", lastVisit: "2023-12-11" },
  { id: "PT-1007", name: "John Doe", phone: "+1 555-0100", age: 45, gender: "Male", bloodGroup: "O+", allergies: "None", chronicConditions: "Hypertension", lastVisit: "2023-11-15" },
  { id: "PT-1008", name: "Jane Smith", phone: "+1 555-0101", age: 32, gender: "Female", bloodGroup: "A-", allergies: "Penicillin", chronicConditions: "Asthma", lastVisit: "2024-01-05" },
  { id: "PT-1009", name: "Michael Johnson", phone: "+1 555-0102", age: 58, gender: "Male", bloodGroup: "B+", allergies: "Dust", chronicConditions: "Diabetes Type 2", lastVisit: "2024-02-10" },
  { id: "PT-1010", name: "Emily Davis", phone: "+1 555-0103", age: 28, gender: "Female", bloodGroup: "AB+", allergies: "None", chronicConditions: "None", lastVisit: "2023-09-22" },
  { id: "PT-1011", name: "Robert Wilson", phone: "+1 555-0104", age: 65, gender: "Male", bloodGroup: "O-", allergies: "Sulfa Drugs", chronicConditions: "Arthritis", lastVisit: "2024-01-30" },
  { id: "PT-1012", name: "Sarah Connor", phone: "+1 555-0105", age: 40, gender: "Female", bloodGroup: "A+", allergies: "Latex", chronicConditions: "None", lastVisit: "2023-12-11" },
];

export const mockDoctors: Doctor[] = [
  { id: "DOC-01", name: "Dr. Alice Brown", department: "Cardiology", queueCount: 4, status: "Active" },
  { id: "DOC-02", name: "Dr. Robert Fox", department: "General Medicine", queueCount: 12, status: "Active" },
  { id: "DOC-03", name: "Dr. Emily Chen", department: "Orthopedics", queueCount: 0, status: "On Break" },
  { id: "DOC-04", name: "Dr. James Wilson", department: "Neurology", queueCount: 2, status: "Active" },
  { id: "DOC-05", name: "Dr. Sarah Smith", department: "Pediatrics", queueCount: 5, status: "Active" },
  { id: "DOC-06", name: "Dr. Michael Taylor", department: "Dermatology", queueCount: 0, status: "Closed" },
];

const today = new Date().toISOString().split('T')[0];

export const mockAppointments: Appointment[] = [
  { id: "APT-8891", appointmentNo: "APT-8891", patientId: "PT-1001", doctorId: "DOC-01", date: today, time: "10:30 AM", status: "Scheduled" },
  { id: "APT-8892", appointmentNo: "APT-8892", patientId: "PT-1002", doctorId: "DOC-02", date: today, time: "11:00 AM", status: "Scheduled" },
  { id: "APT-8893", appointmentNo: "APT-8893", patientId: "PT-1004", doctorId: "DOC-05", date: today, time: "01:15 PM", status: "Scheduled" },
  { id: "APT-8894", appointmentNo: "APT-8894", patientId: "PT-1006", doctorId: "DOC-04", date: today, time: "03:45 PM", status: "Scheduled" },
];

export const mockPastOpds: PastOpd[] = [
  { opdNo: "OPD-7721", date: "2023-11-15", doctorId: "DOC-01", doctorName: "Dr. Alice Brown", diagnosis: "Essential Hypertension" },
  { opdNo: "OPD-7802", date: "2024-01-05", doctorId: "DOC-02", doctorName: "Dr. Robert Fox", diagnosis: "Viral Fever" },
  { opdNo: "OPD-7855", date: "2024-02-10", doctorId: "DOC-04", doctorName: "Dr. James Wilson", diagnosis: "Migraine" },
];