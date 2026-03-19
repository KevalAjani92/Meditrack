"use client";

import { Download, FileText, Sheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ReportFilters } from "@/types/reports";

export default function ExportActions({ filters }: { filters: ReportFilters }) {
  const handleExport = (format: string) => {
    const filename = `group-report-${filters.dateRange}-${new Date().toISOString().split('T')[0]}.${format}`;
    console.log(`Exporting ${filename}...`);
    // Add real export logic here
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export Report
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[160px] bg-popover text-popover-foreground rounded-lg border border-border shadow-lg p-1 z-50 animate-in fade-in zoom-in-95 duration-100"
          align="end"
          sideOffset={5}
        >
          <DropdownMenu.Item onClick={() => handleExport('csv')} className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <FileText className="w-4 h-4" /> CSV File
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => handleExport('xlsx')} className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <Sheet className="w-4 h-4" /> Excel Sheet
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => handleExport('pdf')} className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <FileText className="w-4 h-4" /> PDF Document
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}