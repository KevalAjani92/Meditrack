"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination";
import TreatmentProfileCard from "@/components/superadmin/treatment-types/detail/TreatmentProfileCard";
import ProcedureStats from "@/components/superadmin/treatment-types/detail/ProcedureStats";
import ProcedureFilters from "@/components/superadmin/treatment-types/detail/ProcedureFilters";
import ProceduresTable from "@/components/superadmin/treatment-types/detail/ProceduresTable";
import ProceduresCardGrid from "@/components/superadmin/treatment-types/detail/ProceduresCardGrid";
import ProcedureFormModal from "@/components/superadmin/treatment-types/detail/ProcedureFormModal";
import ProcedureDetailModal from "@/components/superadmin/treatment-types/detail/ProcedureDetailModal";
import { mockTreatment, mockProcedures, Procedure } from "@/types/procedure";
import { useProcedures } from "@/hooks/procedure/useProcedures";

const ITEMS_PER_PAGE = 5;

export default function TreatmentDetailClient({
  treatmentId,
}: {
  treatmentId: number;
}) {
  const router = useRouter();

  // State
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<
    "All" | "Surgical" | "Non-Surgical"
  >("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<
    Procedure | undefined
  >(undefined);
  const [editProcedure, setEditProcedure] = useState<Procedure | undefined>(
    undefined,
  );

  // 🔹 Query Params
  const queryParams = useMemo(() => {
    return {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: search || undefined,
      type: typeFilter !== "All" ? typeFilter : undefined,
    };
  }, [currentPage, search, typeFilter]);

  const { data, isLoading, isFetching } = useProcedures(
    treatmentId,
    queryParams,
  );

  const procedures = data?.procedures || [];
  const meta = data?.meta;
  const stats = data?.stats;
  const treatment = data?.treatmentDetail;
//   console.log({
//   treatmentId,
//   data,
//   isLoading,
//   isFetching,
// });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter]);
  // Handlers
  const handleCreate = () => {
    setEditProcedure(undefined);
    setIsFormOpen(true);
  };

  const handleViewDetail = (proc: Procedure) => {
    setSelectedProcedure(proc);
    setIsDetailOpen(true);
  };

  const handleEdit = (proc: Procedure) => {
    setIsDetailOpen(false);
    setEditProcedure(proc);
    setTimeout(() => setIsFormOpen(true), 150); // Delay for smooth transition
  };

  return (
    <main className="min-h-screen bg-background p-6 space-y-6">
      {/* Breadcrumb / Navigation */}
      <div className="flex items-center gap-2 mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="p-0 hover:bg-transparent hover:text-primary gap-1 text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Treatments
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm text-foreground font-medium">
          {treatment?.treatment_name || "Treatment Details"}
        </span>
      </div>

      {/* 1. Treatment Profile */}
      <TreatmentProfileCard treatment={treatment} />

      {/* 2. Procedure Management Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-border">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Associated Procedures
          </h2>
          <p className="text-muted-foreground">
            Manage the steps and protocols for this treatment.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Add Procedure
        </Button>
      </div>

      <ProcedureStats stats={stats} />

      <ProcedureFilters
        viewMode={viewMode}
        setViewMode={setViewMode}
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {/* Main Content */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="h-40 flex items-center justify-center text-muted-foreground">
            Loading procedures...
          </div>
        ) : procedures.length > 0 ? (
          <>
            {viewMode === "table" ? (
              <ProceduresTable
                data={procedures}
                onViewDetail={handleViewDetail}
              />
            ) : (
              <ProceduresCardGrid
                data={procedures}
                onViewDetail={handleViewDetail}
              />
            )}
            <div className="pt-2 border-t border-border mt-4">
              <Pagination
                currentPage={meta?.page || 1}
                totalPages={meta?.totalPages || 1}
                onPageChange={setCurrentPage}
              />
              {isFetching && (
                <p className="text-xs text-muted-foreground mt-2">
                  Updating data...
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-card">
            <p className="text-muted-foreground">
              No procedures found matching your filters.
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSearch("");
                setTypeFilter("All");
              }}
              className="mt-2"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProcedureFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        defaultValues={editProcedure}
        treatmentTypeId={treatmentId}
      />

      <ProcedureDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        procedure={selectedProcedure}
        onEdit={handleEdit}
      />
    </main>
  );
}
