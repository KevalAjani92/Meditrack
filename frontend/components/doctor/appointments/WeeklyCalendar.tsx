"use client";

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CalendarSearch } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DaySummary, formatDateRange, addDays } from "@/types/doctor-schedule";

interface Props {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  weekStart: string;
  onNavigateWeek: (direction: "prev" | "next" | "today") => void;
  onJumpToDate: (date: string) => void;
  weekSummaries: DaySummary[];
}

export default function WeeklyCalendar({ selectedDate, onSelectDate, weekStart, onNavigateWeek, onJumpToDate, weekSummaries }: Props) {
  
  // Calculate Heatmap Color
  const getHeatmapColor = (booked: number, total: number) => {
    if (total === 0) return "bg-muted/10 text-muted-foreground border-border";
    const percentage = booked / total;
    if (percentage === 0) return "bg-background text-foreground border-border hover:border-primary/50";
    if (percentage <= 0.3) return "bg-primary/10 text-foreground border-primary/20 hover:border-primary/50";
    if (percentage <= 0.7) return "bg-primary/30 text-foreground border-primary/40 hover:border-primary/60";
    if (percentage <= 1.0) return "bg-primary/70 text-primary-foreground border-primary/80 hover:border-primary";
    return "bg-destructive text-destructive-foreground border-destructive shadow-md"; // Overbooked
  };

  const weekEnd = addDays(weekStart, 6);

  return (
    <Card className="p-5 border-border shadow-sm flex flex-col h-full animate-in fade-in">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Weekly Schedule</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Today Button */}
          <Button variant="outline" size="sm" onClick={() => onNavigateWeek("today")} className="h-8 text-xs font-medium mr-2">
            Today
          </Button>

          {/* Prev/Next Week Controls */}
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => onNavigateWeek("prev")}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <span className="text-sm font-medium text-foreground px-2 min-w-[140px] text-center">
            {formatDateRange(weekStart, weekEnd)}
          </span>
          
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => onNavigateWeek("next")}>
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Jump to Date Picker (Native HTML Date input styled as a button) */}
          <div className="relative ml-2 group">
             <Button variant="secondary" size="sm" className="h-8 w-8 p-0 text-primary">
               <CalendarSearch className="w-4 h-4" />
             </Button>
             <input 
               type="date" 
               onChange={(e) => {
                 if (e.target.value) onJumpToDate(e.target.value);
               }}
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               title="Jump to date"
             />
          </div>
        </div>
      </div>

      {/* Days Grid */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar p-3 flex-1 items-stretch">
        {weekSummaries.map((day) => {
          const dateObj = new Date(day.date);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = dateObj.getDate();
          const isSelected = selectedDate === day.date;
          
          return (
            <div 
              key={day.date}
              onClick={() => onSelectDate(day.date)}
              className={`min-w-[100px] flex-1 cursor-pointer transition-all rounded-xl border-2 p-3 text-center flex flex-col justify-center gap-1 relative overflow-hidden
                ${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.02]" : "hover:-translate-y-1"}
                ${getHeatmapColor(day.bookedSlots, day.totalSlots)}
              `}
            >
              {isSelected && <div className="absolute top-0 left-0 w-full h-1 bg-primary" />}
              <span className="text-xs uppercase font-bold opacity-80">{dayName}</span>
              <span className="text-2xl font-black">{dayNum}</span>
              <div className="mt-2 space-y-0.5">
                <p className="text-[10px] font-medium opacity-90">{day.bookedSlots} Booked</p>
                {day.totalSlots > 0 && <p className="text-[10px] font-medium opacity-80">{Math.max(0, day.availableSlots)} Left</p>}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}