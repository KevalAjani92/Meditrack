"use client";

import * as Tooltip from "@radix-ui/react-tooltip";

interface Props {
  children: React.ReactNode;
  description: string;
  date: string;
}

export default function DepartmentTooltip({ children, description, date }: Props) {
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
            className="z-50 max-w-xs p-3 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg animate-in fade-in zoom-in-95 text-sm"
            sideOffset={5}
          >
            <p className="font-medium mb-1.5">{description}</p>
            <p className="text-xs text-muted-foreground">Created: {date}</p>
            <Tooltip.Arrow className="fill-popover" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}