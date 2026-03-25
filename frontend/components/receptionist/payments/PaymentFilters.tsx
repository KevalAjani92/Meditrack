"use client";

import { useEffect, useState } from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { billingPaymentsService } from "@/services/billing-payments.service";

interface FilterState {
  search: string;
  fromDate: string;
  toDate: string;
  mode: string;
  status: string;
}

interface Props {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onApply: () => void;
  onReset: () => void;
}

export default function PaymentFilters({ filters, setFilters, onApply, onReset }: Props) {
  const [modes, setModes] = useState<{ paymentModeId: number; paymentModeName: string }[]>([]);

  useEffect(() => {
    billingPaymentsService.getPaymentModes().then(res => {
      setModes(res || []);
    }).catch(() => {});
  }, []);

  const handleChange = (field: keyof FilterState, val: string) => {
    setFilters(prev => ({ ...prev, [field]: val }));
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:ring-1 focus:ring-primary outline-none";

  return (
    <Card className="p-4 border-border shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            value={filters.search} onChange={e => handleChange("search", e.target.value)} 
            placeholder="Search Patient, Bill No, Phone, Ref..." 
            className={`pl-9 ${inputClass}`} 
          />
        </div>

        <div className="flex items-center gap-2 lg:col-span-2">
          <input type="date" value={filters.fromDate} onChange={e => handleChange("fromDate", e.target.value)} className={inputClass} title="From Date" />
          <span className="text-muted-foreground">-</span>
          <input type="date" value={filters.toDate} onChange={e => handleChange("toDate", e.target.value)} className={inputClass} title="To Date" />
        </div>

        <select value={filters.mode} onChange={e => handleChange("mode", e.target.value)} className={inputClass}>
          <option value="All">All Modes</option>
          {modes.map(m => (
            <option key={m.paymentModeId} value={m.paymentModeName}>{m.paymentModeName}</option>
          ))}
        </select>

        <select value={filters.status} onChange={e => handleChange("status", e.target.value)} className={inputClass}>
          <option value="All">All Statuses</option>
          <option value="Success">Success</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>

      </div>
      
      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
         <Button variant="ghost" onClick={onReset} className="gap-1.5 text-muted-foreground">
           <RotateCcw className="w-3.5 h-3.5" /> Reset
         </Button>
         <Button onClick={onApply} className="gap-1.5">
           <Filter className="w-3.5 h-3.5" /> Apply Filters
         </Button>
      </div>
    </Card>
  );
}