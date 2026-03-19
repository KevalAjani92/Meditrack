"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import AppointmentStats from "@/components/doctor/appointments/AppointmentStats";
import WeeklyCalendar from "@/components/doctor/appointments/WeeklyCalendar";
import SlotCapacityIndicator from "@/components/doctor/appointments/SlotCapacityIndicator";
import AppointmentFilters from "@/components/doctor/appointments/AppointmentFilters";
import DayAppointmentTable from "@/components/doctor/appointments/DayAppointmentTable";
import ScheduleInsightsPanel from "@/components/doctor/appointments/ScheduleInsightsPanel";
import AppointmentDetailModal from "@/components/doctor/appointments/AppointmentDetailModal";

import {
  Appointment,
  getStartOfWeek,
  addDays,
  generateWeekSummaries,
  generateAppointmentsForDate,
} from "@/types/doctor-schedule";
import { Pagination } from "@/components/ui/Pagination";
import { useAuth } from "@/context/auth-context";
import {
  useDoctorAppointments,
  useDoctorWeekSummary,
} from "@/hooks/doctors/useDoctors";

// Setting a static "today" context for the mock app
const TODAY_STR = new Date().toISOString().split("T")[0];
const ITEMS_PER_PAGE = 8; // Number of appointments to show per page

export default function DoctorSchedulePage() {
  const { user } = useAuth();
  const userId = Number(user?.id);
  // 1. Dynamic Date State
  const [selectedDate, setSelectedDate] = useState<string>(TODAY_STR);
  const [weekStart, setWeekStart] = useState<string>(getStartOfWeek(TODAY_STR));

  // 2. Filter, Pagination & Modal State
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    time: "All",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  // Reset pagination to page 1 whenever filters or selected date changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, filters]);

  const { data, isLoading } = useDoctorAppointments({
    date: selectedDate,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: filters.search,
    status: filters.status,
    time: filters.time,
  });

  const appointments = data?.data || [];
  const meta = data?.meta;
  const stats = data?.stats;
// console.log(weekStart)


  const { data: weekSummaries = [] } = useDoctorWeekSummary(weekStart);
  const currentWeekSummaries = weekSummaries;

  // 3. Dynamic Data Generation (Triggered when dates change)
  // const currentWeekSummaries = useMemo(
  //   () => generateWeekSummaries(weekStart),
  //   [weekStart],
  // );
  const currentSummary = currentWeekSummaries.find(
    (d) => d.date === selectedDate,
  );

  // // Generate appointments based on how many slots are booked for the selected date
  // const rawAppointments = useMemo(() => {
  //   const bookedCount = currentSummary?.bookedSlots || 0;
  //   return generateAppointmentsForDate(selectedDate, bookedCount);
  // }, [selectedDate, currentSummary]);

  // // 4. Filtering Logic applied to generated appointments
  // const filteredAppointments = useMemo(() => {
  //   return rawAppointments.filter((apt) => {
  //     const q = filters.search.toLowerCase();
  //     if (
  //       q &&
  //       !apt.patientName.toLowerCase().includes(q) &&
  //       !apt.appointmentNo.toLowerCase().includes(q) &&
  //       !apt.phone.includes(q)
  //     )
  //       return false;
  //     if (filters.status !== "All" && apt.status !== filters.status)
  //       return false;
  //     if (filters.time !== "All") {
  //       const isPM = apt.time.includes("PM");
  //       const hour = parseInt(apt.time.split(":")[0]);
  //       if (filters.time === "Morning" && isPM && hour !== 12) return false;
  //       if (
  //         filters.time === "Afternoon" &&
  //         (!isPM || (isPM && hour >= 5 && hour !== 12))
  //       )
  //         return false;
  //       if (
  //         filters.time === "Evening" &&
  //         (!isPM || (isPM && hour < 5 && hour !== 12))
  //       )
  //         return false;
  //     }
  //     return true;
  //   });
  // }, [rawAppointments, filters]);

  // //Pagination Logic
  // const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);
  // const paginatedAppointments = filteredAppointments.slice(
  //   (currentPage - 1) * ITEMS_PER_PAGE,
  //   currentPage * ITEMS_PER_PAGE,
  // );

  // 5. Navigation Handlers
  const handleNavigateWeek = (direction: "prev" | "next" | "today") => {
    if (direction === "today") {
      setWeekStart(getStartOfWeek(TODAY_STR));
      setSelectedDate(TODAY_STR);
    } else {
      const newWeekStart = addDays(weekStart, direction === "next" ? 7 : -7);
      setWeekStart(newWeekStart);
      setSelectedDate(newWeekStart); // Auto-select Monday of the new week
    }
  };

  const handleJumpToDate = (date: string) => {
    setWeekStart(getStartOfWeek(date));
    setSelectedDate(date);
  };

  return (
    <main className="min-h-full bg-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Appointment Schedule
        </h1>
        <p className="text-muted-foreground">
          Manage your daily consultations, navigate weeks, and monitor capacity.
        </p>
      </div>

      {/* Show stats specifically for the selected date to keep it contextually relevant */}
      <AppointmentStats data={stats} />

      {/* Calendar & Capacity Grid */}
      <div className="grid grid-cols-1">
        <div className="lg:col-span-2">
          <WeeklyCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            weekStart={weekStart}
            onNavigateWeek={handleNavigateWeek}
            onJumpToDate={handleJumpToDate}
            weekSummaries={currentWeekSummaries}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SlotCapacityIndicator summary={currentSummary} />
        </div>
        <div className="">
          <ScheduleInsightsPanel data={appointments} date={selectedDate} />
        </div>
      </div>

      {/* Filters */}
      <AppointmentFilters filters={filters} setFilters={setFilters} />

      {/* Main Table & Insights */}
      <div className="grid grid-cols-1">
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDate + currentPage} // Re-animate on date OR page change
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Pass the sliced paginated array to the table */}
              <DayAppointmentTable
                data={appointments}
                onView={setSelectedAppt}
              />
            </motion.div>
          </AnimatePresence>

          {/* Render Pagination only if there is data */}
          {meta?.totalPages > 1 && (
            <div className="pt-2 border-t border-border mt-2">
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AppointmentDetailModal
        isOpen={selectedAppt !== null}
        onClose={() => setSelectedAppt(null)}
        appointment={selectedAppt}
      />
    </main>
  );
}
