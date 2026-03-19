"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { appointmentService } from "@/services/appointment.service";
import type { TimeSlot } from "@/types/booking";

interface Props {
  doctorId: number;
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectDateTime: (date: string, time: string) => void;
}

export default function DoctorAvailabilityCalendar({
  doctorId,
  selectedDate,
  selectedTime,
  onSelectDateTime,
}: Props) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  // Generate 7 days from today + weekOffset
  const today = new Date();
  const baseDate = new Date(today);
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    return {
      dayStr: d.toLocaleDateString("en-US", { weekday: "short" }),
      dateStr: d.toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
      fullDate: d.toISOString().split("T")[0],
    };
  });

  // Default to first day if none selected
  const activeDate = selectedDate || weekDays[0].fullDate;

  // ─── Fetch availability from API ───
  useEffect(() => {
    if (!doctorId || !activeDate) return;

    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const res = await appointmentService.getDoctorAvailability(
          doctorId,
          activeDate
        );
        setSlots(res.slots || []);
        setIsAvailable(res.is_available);
      } catch {
        setSlots([]);
        setIsAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [doctorId, activeDate]);

  /**
   * Convert 24h "HH:mm" to 12h "HH:mm AM/PM" for display.
   */
  const formatTo12Hour = (time24: string): string => {
    const [h, m] = time24.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Select Date & Time</h2>

      {/* Week Navigation */}
      <div className="flex items-center justify-between bg-card border border-border rounded-xl p-2 shadow-sm">
        <button
          onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))}
          disabled={weekOffset === 0}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full justify-between px-2">
          {weekDays.map((day) => (
            <div
              key={day.fullDate}
              onClick={() => onSelectDateTime(day.fullDate, "")}
              className={`flex flex-col items-center justify-center p-3 rounded-lg min-w-[60px] cursor-pointer transition-all border-2 ${
                activeDate === day.fullDate
                  ? "bg-primary border-primary text-primary-foreground shadow-md"
                  : "bg-transparent border-transparent hover:bg-muted text-foreground"
              }`}
            >
              <span
                className={`text-xs font-medium ${
                  activeDate === day.fullDate
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                }`}
              >
                {day.dayStr}
              </span>
              <span className="text-sm font-bold mt-1">
                {day.dateStr.split(" ")[1]}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setWeekOffset((prev) => prev + 1)}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Time Slots Grid */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" /> Available Slots
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading availability...</span>
          </div>
        ) : !isAvailable ? (
          <div className="p-6 text-center text-muted-foreground border rounded-lg border-dashed">
            Doctor is not available on this day.
          </div>
        ) : slots.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground border rounded-lg border-dashed">
            No time slots available for this date.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {slots.map((slot) => {
              const isSelected =
                activeDate === selectedDate && selectedTime === slot.time;

              return (
                <Card
                  key={slot.time}
                  onClick={() =>
                    !slot.is_full && onSelectDateTime(activeDate, slot.time)
                  }
                  className={`p-3 text-center transition-all border-2 ${
                    slot.is_full
                      ? "opacity-50 cursor-not-allowed bg-muted/30 border-border"
                      : isSelected
                      ? "border-primary bg-primary/10 text-primary shadow-sm cursor-pointer"
                      : "border-border hover:border-primary/40 hover:bg-muted/10 cursor-pointer"
                  }`}
                >
                  <p
                    className={`font-semibold text-sm ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {formatTo12Hour(slot.time)}
                  </p>
                  <p
                    className={`text-[10px] mt-1 font-medium ${
                      slot.is_full
                        ? "text-destructive"
                        : isSelected
                        ? "text-primary/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {slot.is_full ? "Full" : `${slot.capacity} slots left`}
                  </p>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}