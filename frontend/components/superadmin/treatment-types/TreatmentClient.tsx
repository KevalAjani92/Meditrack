"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination"; // Assuming you have this
import TreatmentStats from "@/components/superadmin/treatment-types/TreatmentStats";
import TreatmentFilters from "@/components/superadmin/treatment-types/TreatmentFilters";
import TreatmentTable from "@/components/superadmin/treatment-types/TreatmentTable";
import TreatmentCardGrid from "@/components/superadmin/treatment-types/TreatmentCardGrid";
import TreatmentFormModal from "@/components/superadmin/treatment-types/TreatmentFormModal";
import { TreatmentType } from "@/types/treatment";
import { useTreatments } from "@/hooks/treatment/useTreatment";

const ITEMS_PER_PAGE = 6;

export default function TreatmentClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 🔹 Scoped Department from URL
  const scopedDepartmentId = searchParams.get("department_id");
  const numericDeptId = scopedDepartmentId
    ? Number(scopedDepartmentId)
    : undefined;

  // 2. UI State
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [departmentId, setDepartmentId] = useState<number | undefined>(
    numericDeptId,
  );

  // 3. Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<
    TreatmentType | undefined
  >(undefined);

  const { data, isLoading, isFetching } = useTreatments({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search,
    status: statusFilter !== "All" ? statusFilter : undefined,
    department_id: departmentId,
  });
  const treatments = data?.data || [];
  const meta = data?.meta;
  const stats = data?.stats;
  const scopedDepartment = data?.scoppedDepartment;

  // --- Handlers ---

  const handleCreate = () => {
    setEditingTreatment(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (treatment: TreatmentType) => {
    setEditingTreatment(treatment);
    setIsModalOpen(true);
  };

  const handleRowClick = (id: string) => {
    router.push(`/super-admin/treatment-types/${id}`);
  };

  const clearScope = () => {
    router.push("/super-admin/treatment-types");
    setDepartmentId(undefined);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, departmentId]);

  return (
    <main className="min-h-screen bg-background p-6 space-y-6">
      {/* 🔹 Context Banner (Scoped Mode) */}
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
                Filtered Context
              </p>
              <h2 className="text-lg font-bold text-foreground">
                Treatment Registry: {scopedDepartment?.department_name}
              </h2>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearScope}
            className="bg-background"
          >
            View All Treatments
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Treatment Types
          </h1>
          <p className="text-muted-foreground">
            Manage medical procedures, surgeries, and therapy codes.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Add Treatment
        </Button>
      </div>

      <TreatmentStats
        stats={stats}
        scopedDepartmentName={scopedDepartment?.department_name}
      />

      <TreatmentFilters
        viewMode={viewMode}
        setViewMode={setViewMode}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        isScoped={!!scopedDepartmentId}
        departmentId={departmentId}
        setDepartmentId={setDepartmentId}
      />

      {/* Main Content */}
      <div className="space-y-4">
        {treatments.length > 0 ? (
          <>
            {viewMode === "table" ? (
              <TreatmentTable
                data={treatments}
                onRowClick={handleRowClick}
                onEdit={handleEdit}
              />
            ) : (
              <TreatmentCardGrid
                data={treatments}
                onRowClick={handleRowClick}
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
          /* Empty State */
          <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-card">
            <p className="text-muted-foreground">
              {scopedDepartmentId
                ? `No treatment types found in ${scopedDepartment?.department_name}.`
                : "No treatment types found matching your filters."}
            </p>
            {scopedDepartmentId ? (
              <Button variant="link" onClick={handleCreate} className="mt-2">
                Create First Treatment
              </Button>
            ) : (
              <Button
                variant="link"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
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

      {/* Form Modal */}
      <TreatmentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultValues={editingTreatment}
        preselectedDepartmentId={numericDeptId}
      />
    </main>
  );
}
