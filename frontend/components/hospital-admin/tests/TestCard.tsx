"use client";

import { MedicalTest, HospitalTest } from "@/types/medical-test";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings2, Activity, FlaskConical } from "lucide-react";
import TestTooltip from "./TestTooltip";

interface Props {
  test: MedicalTest | HospitalTest;
  type: "master" | "enabled";
  onAction: (t: any) => void;
}

export default function TestCard({ test, type, onAction }: Props) {
  const isEnabled = type === "enabled";
  const hospitalTest = test as HospitalTest;
  const isActive = isEnabled ? hospitalTest.isActive : false;

  return (
    <TestTooltip description={test.description} department={test.department_name} type={test.test_type} date={test.created_at}>
      <Card className={`p-4 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default border-2
        ${!isEnabled ? 'bg-muted/10 border-dashed border-border opacity-90' : ''}
        ${isEnabled && !isActive ? 'bg-muted/30 border-border opacity-75 grayscale-[20%]' : ''}
        ${isEnabled && isActive ? 'bg-card border-border border-solid' : ''}
      `}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 pr-2">
            <h3 className="font-bold text-foreground text-base leading-tight line-clamp-2">{test.test_name}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <p className="text-[11px] font-mono text-primary font-semibold bg-primary/10 px-1.5 rounded">{test.test_code}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{test.test_type}</p>
            </div>
          </div>
          {isEnabled && (
            <Badge variant="outline" className={`shrink-0 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${isActive ? 'bg-success/10 text-success border-success/20' : 'bg-muted text-muted-foreground border-border'}`}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          )}
        </div>

        <div className="mb-4 flex-1 mt-2">
          <Badge variant="secondary" className="text-[10px] font-medium flex items-center gap-1 w-max text-muted-foreground">
             <Activity className="w-3 h-3" /> {test.department_name}
          </Badge>
        </div>

        <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between gap-3">
          {isEnabled && (
            <div className="font-black text-lg text-foreground tracking-tight">
              ₹ {hospitalTest.price}
            </div>
          )}
          
          {!isEnabled ? (
            <Button variant="outline" size="sm" className="w-full gap-2 hover:bg-primary/10 hover:text-primary border-border transition-colors" onClick={() => onAction(test)}>
              <Plus className="w-3.5 h-3.5" /> Enable Test
            </Button>
          ) : (
            <Button variant="secondary" size="sm" className="flex-1 gap-2 bg-muted hover:bg-muted/80 text-foreground transition-colors" onClick={() => onAction(test)}>
              <Settings2 className="w-3.5 h-3.5" /> Manage Settings
            </Button>
          )}
        </div>
      </Card>
    </TestTooltip>
  );
}