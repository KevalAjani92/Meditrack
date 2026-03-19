"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReportsFilters from "@/components/group-admin/reports/ReportsFilters";
import KpiSummaryCards from "@/components/group-admin/reports/KpiSummaryCards";
import HospitalSummaryTable from "@/components/group-admin/reports/HospitalSummaryTable";
import AppointmentTrendChart from "@/components/group-admin/reports/AppointmentTrendChart";
import RevenueTrendChart from "@/components/group-admin/reports/RevenueTrendChart";
import HospitalComparisonChart from "@/components/group-admin/reports/HospitalComparisonChart";
import { ReportFilters, mockKpiData, mockHospitalSummary, mockTrendData } from "@/types/reports";

export default function GroupReportsPage() {
  
  // 1. Centralized Filter State
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: "this-month",
    hospitalId: "all",
    departmentId: "all",
    compareMode: false,
  });

  // 2. Mock Data Fetch Effect
  // In real app: fetch(`/api/reports?range=${filters.dateRange}...`)
  useEffect(() => {
    console.log("Fetching report data for:", filters);
  }, [filters]);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background p-6">
      
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics & Reporting</h1>
        <p className="text-muted-foreground">Consolidated performance metrics across the hospital group.</p>
      </div>

      {/* Filters (Sticky) */}
      <ReportsFilters filters={filters} setFilters={setFilters} />

      <motion.div 
        initial="hidden" 
        animate="visible" 
        transition={{ staggerChildren: 0.1 }}
      >
        {/* KPI Cards */}
        <motion.div variants={itemVariants}>
          <KpiSummaryCards data={mockKpiData} compareMode={filters.compareMode} />
        </motion.div>

        {/* Detailed Table */}
        <motion.div variants={itemVariants}>
          <HospitalSummaryTable data={mockHospitalSummary} />
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div variants={itemVariants}>
            <AppointmentTrendChart data={mockTrendData} compareMode={filters.compareMode} />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <RevenueTrendChart data={mockTrendData} />
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <HospitalComparisonChart />
               {/* Additional charts (NoShow, PatientGrowth) can go here following same pattern */}
            </div>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}