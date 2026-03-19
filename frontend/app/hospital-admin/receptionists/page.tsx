"use client";

import { useState, useEffect, useCallback } from "react";
import { Pagination } from "@/components/ui/Pagination";
import ReceptionistStats from "@/components/hospital-admin/receptionist/ReceptionistStats";
import ReceptionistFilters from "@/components/hospital-admin/receptionist/ReceptionistFilters";
import ReceptionistsTable from "@/components/hospital-admin/receptionist/ReceptionistsTable";
import ReceptionistsCardGrid from "@/components/hospital-admin/receptionist/ReceptionistsCardGrid";
import ReceptionistFormModal from "@/components/hospital-admin/receptionist/ReceptionistFormModal";
import ReceptionistDetailModal from "@/components/hospital-admin/receptionist/ReceptionistDetailModal";
import PasswordModal from "@/components/hospital-admin/shared/PasswordModal";
import { Receptionist, ReceptionistStats as ReceptionistStatsType } from "@/types/receptionist";
import { receptionistService } from "@/services/receptionist.service";
import { toast } from "sonner";

const HOSPITAL_ID = 1;
const ITEMS_PER_PAGE = 8;

export default function ReceptionistManagementPage() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Data State
  const [receptionists, setReceptionists] = useState<Receptionist[]>([]);
  const [stats, setStats] = useState<ReceptionistStatsType | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRec, setSelectedRec] = useState<Receptionist | undefined>(undefined);
  const [editRec, setEditRec] = useState<Receptionist | undefined>(undefined);

  // Password Modal
  const [passwordModal, setPasswordModal] = useState({ open: false, password: "", title: "" });

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch receptionists
  const fetchReceptionists = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };
      if (debouncedSearch) params.search = debouncedSearch;

      const res = await receptionistService.getReceptionists(HOSPITAL_ID, params);
      setReceptionists(res.data);
      setStats(res.stats);
      setTotalPages(res.meta.totalPages);
    } catch {
      toast.error("Failed to load receptionists");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchReceptionists();
  }, [fetchReceptionists]);

  // --- Handlers ---
  const handleCreate = () => {
    setEditRec(undefined);
    setIsFormOpen(true);
  };

  const handleView = (rec: Receptionist) => {
    setSelectedRec(rec);
    setIsDetailOpen(true);
  };

  const handleEdit = (rec: Receptionist) => {
    setIsDetailOpen(false);
    setEditRec(rec);
    setIsFormOpen(true);
  };

  const handleFormSuccess = (password?: string) => {
    setIsFormOpen(false);
    fetchReceptionists();
    if (password) {
      setPasswordModal({
        open: true,
        password,
        title: editRec ? "Password Reset" : "Receptionist Created",
      });
    }
  };

  const handleToggleStatus = async (rec: Receptionist) => {
    try {
      await receptionistService.toggleStatus(rec.user_id);
      toast.success(`Receptionist ${rec.status === "Active" ? "deactivated" : "activated"} successfully`);
      fetchReceptionists();
      if (isDetailOpen && selectedRec?.user_id === rec.user_id) {
        setIsDetailOpen(false);
      }
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  const handleResetPassword = async (rec: Receptionist) => {
    try {
      const res = await receptionistService.resetPassword(rec.user_id);
      setPasswordModal({
        open: true,
        password: res.generatedPassword,
        title: "Password Reset",
      });
    } catch {
      toast.error("Failed to reset password");
    }
  };

  return (
    <main className="min-h-screen bg-background p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Receptionist Management</h1>
        <p className="text-muted-foreground">Manage front-desk staff, account access, and contact details.</p>
      </div>

      <ReceptionistStats stats={stats} loading={loading} />

      <ReceptionistFilters 
        viewMode={viewMode}
        setViewMode={setViewMode}
        search={search}
        setSearch={setSearch}
        onAdd={handleCreate}
      />

      {/* Content */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-card">
            <div className="animate-pulse flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground">Loading receptionists...</p>
            </div>
          </div>
        ) : receptionists.length > 0 ? (
          <>
            {viewMode === "table" ? (
              <ReceptionistsTable 
                data={receptionists} 
                onView={handleView}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
                onResetPassword={handleResetPassword}
              />
            ) : (
              <ReceptionistsCardGrid 
                data={receptionists} 
                onView={handleView}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
                onResetPassword={handleResetPassword}
              />
            )}
            <div className="pt-2 border-t border-border mt-4">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-card">
            <p className="text-muted-foreground">No receptionists found matching your search.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ReceptionistFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        defaultValues={editRec}
        hospitalId={HOSPITAL_ID}
        onSuccess={handleFormSuccess}
      />

      <ReceptionistDetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        receptionist={selectedRec}
        onEdit={() => handleEdit(selectedRec!)}
        onResetPassword={() => selectedRec && handleResetPassword(selectedRec)}
      />

      {/* Password Modal */}
      <PasswordModal
        isOpen={passwordModal.open}
        onClose={() => setPasswordModal({ open: false, password: "", title: "" })}
        password={passwordModal.password}
        title={passwordModal.title}
      />

    </main>
  );
}