"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Building, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination"; // From previous context
import DepartmentsStats from "@/components/superadmin/departments/DepartmentsStats";
import DepartmentsTable, {
  SortConfig,
} from "@/components/superadmin/departments/DepartmentsTable";
import DepartmentsCardGrid from "@/components/superadmin/departments/DepartmentsCardGrid";
import DepartmentFormModal from "@/components/superadmin/departments/DepartmentFormModal";
import { Department } from "@/types/department";
import DataToolbar from "@/components/common/DataToolbar";
import { useDepartments } from "@/hooks/departments/useDepartments";

const ITEMS_PER_PAGE = 6;

export default function DepartmentsClient() {
  const router = useRouter();

  // State Management
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState<Record<string, string>>({
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | undefined>(
    undefined,
  );

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: search.search || undefined,
    }),
    [currentPage, search],
  );

  const { data, isLoading, isFetching } = useDepartments(queryParams);

  const departments = data?.data || [];
  const meta = data?.meta;
  const stats = data?.stats;

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search.search]);

  const openCreateModal = () => {
    setEditingDept(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (dept: any) => {
    setEditingDept(dept);
    setIsModalOpen(true);
  };

  const handleRowClick = (id: string) => {
    router.push(`/super-admin/departments/${id}`);
  };

  return (
    <main className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Departments Master
          </h1>
          <p className="text-muted-foreground">
            Manage global hospital departments and specializations.
          </p>
        </div>
        <Button onClick={openCreateModal} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Add Department
        </Button>
      </div>

      <DepartmentsStats stats={stats} isLoading={isLoading} />

      {/* <DepartmentFilters 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        search={search} 
        setSearch={setSearch} 
      /> */}
      <DataToolbar
        searchPlaceholder="Search departments..."
        viewMode={viewMode}
        setViewMode={setViewMode}
        filters={search}
        setFilters={setSearch}
      />

      {/* Main Content Area */}
      <div className="animate-in fade-in duration-500 space-y-4">
        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            Loading departments...
          </div>
        ) : departments.length > 0 ? (
          <>
            {/* Responsive Fallback: Force grid on small screens implicitly via Tailwind classes inside components if needed, or strictly via viewMode */}
            <div className="hidden sm:block">
              {viewMode === "table" ? (
                <DepartmentsTable
                  data={departments}
                  onEdit={openEditModal}
                  onRowClick={handleRowClick}
                />
              ) : (
                <DepartmentsCardGrid
                  data={departments}
                  onRowClick={handleRowClick}
                  onEdit={openEditModal}
                />
              )}
            </div>

            {/* Force Grid on Mobile regardless of toggle state */}
            <div className="block sm:hidden">
              <DepartmentsCardGrid
                data={departments}
                onRowClick={handleRowClick}
                onEdit={openEditModal}
              />
            </div>

            {/* Pagination Footer */}
            <div className="pt-2 border-t border-border mt-4">
              <Pagination
                currentPage={meta?.page || 1}
                totalPages={meta?.totalPages || 1}
                onPageChange={setCurrentPage}
              />
              {isFetching && (
                <p className="text-sm text-muted-foreground mt-2">
                  Updating...
                </p>
              )}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-card flex flex-col items-center">
            <div className="p-4 bg-muted rounded-full mb-4">
              <Network className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No departments found
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {search && Object.keys(search).length > 0
                ? "We couldn't find any departments matching your search criteria."
                : "Get started by adding standard departments to the global registry."}
            </p>
            {search && Object.keys(search).length > 0 ? (
              <Button
                variant="outline"
                onClick={() => setSearch({ search: "" })}
              >
                Clear Search
              </Button>
            ) : (
              <Button onClick={openCreateModal}>Add First Department</Button>
            )}
          </div>
        )}
      </div>

      <DepartmentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultValues={editingDept}
      />
    </main>
  );
}
