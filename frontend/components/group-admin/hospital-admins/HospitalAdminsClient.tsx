"use client";

import { useState, useMemo } from "react";
import { Pagination } from "@/components/ui/Pagination"; // Assumed existing
import AdminStats from "@/components/group-admin/hospital-admins/AdminStats";
import AdminFilters from "@/components/group-admin/hospital-admins/AdminFilters";
import AdminsTable from "@/components/group-admin/hospital-admins/AdminsTable";
import AdminsCardGrid from "@/components/group-admin/hospital-admins/AdminsCardGrid";
import AdminFormModal from "@/components/group-admin/hospital-admins/AdminFormModal";
import AssignHospitalModal from "@/components/group-admin/hospital-admins/AssignHospitalModal";
import AdminDetailModal from "@/components/group-admin/hospital-admins/AdminDetailModal";
import { mockAdmins, HospitalAdmin } from "@/types/hospital-admin";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useHospitalAdmins } from "@/hooks/hospital-admins/useHospitalAdmins";

const ITEMS_PER_PAGE = 8;

export default function HospitalAdminsClient() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  const [selectedAdmin, setSelectedAdmin] = useState<HospitalAdmin | undefined>(
    undefined,
  );
  const [editAdmin, setEditAdmin] = useState<HospitalAdmin | undefined>(
    undefined,
  );

  const queryParams = {
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: search || undefined,
    status: statusFilter !== "All" ? statusFilter : undefined,
  };

  const { data, isLoading, isFetching } = useHospitalAdmins(queryParams);

  const admins = data?.data || [];
  const meta = data?.meta;
  const stats = data?.stats;

  // --- Handlers ---
  const handleCreate = () => {
    setEditAdmin(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (admin: HospitalAdmin) => {
    setIsDetailOpen(false);
    setEditAdmin(admin);
    setIsFormOpen(true);
  };

  const handleView = (admin: HospitalAdmin) => {
    setSelectedAdmin(admin);
    setIsDetailOpen(true);
  };

  const handleAssign = (admin: HospitalAdmin) => {
    setSelectedAdmin(admin);
    setIsAssignOpen(true);
  };

  return (
    <main className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Hospital Admins
          </h1>
          <p className="text-muted-foreground">
            Manage user accounts and hospital assignments for local
            administrators.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Add Hospital Admin
        </Button>
      </div>

      <AdminStats stats={stats} />

      <AdminFilters
        viewMode={viewMode}
        setViewMode={setViewMode}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Content */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="h-40 flex items-center justify-center text-muted-foreground">
            Loading Admins...
          </div>
        ) : admins.length > 0 ? (
          <>
            {viewMode === "table" ? (
              <AdminsTable
                data={admins}
                onView={handleView}
                onEdit={handleEdit}
                onAssign={handleAssign}
              />
            ) : (
              <AdminsCardGrid
                data={admins}
                onView={handleView}
                onEdit={handleEdit}
                onAssign={handleAssign}
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
              No admins found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AdminFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        defaultValues={editAdmin}
      />

      <AdminDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        admin={selectedAdmin}
        onEdit={() => handleEdit(selectedAdmin!)}
      />

      <AssignHospitalModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        admin={selectedAdmin}
      />
    </main>
  );
}
