"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination";
import DiagnosisStats from "@/components/superadmin/diagnosis/DiagnosisStats";
import DiagnosisFilters from "@/components/superadmin/diagnosis/DiagnosisFilters";
import DiagnosesTable from "@/components/superadmin/diagnosis/DiagnosesTable";
import DiagnosesCardGrid from "@/components/superadmin/diagnosis/DiagnosesCardGrid";
import DiagnosisFormModal from "@/components/superadmin/diagnosis/DiagnosisFormModal";
import DiagnosisDetailModal from "@/components/superadmin/diagnosis/DiagnosisDetailModal";
import { Diagnosis, mockDiagnoses, mockDepartments } from "@/types/diagnosis";
import { useDiagnoses } from "@/hooks/diagnosis/useDiagnoses";

const ITEMS_PER_PAGE = 6;

export default function DiagnosisClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. URL State (Scoped Mode)
  const scopedDepartmentId = searchParams.get("department_id") || undefined;
  const [departmentId, setDepartmentId] = useState<string | undefined>(
    scopedDepartmentId || undefined,
  );

  // 2. Local State
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 3. Modal State (Detail -> Edit Interaction)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<
    Diagnosis | undefined
  >(undefined);
  const [editDiagnosis, setEditDiagnosis] = useState<Diagnosis | undefined>(
    undefined,
  );

  const { data, isLoading, isFetching } = useDiagnoses({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search,
    department_id: departmentId,
  });

  const diagnoses = data?.data || [];
  const meta = data?.meta;
  const stats = data?.stats;
  const scopedDepartment = data?.scoppedDepartment;

  // --- Handlers ---

  const handleCreate = () => {
    setEditDiagnosis(undefined); // Clean state
    setIsFormOpen(true);
  };

  const handleViewDetail = (diagnosis: Diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setIsDetailOpen(true);
  };

  const handleEdit = (diagnosis: Diagnosis) => {
    // If coming from Detail view, close it first
    setIsDetailOpen(false);
    setEditDiagnosis(diagnosis);
    setTimeout(() => setIsFormOpen(true), 150); // Slight delay for smooth transition
  };

  const clearScope = () => {
    router.push("/super-admin/diagnosis");
    setDepartmentId(undefined);
  };

  return (
    <main className="min-h-screen bg-background p-6 space-y-6">
      {/* 🔹 Context Banner (UX Add-on) */}
      {scopedDepartmentId && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <button
              className="p-2 bg-primary rounded-lg text-primary-foreground cursor-pointer hover:bg-primary/80"
              onClick={clearScope}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                Filtered View
              </p>
              <h2 className="text-lg font-bold text-foreground">
                Diagnoses for {scopedDepartment?.department_name}
              </h2>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearScope}
            className="bg-background"
          >
            View All Diagnoses
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Diagnosis Master
          </h1>
          <p className="text-muted-foreground">
            Manage ICD codes and clinical diagnosis registry.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Add Diagnosis
        </Button>
      </div>

      <DiagnosisStats
        stats={stats}
        scopedDepartmentName={scopedDepartment?.department_name}
      />

      <DiagnosisFilters
        viewMode={viewMode}
        setViewMode={setViewMode}
        search={search}
        setSearch={setSearch}
        isScoped={!!scopedDepartmentId}
        departmentId={departmentId}
        setDepartmentId={setDepartmentId}
      />

      {/* Main Content */}
      <div className="space-y-4">
        {diagnoses.length > 0 ? (
          <>
            {viewMode === "table" ? (
              <DiagnosesTable
                data={diagnoses}
                onViewDetail={handleViewDetail}
                onEdit={handleEdit}
              />
            ) : (
              <DiagnosesCardGrid
                data={diagnoses}
                onViewDetail={handleViewDetail}
                onEdit={handleEdit}
              />
            )}
            <div className="pt-2 border-t border-border mt-4">
              <Pagination
                currentPage={meta?.page || 1}
                totalPages={meta?.totalPages || 1}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-card">
            <p className="text-muted-foreground">
              {scopedDepartmentId
                ? `No diagnoses found for ${scopedDepartment?.department_name}.`
                : "No diagnoses found matching your search."}
            </p>
            {scopedDepartmentId ? (
              <Button variant="link" onClick={handleCreate} className="mt-2">
                Add to {scopedDepartment?.department_name}
              </Button>
            ) : (
              <Button
                variant="link"
                onClick={() => {
                  setSearch("");
                  setDepartmentId(undefined);
                }}
                className="mt-2"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <DiagnosisFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        defaultValues={editDiagnosis}
        preselectedDepartmentId={Number(scopedDepartmentId)} // Auto-fill logic
      />

      <DiagnosisDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        diagnosis={selectedDiagnosis}
        onEdit={handleEdit}
      />
    </main>
  );
}
