"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";

interface Props {
  children: React.ReactNode;
  description: string;
  department: string;
  date: string;
}

export default function DiagnosisTooltip({ children, description, department, date }: Props) {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content 
            side="top" 
            align="center"
            className="z-50 max-w-xs p-4 bg-popover text-popover-foreground border border-border rounded-lg shadow-xl animate-in fade-in zoom-in-95 text-sm"
            sideOffset={5}
          >
            <div className="flex items-start gap-2 mb-2">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="font-medium text-foreground leading-snug">{description}</p>
            </div>
            <div className="border-t border-border mt-2 pt-2 space-y-1">
              <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Dept:</span> {department}</p>
              <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Created:</span> {date}</p>
            </div>
            <Tooltip.Arrow className="fill-popover" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}