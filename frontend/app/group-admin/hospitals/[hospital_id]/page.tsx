"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import HospitalProfileSummary from "@/components/group-admin/hospitals/detail/HospitalProfileSummary";
import HospitalKpiCards from "@/components/group-admin/hospitals/detail/HospitalKpiCards";
import HospitalTabs from "@/components/group-admin/hospitals/detail/HospitalTabs";
import { mockHospital } from "@/types/hospital-monitor";

export default function HospitalMonitoringPage({ params }: { params: { hospital_id: string } }) {
  // In a real app, verify hospital_id with params.hospital_id logic
  
  return (
    <main className="h-full bg-background p-6 space-y-6">
      
      {/* Breadcrumb Context */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/group-admin/hospitals" className="hover:text-foreground transition-colors">
          Hospitals
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium text-foreground">{mockHospital.name}</span>
      </div>

      {/* 1. Identity & Summary */}
      <HospitalProfileSummary data={mockHospital} />

      {/* 2. Key Metrics */}
      <HospitalKpiCards stats={mockHospital.stats} />

      {/* 3. Deep Dive Tabs */}
      <HospitalTabs />

    </main>
  );
}