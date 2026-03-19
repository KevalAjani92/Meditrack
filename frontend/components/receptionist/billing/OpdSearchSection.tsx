"use client";

import { useState, useMemo } from "react";
import { Search, Receipt, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { OpdVisit, mockOpdVisits } from "@/types/billing";

interface Props {
  onSelectVisit: (visit: OpdVisit) => void;
}

export default function OpdSearchSection({ onSelectVisit }: Props) {
  const [selectedOpdNo, setSelectedOpdNo] = useState("");
  const [searchResult, setSearchResult] = useState<OpdVisit | null>(null);

  const opdOptions = useMemo(() => {
    return mockOpdVisits.map(v => ({
      label: `${v.opdNo} - ${v.patientName} (${v.status})`,
      value: v.opdNo
    }));
  }, []);

  const handleSearch = () => {
    const visit = mockOpdVisits.find(v => v.opdNo === selectedOpdNo);
    setSearchResult(visit || null);
  };

  return (
    <Card className="p-5 border-border shadow-sm mb-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 w-full space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Search OPD Visit</label>
          <SearchableSelect 
            options={opdOptions}
            value={selectedOpdNo}
            onChange={setSelectedOpdNo}
            placeholder="Search by OPD No or Patient Name..."
            emptyMessage="No visits found."
          />
        </div>
        <Button onClick={handleSearch} className="gap-2 shrink-0">
          <Search className="w-4 h-4" /> Find Visit
        </Button>
      </div>

      {searchResult && (
        <div className="mt-6 overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3">OPD No</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="px-4 py-3 font-mono font-medium">{searchResult.opdNo}</td>
                <td className="px-4 py-3 font-medium text-foreground">{searchResult.patientName}</td>
                <td className="px-4 py-3 text-muted-foreground">{searchResult.doctorName}</td>
                <td className="px-4 py-3 text-muted-foreground">{searchResult.visitDate}</td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className={
                    searchResult.status === "Billed" 
                      ? "bg-success/10 text-success border-success/20" 
                      : "bg-warning/10 text-warning-foreground border-warning/20"
                  }>
                    {searchResult.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  {searchResult.status === "Billed" ? (
                    <Button size="sm" variant="outline" onClick={() => onSelectVisit(searchResult)} className="gap-1.5 text-primary border-primary/30 hover:bg-primary/5">
                      <Eye className="w-3.5 h-3.5" /> View Bill
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => onSelectVisit(searchResult)} className="gap-1.5">
                      <Receipt className="w-3.5 h-3.5" /> Generate Bill
                    </Button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}