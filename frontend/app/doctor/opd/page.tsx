"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Settings2 } from "lucide-react";

import QueueInsightCards from "@/components/doctor/opd/QueueInsightCards";
import CurrentTokenPanel from "@/components/doctor/opd/CurrentTokenPanel";
import NextPatientControls from "@/components/doctor/opd/NextPatientControls";
import QueueFilters from "@/components/doctor/opd/QueueFilters";
import QueueTable from "@/components/doctor/opd/QueueTable";
import QueueProgressIndicator from "@/components/doctor/opd/QueueProgressIndicator";
import QueueTimeline from "@/components/doctor/opd/QueueTimeline";
import DoctorPerformancePanel from "@/components/doctor/opd/DoctorPerformancePanel";

import {
  mockQueue,
  mockTimelineEvents,
  OpdToken,
  TimelineEvent,
} from "@/types/opd-queue";
import { Pagination } from "@/components/ui/Pagination"; // Assuming existing UI component
import {
  useDoctorPerformance,
  useDoctorQueue,
} from "@/hooks/doctors/useDoctors";

export default function LiveOpdQueuePage() {
  // const [queue, setQueue] = useState<OpdToken[]>(mockQueue);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(
    [...mockTimelineEvents].reverse(),
  ); // Newest first

  const [filters, setFilters] = useState({
    search: "",
    type: "All",
    status: "All",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useDoctorQueue({
    page: currentPage,
    limit: 10,
    search: filters.search,
    status: filters.status,
    type: filters.type,
  });

  const queue: OpdToken[] = data?.data || [];
  const meta = data?.meta;
  const stats = data?.stats;

  const { data: performance } = useDoctorPerformance();

  // Derived State
  const currentToken = queue.find((q) => q.status === "In Progress") || null;

  // Sort logic: Emergency first, then by wait time (descending)
  const sortedQueue = [...queue].sort((a, b) => {
    if (a.isEmergency !== b.isEmergency) return a.isEmergency ? -1 : 1;
    return b.waitTimeMins - a.waitTimeMins;
  });

  const nextPatient = sortedQueue.find((q) => q.status === "Waiting") || null;

  // Handlers
  const addEvent = (msg: string, type: TimelineEvent["type"]) => {
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      message: msg,
      type,
    };
    setTimeline((prev) => [newEvent, ...prev]);
  };

  const handleCallNext = (id: string) => {
    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "In Progress" } : q)),
    );
    const pt = queue.find((q) => q.id === id);
    if (pt) addEvent(`Token ${pt.tokenNo} Started`, "Start");
  };

  const handleSkip = (id: string) => {
    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "Skipped" } : q)),
    );
    const pt = queue.find((q) => q.id === id);
    if (pt) addEvent(`Token ${pt.tokenNo} Skipped`, "Skip");
  };

  const handleNoShow = (id: string) => {
    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "No-Show" } : q)),
    );
    const pt = queue.find((q) => q.id === id);
    if (pt) addEvent(`Token ${pt.tokenNo} No-Show`, "Skip");
  };

  // Stats
  const completedCount = queue.filter((q) => q.status === "Completed").length;

  if (isLoading) {
    return <div className="p-6">Loading OPD Queue...</div>;
  }

  return (
    <main className="min-h-full bg-background p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Live OPD Queue
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time patient flow and consultation management.
          </p>
        </div>
        <Badge
          variant="outline"
          className="px-3 py-1.5 bg-background border-border text-foreground flex items-center gap-2 font-medium"
        >
          <Settings2 className="w-3.5 h-3.5 text-primary" /> Queue Active
          (Opened 09:00 AM)
        </Badge>
      </div>

      <QueueInsightCards queue={stats} />

      {/* Main Focus Area */}
      <div className="space-y-4">
        {currentToken ? (
          <CurrentTokenPanel
            token={currentToken}
            onSkip={handleSkip}
            onNoShow={handleNoShow}
          />
        ) : (
          <NextPatientControls
            nextPatient={nextPatient}
            onCallNext={handleCallNext}
          />
        )}
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* Left: Table Area */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          <QueueFilters filters={filters} setFilters={setFilters} />
          <QueueTable queue={queue} onCall={handleCallNext} />

          <div className="flex items-center justify-between mt-2">
            <div className="flex-1 mr-6">
              <QueueProgressIndicator
                completed={completedCount}
                total={queue.length}
              />
            </div>
            <Pagination
              currentPage={meta?.page || 1}
              totalPages={meta?.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        {/* Right: Side Panels */}
        <div className="xl:col-span-1 flex flex-col gap-6 h-[700px]">
          <DoctorPerformancePanel data={performance} />
          <QueueTimeline events={timeline} />
        </div>
      </div>
    </main>
  );
}
