"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination"; // Assumed existing
import TestStats from "@/components/superadmin/medical-tests/TestStats";
import TestFilters from "@/components/superadmin/medical-tests/TestFilters";
import TestsTable from "@/components/superadmin/medical-tests/TestsTable";
import TestsCardGrid from "@/components/superadmin/medical-tests/TestsCardGrid";
import TestFormModal from "@/components/superadmin/medical-tests/TestFormModal";
import TestDetailModal from "@/components/superadmin/medical-tests/TestDetailModal";
import { mockTests, mockDepartments, MedicalTest } from "@/types/medical-test";
import { useTests } from "@/hooks/medical-tests/useTests";

const ITEMS_PER_PAGE = 6;

export default function TestClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Context (Scoped Mode)
  const scopedDepartmentId = searchParams.get("department_id");
  const numericDeptId = scopedDepartmentId
    ? Number(scopedDepartmentId)
    : undefined;

  // 2. Local State
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [departmentId, setDepartmentId] = useState<number | undefined>(
    numericDeptId,
  );

  // 3. Modals State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<MedicalTest | undefined>(
    undefined,
  );
  const [editTest, setEditTest] = useState<MedicalTest | undefined>(undefined);

  const { data, isLoading, isFetching } = useTests({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search,
    status: statusFilter !== "All" ? statusFilter : undefined,
    department_id: departmentId,
  });
  const tests = data?.data || [];
  const meta = data?.meta;
  const stats = data?.stats;
  const scopedDepartment = data?.scoppedDepartment;
  // console.log(data);

  // --- Handlers ---
  const handleCreate = () => {
    setEditTest(undefined);
    setIsFormOpen(true);
  };

  const handleViewDetail = (test: MedicalTest) => {
    setSelectedTest(test);
    setIsDetailOpen(true);
  };

  const handleEdit = (test: MedicalTest) => {
    setIsDetailOpen(false); // Close detail first
    setEditTest(test);
    setTimeout(() => setIsFormOpen(true), 150); // Smooth transition
  };

  const clearScope = () => {
    router.push("/super-admin/medical-tests");
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
                Department Scope
              </p>
              <h2 className="text-lg font-bold text-foreground">
                Medical Tests: {scopedDepartment?.department_name}
              </h2>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearScope}
            className="bg-background"
          >
            View All Tests
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Medical Tests
          </h1>
          <p className="text-muted-foreground">
            Manage laboratory and radiology test configurations.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Add Test
        </Button>
      </div>

      <TestStats
        stats={stats}
        scopedDepartmentName={scopedDepartment?.department_name}
      />

      <TestFilters
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
        {tests.length > 0 ? (
          <>
            {viewMode === "table" ? (
              <TestsTable
                data={tests}
                onViewDetail={handleViewDetail}
                onEdit={handleEdit}
              />
            ) : (
              <TestsCardGrid
                data={tests}
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
                ? `No tests found for ${scopedDepartment?.department_name}.`
                : "No tests found matching your search."}
            </p>
            {scopedDepartmentId ? (
              <Button variant="link" onClick={handleCreate} className="mt-2">
                Create Test for {scopedDepartment?.department_name}
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

      {/* Modals */}
      <TestFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        defaultValues={editTest}
        preselectedDepartmentId={numericDeptId}
      />

      <TestDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        test={selectedTest}
        onEdit={handleEdit}
      />
    </main>
  );
}
