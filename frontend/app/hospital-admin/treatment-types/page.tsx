"use client";

import { useState, useMemo, useEffect } from "react";
import TreatmentStats from "@/components/hospital-admin/treatment-types/TreatmentStats";
import AvailableTreatmentsSection from "@/components/hospital-admin/treatment-types/AvailableTreatmentsSection";
import HospitalTreatmentsSection from "@/components/hospital-admin/treatment-types/HospitalTreatmentsSection";
import TreatmentFormModal from "@/components/hospital-admin/treatment-types/TreatmentFormModal";

import {
  TreatmentType,
  HospitalTreatment,
  mockTreatments,
  mockEnabledTreatments,
  extractUniqueDepartments,
} from "@/types/treatment";
import { useAuth } from "@/context/auth-context";
import {
  useEnabledTreatments,
  useEnableTreatment,
  useMasterTreatments,
  useTreatmentStats,
  useUpdateTreatmentStatus,
} from "@/hooks/treatment/useTreatment";
import { useEnabledDepartments } from "@/hooks/departments/useDepartments";

// const ITEMS_PER_PAGE = 6; // Pagination commented out

export default function HospitalTreatmentsPage() {
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
    data: TreatmentType | HospitalTreatment | null;
  }>({
    isOpen: false,
    mode: "add",
    data: null,
  });

  /*
  QUERIES
  */

  const { data: masterList = [] } = useMasterTreatments(
    hospitalId,
    masterSearch,
    masterDept,
  );

  const { data: enabledList = [] } = useEnabledTreatments(
    hospitalId,
    enabledSearch,
    enabledDept,
  );

  const { data: statsData } = useTreatmentStats(hospitalId);
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

  const enableMutation = useEnableTreatment(hospitalId);
  const updateStatusMutation = useUpdateTreatmentStatus(hospitalId);

  /*
  HANDLERS
  */

  const handleSaveTreatment = (
    treatmentId: string,
    hospitalTreatmentId: number,
    isActive: boolean,
  ) => {
    if (modalState.mode === "add") {
      enableMutation.mutate({
        hospitalId,
        treatment_type_id: Number(treatmentId),
        isActive,
      });
    } else {
      updateStatusMutation.mutate({
        hospitalTreatmentId: hospitalTreatmentId,
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
          Treatment Types Management
        </h1>
        <p className="text-muted-foreground">
          Configure the specific medical treatments and procedures available in
          your hospital.
        </p>
      </div>

      <TreatmentStats
        totalMaster={stats.totalMaster ?? 0}
        totalEnabled={stats.totalEnabled ?? 0}
        activeCount={stats.activeCount ?? 0}
        inactiveCount={stats.inactiveCount ?? 0}
      />

      {/* Main Grid Layout for Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Section: Master Catalog */}
        <AvailableTreatmentsSection
          treatments={masterList} // Pass full filtered array
          search={masterSearch}
          onSearchChange={setMasterSearch}
          departmentFilter={masterDept}
          onDepartmentChange={setMasterDept}
          departmentsList={departmentOptions}
          // page={masterPage}
          // totalPages={masterTotalPages}
          // onPageChange={setMasterPage}
          onAdd={(trt) =>
            setModalState({ isOpen: true, mode: "add", data: trt })
          }
        />

        {/* Right Section: Enabled in Hospital */}
        <HospitalTreatmentsSection
          treatments={enabledList} // Pass full filtered array
          search={enabledSearch}
          onSearchChange={setEnabledSearch}
          departmentFilter={enabledDept}
          onDepartmentChange={setEnabledDept}
          departmentsList={departmentOptions}
          // page={enabledPage}
          // totalPages={enabledTotalPages}
          // onPageChange={setEnabledPage}
          onEdit={(trt) =>
            setModalState({ isOpen: true, mode: "edit", data: trt })
          }
        />
      </div>

      {/* Shared Modal */}
      <TreatmentFormModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        treatment={modalState.data}
        mode={modalState.mode}
        onSave={handleSaveTreatment}
      />
    </main>
  );
}
