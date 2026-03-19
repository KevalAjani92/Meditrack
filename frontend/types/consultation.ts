export interface PatientEMR {
  id: string;
  name: string;
  age: number;
  gender: string;
  dob: string;
  type: "Walk-In" | "Registered";
  phone: string;
  email: string;
  city: string;
  address: string;
  bloodGroup: string;
  allergies: string;
  chronicConditions: string;
  currentMedications: string;
  tokenNo: string;
  visitTime: string;
}

export interface Diagnosis {
  id: string;
  name: string;
  code: string;
  department: string;
  isPrimary: boolean;
  remarks: string;
}
export interface Procedure {
  id: string;
  name: string;
  code: string;
  date: string;
  remarks: string;
}
export interface Prescription {
  id: string;
  medicineName: string;
  dosage: string;
  quantity: number;
  durationDays: number;
  instructions: string;
  timing: string;
}
export interface TestOrder {
  id: string;
  testName: string;
  code: string;
  status: "Ordered" | "Sample Collected" | "Completed" | "Cancelled";
  remarks: string;
}
export interface FollowUp {
  id: string;
  date: string;
  reason: string;
  status: "Pending" | "Completed" | "Missed";
}

export interface ConsultationData {
  chiefComplaint: string;
  clinicalNotes: string;
  adviceNotes: string;
  diagnoses: Diagnosis[];
  procedures: Procedure[];
  prescriptions: Prescription[];
  tests: TestOrder[];
  followUps: FollowUp[];
}

export interface PastVisit {
  id: string;
  date: string;
  doctor: string;
  department: string;
  diagnoses: string[];
  procedures:string[];
  tests:string[];
  prescriptions: string[];
}

export const mockPatientEMR: PatientEMR = {
  id: "PT-10024",
  name: "Rahul Sharma",
  age: 45,
  gender: "Male",
  dob: "1981-05-12",
  type: "Registered",
  phone: "+91 9876543210",
  email: "rahul@example.com",
  city: "Mumbai",
  address: "123, Sea View Apts, Bandra",
  bloodGroup: "O+",
  allergies: "Penicillin, Peanuts",
  chronicConditions: "Hypertension, Type 2 Diabetes",
  currentMedications: "Amlodipine 5mg",
  tokenNo: "T-14",
  visitTime: "10:30 AM",
};

export const mockPastVisits: PastVisit[] = [
  {
    id: "v1",
    date: "2025-11-15",
    doctor: "Dr. Alice Brown",
    department: "Cardiology",
    diagnoses: ["Essential Hypertension"],
    prescriptions: ["Amlodipine 5mg", "Aspirin 75mg"],
    procedures: ["ECG - Electrocardiogram"], // New array
    tests: ["Lipid Profile", "Complete Blood Count (CBC)"], // New array
  },
  {
    id: "v2",
    date: "2025-06-10",
    doctor: "Dr. Robert Fox",
    department: "General Medicine",
    diagnoses: ["Viral Fever"],
    prescriptions: ["Paracetamol 500mg"],
    procedures: [],
    tests: [],
  },
];
