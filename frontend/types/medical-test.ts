export interface Department {
  id: string;
  name: string;
}

export interface MedicalTest {
  test_id: number;
  test_code: string;
  test_name: string;
  test_type: string;
  department_id: number;
  department_name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HospitalTest extends MedicalTest {
  hospital_test_id:number;
  isActive: boolean;
  price: number;
}

export const mockDepartments: Department[] = [
  { id: "dept-1", name: "Pathology" },
  { id: "dept-2", name: "Radiology" },
  { id: "dept-3", name: "Cardiology" },
];

export const mockTests: MedicalTest[] = [
  {
    test_id: "TST-001",
    test_code: "CBC",
    test_name: "Complete Blood Count",
    test_type: "Pathology",
    department_id: "dept-1",
    department_name: "Pathology",
    description: "Evaluates overall health and detects disorders like anemia or infection.",
    is_active: true,
    created_at: "2023-01-15",
    updated_at: "2023-06-20",
  },
  {
    test_id: "TST-002",
    test_code: "CXR-PA",
    test_name: "Chest X-Ray (PA View)",
    test_type: "Radiology",
    department_id: "dept-2",
    department_name: "Radiology",
    description: "Produces images of the chest including lungs and heart.",
    is_active: true,
    created_at: "2023-02-10",
    updated_at: "2023-08-05",
  },
  {
    test_id: "TST-003",
    test_code: "LIPID",
    test_name: "Lipid Profile",
    test_type: "Pathology",
    department_id: "dept-1",
    department_name: "Pathology",
    description: "Measures cholesterol and triglycerides levels in blood.",
    is_active: false,
    created_at: "2023-03-12",
    updated_at: "2023-03-12",
  },
  {
    test_id: "TST-004",
    test_code: "ECG",
    test_name: "Electrocardiogram",
    test_type: "Cardiology",
    department_id: "dept-3",
    department_name: "Cardiology",
    description: "Records electrical activity of the heart.",
    is_active: true,
    created_at: "2023-04-01",
    updated_at: "2023-11-15",
  },
  {
    test_id: "TST-005",
    test_code: "ESR",
    test_name: "Erythrocyte Sedimentation Rate",
    test_type: "Pathology",
    department_id: "dept-1",
    department_name: "Pathology",
    description: "Measures inflammation in the body.",
    is_active: true,
    created_at: "2023-04-10",
    updated_at: "2023-07-10",
  },
  {
    test_id: "TST-006",
    test_code: "BSF",
    test_name: "Blood Sugar Fasting",
    test_type: "Pathology",
    department_id: "dept-1",
    department_name: "Pathology",
    description: "Measures blood glucose levels after fasting.",
    is_active: true,
    created_at: "2023-04-20",
    updated_at: "2023-07-15",
  },
  {
    test_id: "TST-007",
    test_code: "BSPP",
    test_name: "Blood Sugar Post Prandial",
    test_type: "Pathology",
    department_id: "dept-1",
    department_name: "Pathology",
    description: "Measures blood sugar after meals.",
    is_active: true,
    created_at: "2023-05-01",
    updated_at: "2023-07-20",
  },
  {
    test_id: "TST-008",
    test_code: "URINE-R",
    test_name: "Urine Routine",
    test_type: "Pathology",
    department_id: "dept-1",
    department_name: "Pathology",
    description: "General urine analysis to detect infections or kidney issues.",
    is_active: true,
    created_at: "2023-05-10",
    updated_at: "2023-08-01",
  },
  {
    test_id: "TST-009",
    test_code: "MRI-BRAIN",
    test_name: "MRI Brain",
    test_type: "Radiology",
    department_id: "dept-2",
    department_name: "Radiology",
    description: "Magnetic resonance imaging of the brain.",
    is_active: true,
    created_at: "2023-05-20",
    updated_at: "2023-08-05",
  },
  {
    test_id: "TST-010",
    test_code: "CT-ABD",
    test_name: "CT Scan Abdomen",
    test_type: "Radiology",
    department_id: "dept-2",
    department_name: "Radiology",
    description: "CT imaging to examine abdominal organs.",
    is_active: true,
    created_at: "2023-06-01",
    updated_at: "2023-09-10",
  },
  {
    test_id: "TST-011",
    test_code: "ECHO",
    test_name: "2D Echocardiography",
    test_type: "Cardiology",
    department_id: "dept-3",
    department_name: "Cardiology",
    description: "Ultrasound imaging to evaluate heart structure and function.",
    is_active: true,
    created_at: "2023-06-10",
    updated_at: "2023-10-01",
  },
  {
    test_id: "TST-012",
    test_code: "TSH",
    test_name: "Thyroid Stimulating Hormone",
    test_type: "Pathology",
    department_id: "dept-1",
    department_name: "Pathology",
    description: "Checks thyroid gland function.",
    is_active: true,
    created_at: "2023-06-20",
    updated_at: "2023-10-15",
  },
  {
    test_id: "TST-013",
    test_code: "LFT",
    test_name: "Liver Function Test",
    test_type: "Pathology",
    department_id: "dept-1",
    department_name: "Pathology",
    description: "Measures enzymes and proteins to assess liver health.",
    is_active: true,
    created_at: "2023-07-01",
    updated_at: "2023-10-20",
  },
  {
    test_id: "TST-014",
    test_code: "KFT",
    test_name: "Kidney Function Test",
    test_type: "Pathology",
    department_id: "dept-1",
    department_name: "Pathology",
    description: "Evaluates kidney performance using blood markers.",
    is_active: true,
    created_at: "2023-07-10",
    updated_at: "2023-10-25",
  },
  {
    test_id: "TST-015",
    test_code: "USG-ABD",
    test_name: "Ultrasound Abdomen",
    test_type: "Radiology",
    department_id: "dept-2",
    department_name: "Radiology",
    description: "Ultrasound imaging of abdominal organs.",
    is_active: true,
    created_at: "2023-07-20",
    updated_at: "2023-11-01",
  },
  {
    test_id: "TST-016",
    test_code: "PFT",
    test_name: "Pulmonary Function Test",
    test_type: "Pulmonology",
    department_id: "dept-4",
    department_name: "Pulmonology",
    description: "Measures lung capacity and airflow.",
    is_active: true,
    created_at: "2023-08-01",
    updated_at: "2023-11-10",
  },
  {
    test_id: "TST-017",
    test_code: "EEG",
    test_name: "Electroencephalogram",
    test_type: "Neurology",
    department_id: "dept-5",
    department_name: "Neurology",
    description: "Records electrical activity of the brain.",
    is_active: true,
    created_at: "2023-08-10",
    updated_at: "2023-11-15",
  },
  {
    test_id: "TST-018",
    test_code: "VIT-D",
    test_name: "Vitamin D Test",
    test_type: "Pathology",
    department_id: "dept-1",
    department_name: "Pathology",
    description: "Measures vitamin D levels in blood.",
    is_active: true,
    created_at: "2023-08-20",
    updated_at: "2023-11-20",
  },
  {
    test_id: "TST-019",
    test_code: "HB1AC",
    test_name: "HbA1c Test",
    test_type: "Pathology",
    department_id: "dept-1",
    department_name: "Pathology",
    description: "Measures average blood sugar levels over 3 months.",
    is_active: true,
    created_at: "2023-09-01",
    updated_at: "2023-11-25",
  },
  {
    test_id: "TST-020",
    test_code: "COVID-PCR",
    test_name: "COVID-19 RT-PCR",
    test_type: "Pathology",
    department_id: "dept-1",
    department_name: "Pathology",
    description: "Detects SARS-CoV-2 virus using PCR technique.",
    is_active: true,
    created_at: "2023-09-10",
    updated_at: "2023-12-01",
  },
];

export const mockEnabledTests: HospitalTest[] = [
  { ...mockTests[0], isActive: true, price: 450 },   // CBC
  { ...mockTests[2], isActive: true, price: 600 },   // X-Ray
  { ...mockTests[4], isActive: false, price: 800 },  // ECG (Inactive)
  { ...mockTests[1], isActive: true, price: 450 },   // CBC
  { ...mockTests[3], isActive: true, price: 600 },   // X-Ray
  { ...mockTests[14], isActive: false, price: 800 },  // ECG (Inactive)
  { ...mockTests[10], isActive: true, price: 450 },   // CBC
  { ...mockTests[12], isActive: true, price: 600 },   // X-Ray
  { ...mockTests[18], isActive: false, price: 800 },  // ECG (Inactive)
  { ...mockTests[13], isActive: true, price: 450 },   // CBC
  { ...mockTests[5], isActive: true, price: 600 },   // X-Ray
  { ...mockTests[9], isActive: false, price: 800 },  // ECG (Inactive)
];

export const extractUniqueDepartments = (tests: MedicalTest[]): string[] => {
  return Array.from(new Set(tests.map(t => t.department_name))).sort();
};