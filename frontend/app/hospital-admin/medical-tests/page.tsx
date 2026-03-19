"use client";

import { useState, useMemo } from "react";
// import { useEffect } from "react";
import TestStats from "@/components/hospital-admin/tests/TestStats";
import AvailableTestsSection from "@/components/hospital-admin/tests/AvailableTestsSection";
import HospitalTestsSection from "@/components/hospital-admin/tests/HospitalTestsSection";
import TestFormModal from "@/components/hospital-admin/tests/TestFormModal";

import {
  MedicalTest,
  HospitalTest,
  mockTests,
  mockEnabledTests,
  extractUniqueDepartments,
} from "@/types/medical-test";
import { useAuth } from "@/context/auth-context";
import {
  useEnabledTests,
  useEnableTest,
  useMasterTests,
  useTestStats,
  useUpdateTestStatus,
} from "@/hooks/medical-tests/useTests";
import { useEnabledDepartments } from "@/hooks/departments/useDepartments";

// const ITEMS_PER_PAGE = 6; // Pagination commented out

export default function HospitalTestsPage() {
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
    data: MedicalTest | HospitalTest | null;
  }>({
    isOpen: false,
    mode: "add",
    data: null,
  });

  const { data: masterList = [] } = useMasterTests(
    hospitalId,
    masterSearch,
    masterDept,
  );

  const { data: enabledList = [] } = useEnabledTests(
    hospitalId,
    enabledSearch,
    enabledDept,
  );

  const { data: statsData } = useTestStats(hospitalId);

  const stats = statsData ?? {
    totalMaster: 0,
    totalEnabled: 0,
    activeCount: 0,
    inactiveCount: 0,
  };

  const { data: departments = [] } = useEnabledDepartments(hospitalId, "");
  const departmentOptions = departments.map((d) => d.department_name);

  const enableMutation = useEnableTest(hospitalId);
  const updateMutation = useUpdateTestStatus(hospitalId);

  const handleSaveTest = (id: number,hospitalTestId:number, isActive: boolean, price: number) => {
    if (modalState.mode === "add") {
      enableMutation.mutate({
        hospitalId,
        test_id: id,
        price,
        isActive,
      });
    } else {
      updateMutation.mutate({
        hospitalTestId: hospitalId,
        price,
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
          Diagnostic Tests Management
        </h1>
        <p className="text-muted-foreground">
          Configure laboratory and imaging tests available in your hospital and
          manage their pricing.
        </p>
      </div>

      <TestStats
        totalMaster={stats.totalMaster ?? 0}
        totalEnabled={stats.totalEnabled ?? 0}
        activeCount={stats.activeCount ?? 0}
        inactiveCount={stats.inactiveCount ?? 0}
      />

      {/* Main Grid Layout for Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Section: Master Catalog */}
        <AvailableTestsSection
          tests={masterList} // Passing full filtered array
          search={masterSearch}
          onSearchChange={setMasterSearch}
          departmentFilter={masterDept}
          onDepartmentChange={setMasterDept}
          departmentsList={departmentOptions}
          // page={masterPage}
          // totalPages={masterTotalPages}
          // onPageChange={setMasterPage}
          onAdd={(test) =>
            setModalState({ isOpen: true, mode: "add", data: test })
          }
        />

        {/* Right Section: Enabled in Hospital */}
        <HospitalTestsSection
          tests={enabledList} // Passing full filtered array
          search={enabledSearch}
          onSearchChange={setEnabledSearch}
          departmentFilter={enabledDept}
          onDepartmentChange={setEnabledDept}
          departmentsList={departmentOptions}
          // page={enabledPage}
          // totalPages={enabledTotalPages}
          // onPageChange={setEnabledPage}
          onEdit={(test) =>
            setModalState({ isOpen: true, mode: "edit", data: test })
          }
        />
      </div>

      {/* Shared Modal */}
      <TestFormModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        test={modalState.data}
        mode={modalState.mode}
        onSave={handleSaveTest}
      />
    </main>
  );
}
