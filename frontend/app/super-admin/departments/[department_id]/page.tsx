"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Stethoscope, FlaskConical, BriefcaseMedical } from "lucide-react";
import DepartmentProfileCard from "@/components/superadmin/departments/detail/DepartmentProfileCard";
import ClinicalSectionCard from "@/components/superadmin/departments/detail/ClinicalSectionCard";
import DepartmentFormModal from "@/components/superadmin/departments/DepartmentFormModal"; // Assumed existing

// --- Types & Mock Data ---

const mockDepartment = {
  id: "dept-1",
  code: "CARD",
  name: "Cardiology",
  description: "Specializes in the diagnosis and treatment of heart and blood vessel disorders, including coronary artery disease and heart failure.",
  created_at: "2023-01-15",
};

const mockDiagnoses = [
  { code: "I10", name: "Essential Hypertension", is_active: true },
  { code: "I20.9", name: "Angina Pectoris", is_active: true },
  { code: "I50.2", name: "Systolic Heart Failure", is_active: false },
  { code: "I21.9", name: "Acute Myocardial Infarction", is_active: true },
  { code: "I48.9", name: "Atrial Fibrillation", is_active: true },
];

const mockTreatments = [
  { code: "CABG", name: "Coronary Artery Bypass", is_active: true },
  { code: "PCI", name: "Percutaneous Intervention", is_active: true },
  { code: "ECV", name: "Electrical Cardioversion", is_active: false },
];

const mockTests = [
  { code: "ECG", name: "Electrocardiogram", is_active: true },
  { code: "ECHO", name: "Echocardiography", is_active: true },
  { code: "TMT", name: "Treadmill Test", is_active: true },
  { code: "LIPID", name: "Lipid Profile", is_active: true },
  { code: "TROP", name: "Troponin-I", is_active: true },
];

export default function DepartmentDetailPage({ params }: { params: { department_id: string } }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // In a real app, useQuery(params.department_id) here
  const { department_id } = React.use(params) as { department_id: string };
  const deptId = Number(department_id);

  // Mock mapped object for form prefill
  const editInitialValues = {
    department_id: mockDepartment.id,
    department_code: mockDepartment.code,
    department_name: mockDepartment.name,
    description: mockDepartment.description,
    created_at: mockDepartment.created_at,
  };

  return (
    <main className="min-h-screen bg-background p-6 space-y-8">
      
      {/* 1. Context Navigation (Breadcrumb-ish) */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/super-admin/departments" className="hover:text-foreground transition-colors">
          Departments
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium text-foreground">{mockDepartment.name}</span>
      </div>

      {/* 2. Department Identity */}
      <DepartmentProfileCard 
        department={mockDepartment} 
        onEdit={() => setIsEditModalOpen(true)} 
      />

      {/* 3. Clinical Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Diagnoses Column */}
        <ClinicalSectionCard 
          title="Diagnoses"
          icon={Stethoscope}
          totalCount={45}
          activeCount={42} // Example of inactive items
          previewData={mockDiagnoses}
          viewAllUrl={`/super-admin/diagnosis?department_id=${deptId}`}
          delay={0.1}
        />

        {/* Treatment Types Column */}
        <ClinicalSectionCard 
          title="Treatments"
          icon={BriefcaseMedical}
          totalCount={12}
          activeCount={10}
          previewData={mockTreatments}
          viewAllUrl={`/super-admin/treatment-types?department_id=${deptId}`}
          delay={0.2}
        />

        {/* Medical Tests Column */}
        <ClinicalSectionCard 
          title="Medical Tests"
          icon={FlaskConical}
          totalCount={28}
          activeCount={28} // All active
          previewData={mockTests}
          viewAllUrl={`/super-admin/medical-tests?department_id=${deptId}`}
          delay={0.3}
        />

      </div>

      {/* 4. Edit Modal Integration */}
      {/* Assuming DepartmentFormModal is imported from previous step */}
      <DepartmentFormModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        defaultValues={editInitialValues}
      />

    </main>
  );
}