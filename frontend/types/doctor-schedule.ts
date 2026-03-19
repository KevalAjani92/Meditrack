export type AppointmentStatus = "Scheduled" | "Waiting" | "Checked-In" | "Completed" | "Cancelled" | "No-Show" | "Rescheduled";

export interface Appointment {
  id: string;
  appointmentNo: string;
  patientName: string;
  patientId: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  chiefComplaint: string;
  status: AppointmentStatus;
  phone: string;
  city: string;
  medicalInfo: {
    bloodGroup: string;
    allergies: string;
    chronicConditions: string;
    currentMedications: string;
  };
  remarks?: string;
}

export interface DaySummary {
  date: string;
  totalSlots: number;
  bookedSlots: number;
  availableSlots: number;
}

// --- DATE UTILITIES ---

// Get Monday of the current week
export const getStartOfWeek = (dateString: string) => {
  const d = new Date(dateString);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
  const start = new Date(d.setDate(diff));
  return start.toISOString().split('T')[0];
};

export const addDays = (dateString: string, days: number) => {
  const d = new Date(dateString);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const formatDateRange = (startStr: string, endStr: string) => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit' };
  return `${start.toLocaleDateString('en-US', opts)} - ${end.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`;
};

// --- DYNAMIC MOCK DATA GENERATORS ---

// Generates week summaries dynamically so any selected week has data
export const generateWeekSummaries = (weekStart: string): DaySummary[] => {
  return Array.from({ length: 7 }).map((_, i) => {
    const currentDate = addDays(weekStart, i);
    const dateObj = new Date(currentDate);
    const isWeekend = dateObj.getDay() === 0; // Sunday off

    if (isWeekend) return { date: currentDate, totalSlots: 0, bookedSlots: 0, availableSlots: 0 };

    // Hardcode our specific test day to show overbooking, randomize the rest
    if (currentDate === "2026-03-05") {
      return { date: currentDate, totalSlots: 20, bookedSlots: 22, availableSlots: -2 };
    }

    const totalSlots = 20;
    // Generate a pseudo-random number based on the date string so it stays consistent on re-renders
    const pseudoRandom = (currentDate.charCodeAt(currentDate.length - 1) % 25); 
    const bookedSlots = pseudoRandom;

    return { date: currentDate, totalSlots, bookedSlots, availableSlots: totalSlots - bookedSlots };
  });
};

// Generates mock appointments dynamically based on the day's booked slots
export const generateAppointmentsForDate = (date: string, count: number): Appointment[] => {
  const statuses: AppointmentStatus[] = ["Scheduled", "Waiting" , "Checked-In", "Completed", "Cancelled", "No-Show"];
  const names = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Gupta", "Vikram Singh", "Emily Davis", "John Doe"];
  const complaints = ["Severe headache", "Routine Checkup", "Follow-up for diabetes", "Stomach ache", "Joint pain", "Viral Fever"];

  return Array.from({ length: count }).map((_, i) => {
    // Generate realistic times
    const hour = 9 + Math.floor(i / 2); // Starts at 9 AM, 2 per hour
    const isPM = hour >= 12;
    const displayHour = hour > 12 ? hour - 12 : hour;
    const minute = i % 2 === 0 ? "00" : "30";
    const timeStr = `${displayHour.toString().padStart(2, '0')}:${minute} ${isPM ? 'PM' : 'AM'}`;

    return {
      id: `apt-${date}-${i}`,
      appointmentNo: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: names[i % names.length],
      patientId: `PT-${1000 + i}`,
      age: 25 + (i * 5 % 40),
      gender: i % 2 === 0 ? "Male" : "Female",
      date: date,
      time: timeStr,
      chiefComplaint: complaints[i % complaints.length],
      status: statuses[i % statuses.length],
      phone: "+91 9000000000",
      city: "Metropolis",
      medicalInfo: { bloodGroup: "O+", allergies: "None", chronicConditions: "None", currentMedications: "None" }
    };
  });
};

export const getStatusBadgeStyles = (status: AppointmentStatus) => {
  switch (status) {
    case "Scheduled":
      return "bg-primary/10 text-primary border-primary/20";

    case "Waiting":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";

    case "Checked-In":
      return "bg-accent text-accent-foreground border-accent";

    case "Completed":
      return "bg-green-100 text-green-800 border-green-300";

    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-300";

    case "No-Show":
      return "bg-muted text-muted-foreground border-border";

    case "Rescheduled":
      return "bg-orange-100 text-orange-800 border-orange-300";

    default:
      return "bg-muted text-muted-foreground border-border";
  }
};