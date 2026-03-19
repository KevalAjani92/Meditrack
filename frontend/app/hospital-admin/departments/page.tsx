"use client";

import { useState, useMemo } from "react";
import DepartmentStats from "@/components/hospital-admin/departments/DepartmentStats";
import AvailableDepartmentsSection from "@/components/hospital-admin/departments/AvailableDepartmentsSection";
import HospitalDepartmentsSection from "@/components/hospital-admin/departments/HospitalDepartmentsSection";
import AddDepartmentModal from "@/components/hospital-admin/departments/AddDepartmentModal";
import EditDepartmentModal from "@/components/hospital-admin/departments/EditDepartmentModal";

import { Department, HospitalDepartment } from "@/types/department";
import { useAuth } from "@/context/auth-context";
import { useDepartmentStats, useEnabledDepartments, useEnableDepartment, useMasterDepartments, useUpdateDepartmentStatus } from "@/hooks/departments/useDepartments";

export default function HospitalDepartmentsPage() {
  const {user} = useAuth();
  const hospitalId = Number(user?.hospitalid);
  

  // Search States
  const [masterSearch, setMasterSearch] = useState("");
  const [enabledSearch, setEnabledSearch] = useState("");

  // Modal States
  const [addModalDept, setAddModalDept] = useState<Department | null>(null);
  const [editModalDept, setEditModalDept] = useState<HospitalDepartment | null>(null);

  const { data: masterData } = useMasterDepartments(hospitalId, masterSearch);
  const { data: enabledData } = useEnabledDepartments(hospitalId, enabledSearch);
  const { data: statsData } = useDepartmentStats(hospitalId);

  const masterList = masterData ?? [];
  const enabledList = enabledData ?? [];
  // console.log(enabledList);
  

  const stats = statsData ?? {
    totalMaster: 0,
    totalEnabled: 0,
    activeCount: 0,
    inactiveCount: 0,
  };

  /*
  MUTATIONS
  */

  const enableDepartmentMutation = useEnableDepartment(hospitalId);
  const updateStatusMutation = useUpdateDepartmentStatus(hospitalId);

  /*
  HANDLERS
  */

  const handleEnableDepartment = (deptId: string, isActive: boolean) => {
    enableDepartmentMutation.mutate({
      hospitalId,
      department_id: Number(deptId),
      isActive,
    });

    setAddModalDept(null);
  };

  const handleUpdateStatus = (hospitalDepartmentId: number, isActive: boolean) => {
    updateStatusMutation.mutate({
      hospitalDepartmentId: Number(hospitalDepartmentId),
      isActive,
    });

    setEditModalDept(null);
  };

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Departments Management</h1>
        <p className="text-muted-foreground">Configure and manage clinical departments available in your hospital.</p>
      </div>

      <DepartmentStats 
        totalMaster={stats.totalMaster}
        totalEnabled={stats.totalEnabled}
        activeCount={stats.activeCount}
        inactiveCount={stats.inactiveCount}
      />

      {/* Main Grid Layout for Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Left Section: Master Catalog */}
        <AvailableDepartmentsSection 
          departments={masterList}
          search={masterSearch}
          onSearchChange={setMasterSearch}
          onAdd={setAddModalDept}
        />

        {/* Right Section: Enabled in Hospital */}
        <HospitalDepartmentsSection 
          departments={enabledList}
          search={enabledSearch}
          onSearchChange={setEnabledSearch}
          onEdit={setEditModalDept}
        />

      </div>

      {/* Modals */}
      <AddDepartmentModal 
        isOpen={addModalDept !== null} 
        onClose={() => setAddModalDept(null)} 
        department={addModalDept} 
        onAdd={handleEnableDepartment} 
      />

      <EditDepartmentModal 
        isOpen={editModalDept !== null} 
        onClose={() => setEditModalDept(null)} 
        department={editModalDept} 
        onSave={handleUpdateStatus} 
      />

    </main>
  );
}