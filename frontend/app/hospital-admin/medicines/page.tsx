"use client";

import { useState, useMemo } from "react";
import MedicineStats from "@/components/hospital-admin/medicines/MedicineStats";
import AvailableMedicinesSection from "@/components/hospital-admin/medicines/AvailableMedicinesSection";
import HospitalMedicinesSection from "@/components/hospital-admin/medicines/HospitalMedicinesSection";
import MedicineFormModal from "@/components/hospital-admin/medicines/MedicineFormModal";

import {
  Medicine,
  HospitalMedicine,
  mockMasterMedicines,
  mockEnabledMedicines,
  extractUniqueTypes,
} from "@/types/medicine";
import { useAuth } from "@/context/auth-context";
import {
  useEnabledMedicines,
  useEnableMedicine,
  useMasterMedicines,
  useMedicineStats,
  useUpdateMedicine,
} from "@/hooks/medicines/useMedicines";

// const ITEMS_PER_PAGE = 6; // Pagination commented out

export default function HospitalMedicinesPage() {
  const { user } = useAuth();
  const hospitalId = Number(user?.hospitalid);

  // --- Search & Filter States ---
  const [masterSearch, setMasterSearch] = useState("");
  const [masterType, setMasterType] = useState("All");

  const [enabledSearch, setEnabledSearch] = useState("");
  const [enabledType, setEnabledType] = useState("All");

  // --- Pagination States (Commented Out) ---
  // const [masterPage, setMasterPage] = useState(1);
  // const [enabledPage, setEnabledPage] = useState(1);

  // --- Modal States ---
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    data: Medicine | HospitalMedicine | null;
  }>({
    isOpen: false,
    mode: "add",
    data: null,
  });

  const { data: masterList = [] } = useMasterMedicines(
    hospitalId,
    masterSearch,
    masterType,
  );

  const { data: enabledList = [] } = useEnabledMedicines(
    hospitalId,
    enabledSearch,
    enabledType,
  );

  const { data: statsData } = useMedicineStats(hospitalId);
  const stats = statsData ?? {
    totalMaster: 0,
    totalEnabled: 0,
    activeCount: 0,
    lowStockCount: 0,
  };

  const enableMutation = useEnableMedicine(hospitalId);
  const updateMutation = useUpdateMedicine(hospitalId);

  const handleSaveMedicine = (
    id: number,
    hospitalMedicineId: number,
    isActive: boolean,
    price: number,
    stock: number,
  ) => {
    if (modalState.mode === "add") {
      enableMutation.mutate({
        hospitalId,
        medicine_id: id,
        price,
        stock,
        isActive,
      });
    } else {
      updateMutation.mutate({
        hospitalMedicineId: hospitalMedicineId,
        price,
        stock,
        isActive,
      });
    }

    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Extract master type list for dropdowns
  const allTypes = useMemo(() => extractUniqueTypes(masterList), [masterList]);

  // --- Pagination Reset Effects (Commented Out) ---
  // useEffect(() => { setMasterPage(1); }, [masterSearch, masterType]);
  // useEffect(() => { setEnabledPage(1); }, [enabledSearch, enabledType]);

  // --- Pagination Slicing (Commented Out) ---
  // const paginatedMaster = filteredAvailable.slice((masterPage - 1) * ITEMS_PER_PAGE, masterPage * ITEMS_PER_PAGE);
  // const masterTotalPages = Math.ceil(filteredAvailable.length / ITEMS_PER_PAGE);

  // const paginatedEnabled = filteredEnabled.slice((enabledPage - 1) * ITEMS_PER_PAGE, enabledPage * ITEMS_PER_PAGE);
  // const enabledTotalPages = Math.ceil(filteredEnabled.length / ITEMS_PER_PAGE);

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Pharmacy Management
        </h1>
        <p className="text-muted-foreground">
          Configure medical inventory, set pricing, and manage pharmacy stock.
        </p>
      </div>

      <MedicineStats
        totalMaster={stats.totalMaster}
        totalEnabled={stats.totalEnabled}
        activeCount={stats.activeCount}
        lowStockCount={stats.lowStockCount}
      />

      {/* Main Grid Layout for Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Section: Master Catalog */}
        <AvailableMedicinesSection
          medicines={masterList} // Passing full filtered array
          search={masterSearch}
          onSearchChange={setMasterSearch}
          typeFilter={masterType}
          onTypeChange={setMasterType}
          typesList={allTypes}
          // page={masterPage}
          // totalPages={masterTotalPages}
          // onPageChange={setMasterPage}
          onAdd={(med) =>
            setModalState({ isOpen: true, mode: "add", data: med })
          }
        />

        {/* Right Section: Enabled in Hospital */}
        <HospitalMedicinesSection
          medicines={enabledList} // Passing full filtered array
          search={enabledSearch}
          onSearchChange={setEnabledSearch}
          typeFilter={enabledType}
          onTypeChange={setEnabledType}
          typesList={allTypes}
          // page={enabledPage}
          // totalPages={enabledTotalPages}
          // onPageChange={setEnabledPage}
          onEdit={(med) =>
            setModalState({ isOpen: true, mode: "edit", data: med })
          }
        />
      </div>

      {/* Shared Modal */}
      <MedicineFormModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        medicine={modalState.data}
        mode={modalState.mode}
        onSave={handleSaveMedicine}
      />
    </main>
  );
}
