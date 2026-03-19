"use client";

import { DepartmentSummary } from "@/types/hospital-monitor";
import DepartmentClinicalCard from "./DepartmentClinicalCard";

export default function DepartmentsTab({ data }: { data: DepartmentSummary[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((dept) => (
        <DepartmentClinicalCard key={dept.id} data={dept} />
      ))}
    </div>
  );
}