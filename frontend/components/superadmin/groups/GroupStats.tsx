"use client";

import { Building, CheckCircle2, AlertTriangle, Ban } from "lucide-react";
import { StatsCard } from "@/components/common/StatsCard";
import { useQuery } from "@tanstack/react-query";
import { groupService } from "@/services/group.service";

export default function GroupStats() {
  const { data, isLoading } = useQuery({
    queryKey: ["group-stats"],
    queryFn: groupService.getGroupStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const stats = data || {
    total: 0,
    active: 0,
    inactive: 0,
    expiringSoon: 0,
  };

  const statsConfig = [
    {
      label: "Total Groups",
      value: stats.total,
      icon: Building,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Groups",
      value: stats.active,
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Expiring Soon",
      value: stats.expiringSoon,
      icon: AlertTriangle,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Inactive",
      value: stats.inactive,
      icon: Ban,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsConfig.map((stat, i) => (
        <StatsCard
          key={i}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          iconColor={stat.color}
          iconBg={stat.bg}
        />
      ))}
    </div>
  );
}
