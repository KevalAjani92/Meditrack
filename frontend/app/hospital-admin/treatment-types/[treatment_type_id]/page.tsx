"use client";

import React, { useState, useMemo } from "react";
import BreadcrumbNavigation from "@/components/common/BreadcrumbNavigation";
import TreatmentTypeHeader from "@/components/hospital-admin/procedures/TreatmentTypeHeader";
import ProcedureStats from "@/components/hospital-admin/procedures/ProcedureStats";
import AvailableProceduresSection from "@/components/hospital-admin/procedures/AvailableProceduresSection";
import HospitalProceduresSection from "@/components/hospital-admin/procedures/HospitalProceduresSection";
import ProcedureFormModal from "@/components/hospital-admin/procedures/ProcedureFormModal";

import {
  Procedure,
  HospitalProcedure,
  mockProcedures,
  mockEnabledProcedures,
  mockTreatment,
} from "@/types/procedure";
import { useAuth } from "@/context/auth-context";
import {
  useEnabledProcedures,
  useEnableProcedure,
  useMasterProcedures,
  useProcedureStats,
  useTreatmentDetail,
  useUpdateProcedureDetail,
} from "@/hooks/procedure/useProcedures";

export default function HospitalProceduresPage({
  params,
}: {
  params: { treatment_type_id: string };
}) {
  const { user } = useAuth();
  const hospitalId = Number(user?.hospitalid);
  const { treatment_type_id } = React.use(params) as {
    treatment_type_id: string;
  };
  const treatmentTypeId = Number(treatment_type_id);

  // --- Search & Filter States ---
  const [masterSearch, setMasterSearch] = useState("");
  const [masterType, setMasterType] = useState("All");

  const [enabledSearch, setEnabledSearch] = useState("");
  const [enabledType, setEnabledType] = useState("All");

  // --- Modal States ---
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    data: Procedure | HospitalProcedure | null;
  }>({
    isOpen: false,
    mode: "add",
    data: null,
  });

  const { data: masterList = [] } = useMasterProcedures(
    hospitalId,
    treatmentTypeId,
    masterSearch,
    masterType,
  );

  const { data: enabledList = [] } = useEnabledProcedures(
    hospitalId,
    treatmentTypeId,
    enabledSearch,
    enabledType,
  );

  const { data: statsData } = useProcedureStats(hospitalId, treatmentTypeId);
  const stats = statsData ?? {
    totalMaster: 0,
    totalEnabled: 0,
    activeCount: 0,
    inactiveCount: 0,
  };

  const { data: treatment = null } = useTreatmentDetail(treatmentTypeId);

  const enableMutation = useEnableProcedure(hospitalId, treatmentTypeId);

  const updateMutation = useUpdateProcedureDetail(hospitalId, treatmentTypeId);

  const handleSaveProcedure = (
    id: number,
    hospitalProcedureId:number,
    isActive: boolean,
    price: number,
  ) => {
    if (modalState.mode === "add") {
      enableMutation.mutate({
        hospitalId,
        procedure_id: id,
        price,
        isActive,
      });
    } else {
      updateMutation.mutate({
        hospitalProcedureId: Number(hospitalProcedureId),
        price,
        isActive,
      });
    }

    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // --- Breadcrumb Context ---
  const breadcrumbItems = [
    { idx:1,label: "Hospital Admin", href: "/hospital-admin" },
    { idx:2,label: "Treatment Types", href: "/hospital-admin/treatment-types" },
    { idx:3,label: treatment?.treatment_name },
    { idx:4,label: "Procedures" },
  ];

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
      <BreadcrumbNavigation
        items={breadcrumbItems}
        backHref="/hospital-admin/treatment-types"
      />

      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Procedures Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure clinical procedures mapped specifically to this treatment
          type.
        </p>
      </div>

      <div className="mt-6">
        <TreatmentTypeHeader treatmentType={treatment} />
      </div>

      <ProcedureStats
        totalMaster={stats.totalMaster ?? 0}
        totalEnabled={stats.totalEnabled ?? 0}
        activeCount={stats.activeCount ?? 0}
        inactiveCount={stats.inactiveCount ?? 0}
      />

      {/* Main Grid Layout for Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Section: Master Catalog */}
        <AvailableProceduresSection
          procedures={masterList}
          treatment={mockTreatment}
          search={masterSearch}
          onSearchChange={setMasterSearch}
          typeFilter={masterType}
          onTypeChange={setMasterType}
          onAdd={(proc) =>
            setModalState({ isOpen: true, mode: "add", data: proc })
          }
        />

        {/* Right Section: Enabled in Hospital */}
        <HospitalProceduresSection
          procedures={enabledList}
          treatment={mockTreatment}
          search={enabledSearch}
          onSearchChange={setEnabledSearch}
          typeFilter={enabledType}
          onTypeChange={setEnabledType}
          onEdit={(proc) =>
            setModalState({ isOpen: true, mode: "edit", data: proc })
          }
        />
      </div>

      {/* Shared Modal */}
      <ProcedureFormModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        procedure={modalState.data}
        treatment={mockTreatment}
        mode={modalState.mode}
        onSave={handleSaveProcedure}
      />
    </main>
  );
}
