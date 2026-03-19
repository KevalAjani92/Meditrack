"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminStats from "@/components/superadmin/group-admins/AdminStats";
import AdminsTable from "@/components/superadmin/group-admins/AdminsTable";
import AdminsCardGrid from "@/components/superadmin/group-admins/AdminsCardGrid";
import AdminFormModal from "@/components/superadmin/group-admins/AdminFormModal";
import AssignGroupModal from "@/components/superadmin/group-admins/AssignGroupModal";
import DataToolbar from "@/components/common/DataToolbar";
import { Pagination } from "@/components/ui/Pagination";

import { useGroupAdmins } from "@/hooks/group-admins/useGroupAdmins";
import { GroupAdmin } from "@/types/admin";
import { useGroupAdminStats } from "@/hooks/group-admins/useGroupAdminStats";

const ITEMS_PER_PAGE = 6;

const filterConfig = [
  {
    key: "status",
    label: "Status",
    options: [
      { label: "All Statuses", value: "All" },
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
    ],
  },
];

export default function GroupAdminsClient() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const [filters, setFilters] = useState<Record<string, string>>({
    search: "",
    status: "All",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<GroupAdmin | undefined>();

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<GroupAdmin | undefined>();

  // 🔥 Query Params
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: filters.search || undefined,
      status: filters.status !== "All" ? filters.status : undefined,
    }),
    [currentPage, filters],
  );

  const { data, isLoading, isFetching } = useGroupAdmins(queryParams);
  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
  } = useGroupAdminStats();
  const hasError = !data || statsError;
  

  const admins: GroupAdmin[] = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  const handleCreate = () => {
    setEditingAdmin(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (admin: GroupAdmin) => {
    setEditingAdmin(admin);
    setIsModalOpen(true);
  };

  const handleAssign = (admin: GroupAdmin) => {
    setSelectedAdmin(admin);
    setIsAssignOpen(true);
  };

  return (
    <main className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Group Admins
          </h1>
          <p className="text-muted-foreground">
            Manage access and permissions for hospital group administrators.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Create Admin
        </Button>
      </div>

      {/* Stats */}
      {!hasError && (
        <AdminStats
          stats={
            statsData || {
              total: 0,
              active: 0,
              inactive: 0,
              assignedGroups: 0,
            }
          }
          isLoading={statsLoading}
        />
      )}

      {/* Filters */}
      <DataToolbar
        searchPlaceholder="Search admins..."
        viewMode={viewMode}
        setViewMode={setViewMode}
        filters={filters}
        setFilters={setFilters}
        filterConfig={filterConfig}
      />

      {/* Loading */}
      {isLoading ? (
        <div className="h-40 flex items-center justify-center text-muted-foreground">
          Loading group admins...
        </div>
      ) : admins.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-card">
          <p className="text-muted-foreground">
            No admins found matching your criteria.
          </p>
          <Button
            variant="link"
            onClick={() => setFilters({ search: "", status: "All" })}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          {viewMode === "table" ? (
            <AdminsTable
              data={admins}
              onAssign={handleAssign}
              onEdit={handleEdit}
            />
          ) : (
            <AdminsCardGrid
              data={admins}
              onAssign={handleAssign}
              onEdit={handleEdit}
            />
          )}

          {/* Pagination */}
          <div className="pt-4 border-t border-border">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            {isFetching && (
              <p className="text-sm text-muted-foreground mt-2">
                Updating data...
              </p>
            )}
          </div>
        </>
      )}

      {/* Modals */}
      <AdminFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultValues={editingAdmin}
      />

      <AssignGroupModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        admin={selectedAdmin}
      />
    </main>
  );
}
