export type VisitType = "Appointment" | "Walk-In" | "Emergency";
export type TokenStatus = "Waiting" | "In Progress" | "Completed" | "Skipped" | "No-Show";

export interface PatientMedicalInfo {
  bloodGroup: string;
  allergies: string;
  chronicConditions: string;
  lastVisit: string;
}

export interface OpdToken {
  id: number;
  tokenNo: string;
  opdId: number | null;
  patientName: string;
  age: number;
  gender: string;
  visitType: VisitType;
  apptNo?: string;
  chiefComplaint: string;
  issueTime: string; // e.g., "09:00 AM"
  waitTimeMins: number;
  status: TokenStatus;
  isEmergency: boolean;
  medicalInfo: PatientMedicalInfo;
}

export interface TimelineEvent {
  id: string;
  time: string;
  message: string;
  type: "Start" | "Complete" | "Skip" | "System";
}