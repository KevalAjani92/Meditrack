export interface Department {
  department_id: number;
  department_code: string;
  department_name: string;
  description: string;
  created_at: string; 
}

export interface HospitalDepartment extends Department{
  hospital_department_id:number;
  isActive:boolean;
}

export const mockDepartments: Department[] = [
  { department_id: "1", department_code: "CARD", department_name: "Cardiology", description: "Heart and cardiovascular care", created_at: "2023-08-15T10:00:00Z" },
  { department_id: "2", department_code: "NEUR", department_name: "Neurology", description: "Brain and nervous system disorders", created_at: "2023-09-01T14:30:00Z" },
  { department_id: "3", department_code: "PED", department_name: "Pediatrics", description: "Infants, children, and adolescents", created_at: "2023-10-12T09:15:00Z" },
  { department_id: "4", department_code: "ONC", department_name: "Oncology", description: "Cancer treatment and research", created_at: "2023-11-05T11:45:00Z" },
  { department_id: "5", department_code: "ORTH", department_name: "Orthopedics", description: "Bones, joints, ligaments, tendons, and muscles", created_at: "2023-11-20T08:20:00Z" },
  { department_id: "6", department_code: "DERM", department_name: "Dermatology", description: "Skin, hair, and nail conditions", created_at: "2023-12-01T16:00:00Z" },
  { department_id: "7", department_code: "EMER", department_name: "Emergency", description: "Immediate medical attention", created_at: "2024-01-10T07:30:00Z" },
  { department_id: "8", department_code: "ENT", department_name: "ENT", description: "Ear, nose, and throat care", created_at: "2024-01-15T09:10:00Z" },
  { department_id: "9", department_code: "OPHT", department_name: "Ophthalmology", description: "Eye and vision care", created_at: "2024-01-20T10:25:00Z" },
  { department_id: "10", department_code: "GYNE", department_name: "Gynecology", description: "Women's reproductive health", created_at: "2024-01-25T11:50:00Z" },
  { department_id: "11", department_code: "UROL", department_name: "Urology", description: "Urinary tract and male reproductive system", created_at: "2024-02-01T12:10:00Z" },
  { department_id: "12", department_code: "GAST", department_name: "Gastroenterology", description: "Digestive system disorders", created_at: "2024-02-05T13:40:00Z" },
  { department_id: "13", department_code: "PSYC", department_name: "Psychiatry", description: "Mental health disorders and treatment", created_at: "2024-02-10T14:15:00Z" },
  { department_id: "14", department_code: "PULM", department_name: "Pulmonology", description: "Lung and respiratory diseases", created_at: "2024-02-15T15:30:00Z" },
  { department_id: "15", department_code: "ENDO", department_name: "Endocrinology", description: "Hormone and gland disorders", created_at: "2024-02-20T16:45:00Z" },
  { department_id: "16", department_code: "NEPH", department_name: "Nephrology", description: "Kidney diseases and treatments", created_at: "2024-02-25T17:20:00Z" },
  { department_id: "17", department_code: "RHEU", department_name: "Rheumatology", description: "Autoimmune and joint diseases", created_at: "2024-03-01T08:10:00Z" },
  { department_id: "18", department_code: "PATH", department_name: "Pathology", description: "Laboratory analysis of diseases", created_at: "2024-03-05T09:35:00Z" },
  { department_id: "19", department_code: "RAD", department_name: "Radiology", description: "Medical imaging and diagnostics", created_at: "2024-03-10T10:55:00Z" },
  { department_id: "20", department_code: "ANES", department_name: "Anesthesiology", description: "Anesthesia and perioperative care", created_at: "2024-03-15T11:25:00Z" },
];

// Initially enabled departments for the hospital
export const mockEnabledDepartments: HospitalDepartment[] = [
  { ...mockDepartments[0], isActive: true },  // Cardiology
  { ...mockDepartments[2], isActive: true },  // Orthopedics
  { ...mockDepartments[3], isActive: false }, // Pediatrics (Inactive)
];

export function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = date.getTime() - now.getTime();
  const isFuture = diffMs > 0;

  const diffInDays = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return isFuture ? "Today" : "Today";
  if (diffInDays === 1) return isFuture ? "Tomorrow" : "Yesterday";
  if (diffInDays < 30)
    return isFuture
      ? `In ${diffInDays} days`
      : `${diffInDays} days ago`;

  if (diffInDays < 365)
    return isFuture
      ? `In ${Math.floor(diffInDays / 30)} months`
      : `${Math.floor(diffInDays / 30)} months ago`;

  return isFuture
    ? `In ${Math.floor(diffInDays / 365)} years`
    : `${Math.floor(diffInDays / 365)} years ago`;
}