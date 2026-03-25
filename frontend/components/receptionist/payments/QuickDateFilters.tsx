"use client";

import { useState } from "react";

interface Props {
  onSelectRange: (from: string, to: string, days: number) => void;
  selected: number | null;
}

export default function QuickDateFilters({ onSelectRange, selected }: Props) {

  const handleQuickSelect = (days: number) => {
    const to = new Date();
    const from = new Date();

    if (days === 1) {
      from.setDate(from.getDate() - 1);
      to.setDate(to.getDate() - 1);
    } else {
      from.setDate(from.getDate() - days);
    }

    onSelectRange(
      from.toISOString().split("T")[0],
      to.toISOString().split("T")[0],
      days
    );
  };

  const getClass = (days: number) =>
    `px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
      selected === days
        ? "bg-primary text-white shadow-md scale-105"
        : "bg-secondary text-secondary-foreground hover:bg-muted"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">
        Quick Dates:
      </span>

      <button onClick={() => handleQuickSelect(0)} className={getClass(0)}>Today</button>
      <button onClick={() => handleQuickSelect(1)} className={getClass(1)}>Yesterday</button>
      <button onClick={() => handleQuickSelect(7)} className={getClass(7)}>Last 7 Days</button>
      <button onClick={() => handleQuickSelect(30)} className={getClass(30)}>Last 30 Days</button>
    </div>
  );
}