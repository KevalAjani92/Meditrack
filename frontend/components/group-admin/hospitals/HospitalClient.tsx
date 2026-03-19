"use client";

import { useState, useMemo } from "react";
import { Pagination } from "@/components/ui/Pagination"; // Assumed existing
import HospitalStats from "@/components/group-admin/hospitals/HospitalStats";
import HospitalFilters from "@/components/group-admin/hospitals/HospitalFilters";
import HospitalsTable from "@/components/group-admin/hospitals/HospitalsTable";
import HospitalsCardGrid from "@/components/group-admin/hospitals/HospitalsCardGrid";
import HospitalFormModal from "@/components/group-admin/hospitals/HospitalFormModal";
import AssignAdminModal from "@/components/group-admin/hospitals/AssignAdminModal";
import {  Hospital } from "@/types/hospital";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useHospitals } from "@/hooks/hospitals/useHospitals";


const ITEMS_PER_PAGE = 6;

export default function HospitalClient() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | undefined>(undefined);
  const [editHospital, setEditHospital] = useState<Hospital | undefined>(undefined);

  const queryParams = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: search || undefined,
    };
  
    const { data, isLoading, isFetching } = useHospitals(queryParams);
  
    const hospitals = data?.data || [];
    const meta = data?.meta;
    const stats = data?.stats;

  // Handlers
  const handleAdd = () => {
    setEditHospital(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (hospital: Hospital) => {
    setEditHospital(hospital);
    setIsFormOpen(true);
  };

  const handleAssignAdmin = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setIsAssignOpen(true);
  };

  return (
    <main className="min-h-screen bg-background p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Hospital Management</h1>
          <p className="text-muted-foreground">Overview of all hospitals, clinics, and their administrative assignments.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Add Hospital
        </Button>
      </div>

      <HospitalStats stats={stats} />

      <HospitalFilters 
        viewMode={viewMode}
        setViewMode={setViewMode}
        search={search}
        setSearch={setSearch}
      />

      {/* Content */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="h-40 flex items-center justify-center text-muted-foreground">
            Loading Admins...
          </div>
        ) : hospitals.length > 0 ? (
          <>
            {viewMode === "table" ? (
              <HospitalsTable 
                data={hospitals} 
                onEdit={handleEdit} 
                onAssignAdmin={handleAssignAdmin} 
              />
            ) : (
              <HospitalsCardGrid 
                data={hospitals} 
                onEdit={handleEdit} 
                onAssignAdmin={handleAssignAdmin} 
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
            <p className="text-muted-foreground">No hospitals found matching your search.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <HospitalFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        defaultValues={editHospital}
      />

      <AssignAdminModal 
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        hospital={selectedHospital}
      />

    </main>
  );
}