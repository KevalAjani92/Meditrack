"use client";

import { useState, useMemo, useEffect } from "react";
import DiagnosisStats from "@/components/hospital-admin/diagnoses/DiagnosisStats";
import AvailableDiagnosesSection from "@/components/hospital-admin/diagnoses/AvailableDiagnosesSection";
import HospitalDiagnosesSection from "@/components/hospital-admin/diagnoses/HospitalDiagnosesSection";
import DiagnosisFormModal from "@/components/hospital-admin/diagnoses/DiagnosisFormModal";

import {
  Diagnosis,
  HospitalDiagnosis,
  mockDiagnoses,
  mockEnabledDiagnoses,
  extractUniqueDepartments,
} from "@/types/diagnosis";
import { useAuth } from "@/context/auth-context";
import {
  useDiagnosisStats,
  useEnabledDiagnoses,
  useEnableDiagnosis,
  useMasterDiagnoses,
  useUpdateDiagnosisStatus,
} from "@/hooks/diagnosis/useDiagnoses";
import { useEnabledDepartments } from "@/hooks/departments/useDepartments";

// const ITEMS_PER_PAGE = 6; // Pagination commented out

export default function HospitalDiagnosesPage() {
  const { user } = useAuth();
  const hospitalId = Number(user?.hospitalid);

  // --- Search & Filter States ---
  const [masterSearch, setMasterSearch] = useState("");
  const [masterDept, setMasterDept] = useState("All");

  const [enabledSearch, setEnabledSearch] = useState("");
  const [enabledDept, setEnabledDept] = useState("All");

  // --- Pagination States (Commented Out) ---
  // const [masterPage, setMasterPage] = useState(1);
  // const [enabledPage, setEnabledPage] = useState(1);

  // --- Modal States ---
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    data: Diagnosis | HospitalDiagnosis | null;
  }>({
    isOpen: false,
    mode: "add",
    data: null,
  });

  /*
  QUERIES
  */

  const { data: masterList = [] } = useMasterDiagnoses(
    hospitalId,
    masterSearch,
    masterDept,
  );

  const { data: enabledList = [] } = useEnabledDiagnoses(
    hospitalId,
    enabledSearch,
    enabledDept,
  );

  const { data: statsData } = useDiagnosisStats(hospitalId);
  const stats = statsData ?? {
    totalMaster: 0,
    totalEnabled: 0,
    activeCount: 0,
    inactiveCount: 0,
  };

  const { data: departments = [] } = useEnabledDepartments(hospitalId, "");
  const departmentOptions = departments.map((d) => d.department_name);

  /*
  MUTATIONS
  */

  const enableDiagnosisMutation = useEnableDiagnosis(hospitalId);
  const updateStatusMutation = useUpdateDiagnosisStatus(hospitalId);

  /*
  HANDLERS
  */

  const handleSaveDiagnosis = (
    diagId: string,
    hospitalDiagnosisId: number,
    isActive: boolean,
  ) => {
    if (modalState.mode === "add") {
      enableDiagnosisMutation.mutate({
        hospitalId,
        diagnosis_id: Number(diagId),
        isActive,
      });
    } else {
      updateStatusMutation.mutate({
        hospitalDiagnosisId: hospitalDiagnosisId,
        isActive,
      });
    }

    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // --- Pagination Reset Effects (Commented Out) ---
  // useEffect(() => { setMasterPage(1); }, [masterSearch, masterDept]);
  // useEffect(() => { setEnabledPage(1); }, [enabledSearch, enabledDept]);

  // --- Pagination Slicing (Commented Out) ---
  // const paginatedMaster = filteredAvailable.slice((masterPage - 1) * ITEMS_PER_PAGE, masterPage * ITEMS_PER_PAGE);
  // const masterTotalPages = Math.ceil(filteredAvailable.length / ITEMS_PER_PAGE);

  // const paginatedEnabled = filteredEnabled.slice((enabledPage - 1) * ITEMS_PER_PAGE, enabledPage * ITEMS_PER_PAGE);
  // const enabledTotalPages = Math.ceil(filteredEnabled.length / ITEMS_PER_PAGE);

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Diagnosis Management
        </h1>
        <p className="text-muted-foreground">
          Configure and manage clinical diagnoses available for doctors in your
          hospital.
        </p>
      </div>

      <DiagnosisStats
        totalMaster={stats.totalMaster ?? 0}
        totalEnabled={stats.totalEnabled ?? 0}
        activeCount={stats.activeCount ?? 0}
        inactiveCount={stats.inactiveCount ?? 0}
      />

      {/* Main Grid Layout for Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Section: Master Catalog */}
        <AvailableDiagnosesSection
          diagnoses={masterList} // Passing full filtered list instead of paginated
          search={masterSearch}
          onSearchChange={setMasterSearch}
          departmentFilter={masterDept}
          onDepartmentChange={setMasterDept}
          departmentsList={departmentOptions}
          // page={masterPage}
          // totalPages={masterTotalPages}
          // onPageChange={setMasterPage}
          onAdd={(diag) =>
            setModalState({ isOpen: true, mode: "add", data: diag })
          }
        />

        {/* Right Section: Enabled in Hospital */}
        <HospitalDiagnosesSection
          diagnoses={enabledList} // Passing full filtered list instead of paginated
          search={enabledSearch}
          onSearchChange={setEnabledSearch}
          departmentFilter={enabledDept}
          onDepartmentChange={setEnabledDept}
          departmentsList={departmentOptions}
          // page={enabledPage}
          // totalPages={enabledTotalPages}
          // onPageChange={setEnabledPage}
          onEdit={(diag) =>
            setModalState({ isOpen: true, mode: "edit", data: diag })
          }
        />
      </div>

      {/* Shared Modal */}
      <DiagnosisFormModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        diagnosis={modalState.data}
        mode={modalState.mode}
        onSave={handleSaveDiagnosis}
      />
    </main>
  );
}
