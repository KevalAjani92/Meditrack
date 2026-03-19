"use client";

import { useState, useEffect, useCallback } from "react";
import { Pagination } from "@/components/ui/Pagination";
import DoctorStats from "@/components/hospital-admin/doctors/DoctorStats";
import DoctorFilters from "@/components/hospital-admin/doctors/DoctorFilters";
import DoctorsTable from "@/components/hospital-admin/doctors/DoctorsTable";
import DoctorsCardGrid from "@/components/hospital-admin/doctors/DoctorsCardGrid";
import DoctorFormModal from "@/components/hospital-admin/doctors/DoctorFormModal";
import PasswordModal from "@/components/hospital-admin/shared/PasswordModal";
import {
  Doctor,
  DoctorStats as DoctorStatsType,
  DepartmentDropdown,
} from "@/types/doctor";
import { doctorService } from "@/services/doctor.service";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";


const ITEMS_PER_PAGE = 8;

export default function DoctorsPage() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useAuth();
  const HOSPITAL_ID = user?.hospitalid ?? null;
  

  // Data State
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [stats, setStats] = useState<DoctorStatsType | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<DepartmentDropdown[]>([]);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editDoctor, setEditDoctor] = useState<Doctor | undefined>(undefined);

  // Password Modal
  const [passwordModal, setPasswordModal] = useState({
    open: false,
    password: "",
    title: "",
  });

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch departments for dropdown
  useEffect(() => {
    doctorService
      .getDepartmentDropdown(HOSPITAL_ID)
      .then((res) => {
        setDepartments(res);
      })
      .catch(() => {});
  }, []);

  // Fetch doctors
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (departmentFilter !== "All")
        params.department_id = parseInt(departmentFilter);

      const res = await doctorService.getDoctors(HOSPITAL_ID, params);
      setDoctors(res.data);
      setStats(res.stats);
      setTotalPages(res.meta.totalPages);
    } catch {
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, departmentFilter]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [departmentFilter]);

  // Handlers
  const handleAdd = () => {
    setEditDoctor(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditDoctor(doctor);
    setIsFormOpen(true);
  };

  const handleFormSuccess = (password?: string) => {
    setIsFormOpen(false);
    fetchDoctors();
    if (password) {
      setPasswordModal({
        open: true,
        password,
        title: editDoctor ? "Password Reset" : "Doctor Created",
      });
    }
  };

  const handleToggleStatus = async (doctor: Doctor) => {
    try {
      await doctorService.toggleStatus(doctor.doctor_id);
      toast.success(
        `Doctor ${doctor.status === "Active" ? "deactivated" : "activated"} successfully`,
      );
      fetchDoctors();
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  const handleResetPassword = async (doctor: Doctor) => {
    try {
      const res = await doctorService.resetPassword(doctor.doctor_id);
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
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Doctors Management
        </h1>
        <p className="text-muted-foreground">
          Manage medical staff profiles, availability, and assignments.
        </p>
      </div>

      <DoctorStats stats={stats} loading={loading} />

      <DoctorFilters
        viewMode={viewMode}
        setViewMode={setViewMode}
        search={search}
        setSearch={setSearch}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        departments={departments}
        onAdd={handleAdd}
      />

      {/* Content */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-card">
            <div className="animate-pulse flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground">Loading doctors...</p>
            </div>
          </div>
        ) : doctors.length > 0 ? (
          <>
            {viewMode === "table" ? (
              <DoctorsTable
                data={doctors}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
                onResetPassword={handleResetPassword}
              />
            ) : (
              <DoctorsCardGrid
                data={doctors}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
                onResetPassword={handleResetPassword}
              />
            )}
            <div className="pt-2 border-t border-border mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-card">
            <p className="text-muted-foreground">
              No doctors found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <DoctorFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        defaultValues={editDoctor}
        departments={departments}
        hospitalId={HOSPITAL_ID}
        onSuccess={handleFormSuccess}
      />

      {/* Password Modal */}
      <PasswordModal
        isOpen={passwordModal.open}
        onClose={() =>
          setPasswordModal({ open: false, password: "", title: "" })
        }
        password={passwordModal.password}
        title={passwordModal.title}
      />
    </main>
  );
}
