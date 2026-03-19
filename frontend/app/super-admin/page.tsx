"use client";
import { motion } from "framer-motion";
import StatsCards from "@/components/superadmin/overview/StatsCards";
import SystemStatusCard from "@/components/superadmin/overview/SystemStatusCard";
import AlertsPanel from "@/components/superadmin/overview/AlertsPanel";
import QuickActions from "@/components/superadmin/overview/QuickActions";
import AnalyticsCharts from "@/components/superadmin/overview/AnalyticsCharts";

export default function SuperAdminDashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
      <motion.main
      className="min-h-screen bg-background p-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row gap-6 lg:items-start justify-between">
        <motion.div variants={itemVariants} className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            System health, growth metrics, and administrative controls.
          </p>
        </motion.div>
      </div>


      {/* 2. Key Metrics */}
      <motion.div variants={itemVariants}>
        <StatsCards />
      </motion.div>
      <motion.div variants={itemVariants}>
        <QuickActions />
      </motion.div>

      {/* 3. Analytics & Visualizations (New Section) */}
      <motion.div variants={itemVariants}>
        <AnalyticsCharts />
      </motion.div>

      {/* 4. Operational Status & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <SystemStatusCard />
        </motion.div>
        
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <AlertsPanel />
        </motion.div>
      </div>

    </motion.main>
  );
}
