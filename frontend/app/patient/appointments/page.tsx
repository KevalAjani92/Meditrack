"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

import AppointmentStats from "@/components/patient/appointments/AppointmentStats";
import AppointmentFilters from "@/components/patient/appointments/AppointmentFilters";
import AppointmentsTable from "@/components/patient/appointments/AppointmentsTable";
import AppointmentsCardGrid from "@/components/patient/appointments/AppointmentsCardGrid";
import AppointmentDetailModal from "@/components/patient/appointments/AppointmentDetailModal";
import CancelRescheduleModal from "@/components/patient/appointments/CancelRescheduleModal";

import { appointmentService } from "@/services/appointment.service";
import type { Appointment } from "@/types/appointment";
import { CalendarX2 } from "lucide-react";

export default function MyAppointmentsPage() {
  const router = useRouter();

  // Data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Past">("Upcoming");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  // Modals
  const [selectedAppt, setSelectedAppt] = useState<Appointment | undefined>(undefined);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [actionModal, setActionModal] = useState<{ isOpen: boolean; mode: "cancel" | "reschedule" | null }>({ isOpen: false, mode: null });

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await appointmentService.getMyAppointments();
      // Map API response to Appointment interface
      const mapped: Appointment[] = (res || []).map((apt: any) => {
        const aptDate = new Date(apt.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        aptDate.setHours(0, 0, 0, 0);
        const isToday = aptDate.getTime() === today.getTime();

        // Compute timeline text
        const diffDays = Math.ceil((aptDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        let timelineText: string | undefined;
        if (isToday) timelineText = `Today at ${apt.time}`;
        else if (diffDays === 1) timelineText = `Tomorrow at ${apt.time}`;
        else if (diffDays > 1 && diffDays <= 7) timelineText = `In ${diffDays} days`;

        return {
          appointment_id: apt.appointment_id,
          appointmentNo: apt.appointment_no,
          doctorName: apt.doctor_name || "—",
          specialization: apt.specialization || "",
          hospitalName: apt.hospital_name || "—",
          department: apt.department || "",
          date: new Date(apt.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }),
          time: apt.time || "",
          status: apt.status,
          symptoms: apt.symptoms || "",
          bookingDate: apt.booking_date ? new Date(apt.booking_date).toLocaleDateString() : "",
          canCancel: apt.can_cancel,
          isToday,
          timelineText,
        };
      });
      setAppointments(mapped);
    } catch (err: any) {
      setError(err?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Filtering
  const filteredData = useMemo(() => {
    return appointments.filter((apt) => {
      const isUpcomingStatus = apt.status === "Scheduled" || apt.status === "Rescheduled" || apt.status === "Checked-In";
      if (activeTab === "Upcoming" && !isUpcomingStatus) return false;
      if (activeTab === "Past" && isUpcomingStatus) return false;
      if (statusFilter !== "All" && apt.status !== statusFilter) return false;
      const q = search.toLowerCase();
      if (q && !apt.doctorName.toLowerCase().includes(q) && !apt.hospitalName.toLowerCase().includes(q) && !apt.appointmentNo.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [appointments, activeTab, search, statusFilter, dateFilter]);

  // Handlers
  const handleView = (apt: Appointment) => { setSelectedAppt(apt); setIsDetailOpen(true); };
  const handleCancel = (apt: Appointment) => { setSelectedAppt(apt); setIsDetailOpen(false); setActionModal({ isOpen: true, mode: "cancel" }); };
  const handleReschedule = (apt: Appointment) => { setSelectedAppt(apt); setIsDetailOpen(false); setActionModal({ isOpen: true, mode: "reschedule" }); };
  const handleRebook = () => { router.push(`/patient/appointment-booking`); };

  const handleActionComplete = () => {
    setActionModal({ isOpen: false, mode: null });
    fetchAppointments(); // Refresh data
  };

  if (loading) {
    return (
      <main className="min-h-full bg-background p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading appointments...</span>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-background p-4 sm:p-6 lg:p-8 space-y-6">

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Appointments</h1>
        <p className="text-muted-foreground">Manage your schedule, view past visits, and book new consultations.</p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">{error}</div>
      )}

      <AppointmentStats data={appointments} />

      <AppointmentFilters
        viewMode={viewMode} setViewMode={setViewMode}
        search={search} setSearch={setSearch}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        dateFilter={dateFilter} setDateFilter={setDateFilter}
      />

      <Tabs.Root value={activeTab} onValueChange={(v) => { setActiveTab(v as any); }} className="space-y-4">
        <Tabs.List className="flex items-center gap-6 border-b border-border">
          <Tabs.Trigger value="Upcoming" className="pb-3 text-sm font-medium text-muted-foreground border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-all">
            Upcoming Appointments
          </Tabs.Trigger>
          <Tabs.Trigger value="Past" className="pb-3 text-sm font-medium text-muted-foreground border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-all">
            Past History
          </Tabs.Trigger>
        </Tabs.List>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {filteredData.length > 0 ? (
              <div className="space-y-4 pt-2">
                {viewMode === "table" ? (
                  <AppointmentsTable data={filteredData} tab={activeTab} onView={handleView} onCancel={handleCancel} onReschedule={handleReschedule} onRebook={handleRebook} />
                ) : (
                  <AppointmentsCardGrid data={filteredData} tab={activeTab} onView={handleView} onCancel={handleCancel} onReschedule={handleReschedule} onRebook={handleRebook} />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-border rounded-xl bg-card mt-2">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <CalendarX2 className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No {activeTab} Appointments</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">You don&apos;t have any {activeTab.toLowerCase()} appointments matching your criteria.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Tabs.Root>

      <AppointmentDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        appointment={selectedAppt}
        onCancel={() => handleCancel(selectedAppt!)}
        onReschedule={() => handleReschedule(selectedAppt!)}
      />

      <CancelRescheduleModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, mode: null })}
        appointment={selectedAppt}
        mode={actionModal.mode}
        onActionComplete={handleActionComplete}
      />

    </main>
  );
}