"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { LayoutDashboard, Stethoscope, Users, Building, BarChart3 } from "lucide-react";
import OverviewTab from "./OverviewTab";
import DoctorsTab from "./DoctorsTab";
import StaffTab from "./StaffTab";
import DepartmentsTab from "./DepartmentsTab";
import AnalyticsTab from "./AnalyticsTab";
import { mockDoctors, mockStaff, mockDepartments } from "@/types/hospital-monitor";

export default function HospitalTabs() {
  return (
    <Tabs.Root defaultValue="overview" className="flex flex-col gap-6">
      
      {/* Tab Navigation */}
      <Tabs.List className="flex items-center gap-1 border-b border-border overflow-x-auto no-scrollbar">
        <TabTrigger value="overview" icon={LayoutDashboard} label="Overview" />
        <TabTrigger value="doctors" icon={Stethoscope} label="Doctors" />
        <TabTrigger value="staff" icon={Users} label="Staff" />
        <TabTrigger value="departments" icon={Building} label="Departments" />
        <TabTrigger value="analytics" icon={BarChart3} label="Analytics" />
      </Tabs.List>

      {/* Tab Content Areas */}
      <div className="min-h-[400px]">
        <Tabs.Content value="overview" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <OverviewTab />
        </Tabs.Content>
        
        <Tabs.Content value="doctors" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <DoctorsTab data={mockDoctors} />
        </Tabs.Content>

        <Tabs.Content value="staff" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <StaffTab data={mockStaff} />
        </Tabs.Content>

        <Tabs.Content value="departments" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <DepartmentsTab data={mockDepartments} />
        </Tabs.Content>

        <Tabs.Content value="analytics" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <AnalyticsTab />
        </Tabs.Content>
      </div>

    </Tabs.Root>
  );
}

// Helper Component for Tab Triggers
function TabTrigger({ value, icon: Icon, label }: { value: string; icon: any; label: string }) {
  return (
    <Tabs.Trigger
      value={value}
      className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground border-b-2 border-transparent transition-all hover:text-foreground data-[state=active]:text-primary data-[state=active]:border-primary outline-none whitespace-nowrap"
    >
      <Icon className="w-4 h-4" />
      {label}
    </Tabs.Trigger>
  );
}