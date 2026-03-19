"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination"; // Assumed existing from previous prompts
import MedicineStats from "@/components/superadmin/medicines/MedicineStats";
import MedicineFilters from "@/components/superadmin/medicines/MedicineFilters";
import MedicinesTable from "@/components/superadmin/medicines/MedicinesTable";
import MedicinesCardGrid from "@/components/superadmin/medicines/MedicinesCardGrid";
import MedicineFormModal from "@/components/superadmin/medicines/MedicineFormModal";
import MedicineDetailModal from "@/components/superadmin/medicines/MedicineDetailModal";
import { mockMedicines, Medicine } from "@/types/medicine";
import { useMedicines } from "@/hooks/medicines/useMedicines";

const ITEMS_PER_PAGE = 8;

export default function MedicineClient() {
  // 1. UI State
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [currentPage, setCurrentPage] = useState(1);

  // 2. Modals State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<
    Medicine | undefined
  >(undefined);
  const [editMedicine, setEditMedicine] = useState<Medicine | undefined>(
    undefined,
  );
  // 🔹 Query Params
  const queryParams = useMemo(() => {
    return {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: search || undefined,
      type: typeFilter === "All" ? undefined : typeFilter,
      status: statusFilter !== "All" ? statusFilter : undefined,
    };
  }, [currentPage, search, typeFilter, statusFilter]);

  const { data, isLoading, isFetching } = useMedicines(queryParams);

  const medicines = data?.data || [];
  const meta = data?.meta;
  const stats = data?.stats;

  // --- Handlers ---
  const handleCreate = () => {
    setEditMedicine(undefined);
    setIsFormOpen(true);
  };

  const handleViewDetail = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsDetailOpen(true);
  };

  const handleEdit = (medicine: Medicine) => {
    setIsDetailOpen(false); // Close detail first
    setEditMedicine(medicine);
    setTimeout(() => setIsFormOpen(true), 150); // Smooth transition
  };

  return (
    <main className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Medicines
          </h1>
          <p className="text-muted-foreground">
            Manage pharmaceutical inventory codes and formulary.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Add Medicine
        </Button>
      </div>

      <MedicineStats stats={stats} />

      <MedicineFilters
        viewMode={viewMode}
        setViewMode={setViewMode}
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Main Content */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="h-40 flex items-center justify-center text-muted-foreground">
            Loading medicines...
          </div>
        ) : medicines.length > 0 ? (
          <>
            {viewMode === "table" ? (
              <MedicinesTable
                data={medicines}
                onViewDetail={handleViewDetail}
                onEdit={handleEdit}
              />
            ) : (
              <MedicinesCardGrid
                data={medicines}
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
              No medicines found matching your filters.
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSearch("");
                setTypeFilter("All");
                setStatusFilter("All");
              }}
              className="mt-2"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <MedicineFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        defaultValues={editMedicine}
      />

      <MedicineDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        medicine={selectedMedicine}
        onEdit={handleEdit}
      />
    </main>
  );
}
