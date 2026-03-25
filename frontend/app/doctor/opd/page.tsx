"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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

import { OpdToken, TimelineEvent } from "@/types/opd-queue";
import { Pagination } from "@/components/ui/Pagination";
import { opdQueueService } from "@/services/opd-queue.service";
import { useSocket } from "@/hooks/useSocket";

export default function LiveOpdQueuePage() {
  const [queue, setQueue] = useState<OpdToken[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [performance, setPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({ search: "", type: "All", status: "All" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // ─── Data Fetchers ───────────────────────────────────────────

  const fetchQueue = useCallback(async () => {
    try {
      const res = await opdQueueService.getQueue({
        search: filters.search || undefined,
        status: filters.status !== "All" ? filters.status : undefined,
        type: filters.type !== "All" ? filters.type : undefined,
        page: currentPage,
        limit: 20,
      });
      setQueue(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotal(res.pagination.total);
    } catch (err) {
      console.error("Failed to fetch queue:", err);
    }
  }, [filters, currentPage]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await opdQueueService.getStats();
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  const fetchPerformance = useCallback(async () => {
    try {
      const res = await opdQueueService.getPerformance();
      setPerformance(res.data);
    } catch (err) {
      console.error("Failed to fetch performance:", err);
    }
  }, []);

  const fetchTimeline = useCallback(async () => {
    try {
      const res = await opdQueueService.getTimeline();
      setTimeline(res.data);
    } catch (err) {
      console.error("Failed to fetch timeline:", err);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchQueue(), fetchStats(), fetchPerformance(), fetchTimeline()]);
  }, [fetchQueue, fetchStats, fetchPerformance, fetchTimeline]);

  // ─── Initial Load ────────────────────────────────────────────

  useEffect(() => {
    setLoading(true);
    refreshAll().finally(() => setLoading(false));
  }, []);

  // Re-fetch queue when filters or page change
  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  // ─── Socket.IO Real-Time ─────────────────────────────────────

  const { isConnected, onQueueUpdate } = useSocket();

  useEffect(() => {
    onQueueUpdate(() => {
      // Refresh everything when a queue event is received
      refreshAll();
    });
  }, [onQueueUpdate, refreshAll]);

  // ─── Derived State ───────────────────────────────────────────

  const currentToken = queue.find((q) => q.status === "In Progress") || null;

  // Sort: Emergency first, then by wait time desc
  const sortedQueue = [...queue].sort((a, b) => {
    if (a.isEmergency !== b.isEmergency) return a.isEmergency ? -1 : 1;
    return b.waitTimeMins - a.waitTimeMins;
  });

  const nextPatient = sortedQueue.find((q) => q.status === "Waiting") || null;
  const completedCount = stats?.completed ?? queue.filter((q) => q.status === "Completed").length;

  // ─── Handlers ────────────────────────────────────────────────

  const handleCallNext = async (id: string) => {
    try {
      await opdQueueService.callNext(Number(id));
      await refreshAll();
    } catch (err: any) {
      console.error("Call next failed:", err);
      alert(err?.message || "Failed to call next patient.");
    }
  };

  const handleSkip = async (id: string) => {
    try {
      await opdQueueService.skip(Number(id));
      await refreshAll();
    } catch (err: any) {
      console.error("Skip failed:", err);
      alert(err?.message || "Failed to skip token.");
    }
  };

  const handleNoShow = async (id: string) => {
    try {
      await opdQueueService.noShow(Number(id));
      await refreshAll();
    } catch (err: any) {
      console.error("No show failed:", err);
      alert(err?.message || "Failed to mark no-show.");
    }
  };

  return (
    <main className="min-h-full bg-background p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Live OPD Queue
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'bg-success' : 'bg-warning'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-success' : 'bg-warning'}`}></span>
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">Real-time patient flow and consultation management.</p>
        </div>
        <Badge variant="outline" className="px-3 py-1.5 bg-background border-border text-foreground flex items-center gap-2 font-medium">
          <Settings2 className="w-3.5 h-3.5 text-primary" /> 
          {stats ? `Queue ${stats.queueStatus} (Opened ${stats.openedAt})` : "Loading..."}
        </Badge>
      </div>

      <QueueInsightCards stats={stats} loading={loading} />

      {/* Main Focus Area */}
      <div className="space-y-4">
        {currentToken ? (
          <CurrentTokenPanel token={currentToken} onSkip={handleSkip} onNoShow={handleNoShow} />
        ) : (
          <NextPatientControls nextPatient={nextPatient} onCallNext={handleCallNext} />
        )}
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* Left: Table Area */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          <QueueFilters filters={filters} setFilters={setFilters} />
          <QueueTable queue={sortedQueue} onCall={handleCallNext} />
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex-1 mr-6">
               <QueueProgressIndicator completed={completedCount} total={stats?.total ?? queue.length} />
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>

        {/* Right: Side Panels */}
        <div className="xl:col-span-1 flex flex-col gap-6 h-[700px]">
          <DoctorPerformancePanel performance={performance} />
          {/* <QueueTimeline events={timeline} /> */}
        </div>

      </div>

    </main>
  );
}