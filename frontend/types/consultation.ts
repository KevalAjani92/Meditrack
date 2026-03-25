export interface PatientEMR {
  id: string;
  patientId: number;
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
  id: number;
  diagnosisId?: number;
  name: string;
  code: string;
  department: string;
  isPrimary: boolean;
  remarks: string;
}

export interface Procedure {
  id: number;
  procedureId?: number;
  name: string;
  code: string;
  date: string;
  remarks: string;
}

export interface Prescription {
  id: number;
  prescriptionId?: number;
  medicineId?: number;
  medicineName: string;
  dosage: string;
  quantity: number;
  durationDays: number;
  instructions: string;
  timing: string;
}

export interface TestOrder {
  id: number;
  testId?: number;
  testName: string;
  code: string;
  status: "Ordered" | "Sample Collected" | "Completed" | "Cancelled";
  remarks: string;
}

export interface FollowUp {
  id: number;
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
  id: number;
  opdNo?: string;
  date: string;
  doctor: string;
  department: string;
  diagnoses: string[];
  procedures: string[];
  tests: string[];
  prescriptions: string[];
}
