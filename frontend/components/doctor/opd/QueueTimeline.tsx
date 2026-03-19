"use client";

import { Card } from "@/components/ui/card";
import { TimelineEvent } from "@/types/opd-queue";
import { CheckCircle2, PlayCircle, Settings, XCircle } from "lucide-react";

export default function QueueTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <Card className="p-5 border-border shadow-sm flex-1 overflow-y-auto">
      <h3 className="font-bold text-foreground mb-4 border-b border-border pb-2">Live Timeline</h3>
      <div className="space-y-4">
        {events.map((event, i) => (
          <div key={event.id} className="flex gap-3 relative">
            {i !== events.length - 1 && <div className="absolute left-2.5 top-6 bottom-[-16px] w-0.5 bg-border" />}
            <div className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center bg-background shrink-0 mt-0.5">
              {event.type === "System" && <Settings className="w-4 h-4 text-muted-foreground" />}
              {event.type === "Start" && <PlayCircle className="w-4 h-4 text-primary" />}
              {event.type === "Complete" && <CheckCircle2 className="w-4 h-4 text-success" />}
              {event.type === "Skip" && <XCircle className="w-4 h-4 text-destructive" />}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{event.message}</p>
              <p className="text-[10px] text-muted-foreground font-mono">{event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}