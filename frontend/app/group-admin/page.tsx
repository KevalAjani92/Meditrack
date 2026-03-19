"use client";

import { motion } from "framer-motion";
import KpiCards from "@/components/group-admin/dashboard/KpiCards";
import QuickActionsPanel from "@/components/group-admin/dashboard/QuickActionsPanel";
import TopHospitalsPanel from "@/components/group-admin/dashboard/TopHospitalsPanel";
import RevenueTrendChart from "@/components/group-admin/dashboard/RevenueTrendChart";
import GrowthComparisonChart from "@/components/group-admin/dashboard/GrowthComparisonChart";
import HospitalPerformanceCharts from "@/components/group-admin/dashboard/HospitalPerformanceCharts";
import ActivityFeed from "@/components/group-admin/dashboard/ActivityFeed";

export default function GroupAdminDashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.main
      className="min-h-screen bg-background p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Executive Overview
        </h1>
        <p className="text-muted-foreground">
          Group-level performance metrics, financials, and operational insights.
        </p>
      </div>

      {/* Row 1: KPI Cards */}
      <motion.div variants={itemVariants}>
        <KpiCards />
      </motion.div>

      {/* Row 2: Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Column: Charts & Trends (3/4 width on huge screens) */}
        <div className="xl:col-span-3 space-y-6">
          {/* Revenue & Growth Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="h-full">
              <RevenueTrendChart />
            </motion.div>
            <motion.div variants={itemVariants} className="h-full">
              <GrowthComparisonChart />
            </motion.div>
          </div>

          {/* Performance Metrics Row */}
          <motion.div variants={itemVariants}>
            <HospitalPerformanceCharts />
          </motion.div>
        </div>

        {/* Right Column: Sidebar Actions & Feeds (1/4 width) */}
        <div className="xl:col-span-1 space-y-6">
          <motion.div variants={itemVariants}>
            <QuickActionsPanel />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <TopHospitalsPanel />
          </motion.div>

          <motion.div variants={itemVariants}>
            <ActivityFeed />
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}