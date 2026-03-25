"use client";

import { useState, useMemo } from "react";
import { Calendar, Clock, User, CheckCircle2 } from "lucide-react";
import {
  Patient,
  Doctor,
  Appointment,
  mockAppointments,
  mockPatients,
  mockDoctors,
} from "@/types/opd";
import { SearchableSelect } from "@/components/ui/searchable-select"; // Adjust path to where you saved the component
import { useTodayAppointments } from "@/hooks/appointments/useAppointments";
import { appointmentService } from "@/services/appointment.service";
import { patientService } from "@/services/patient.service";

interface Props {
  hospitalId: number;
  onSelect: (
    patient: Patient,
    doctor: Doctor,
    appointment: Appointment,
  ) => void;
}

export default function ScheduledVisitSection({ onSelect, hospitalId }: Props) {
  const [selectedAptNo, setSelectedAptNo] = useState<string>("");
  const [result, setResult] = useState<any>(null);

  const { data } = useTodayAppointments(hospitalId);
  const appointments = data || [];

  // Map appointments to searchable options
  // const appointmentOptions = useMemo(() => {
  //   return mockAppointments.map((apt) => {
  //     const patient = mockPatients.find((p) => p.id === apt.patientId);
  //     return {
  //       label: `${apt.appointmentNo} - ${patient?.name || 'Unknown'} (${apt.time})`,
  //       value: apt.appointmentNo,
  //     };
  //   });
  // }, []);
  const appointmentOptions = useMemo(() => {
    return appointments.map((apt: any) => ({
      label: `${apt.appointmentNo} (${new Date(apt.time).toISOString().split("T")[1]})`,
      value: apt.id,
    }));
  }, [appointments]);

  const handleSelect = async (appointmentId: string) => {
    setSelectedAptNo(appointmentId);

    if (!appointmentId) {
      setResult(null);
      return;
    }

    const appointment = await appointmentService.getAppointmentDetails(
      Number(appointmentId),
    );
    const patient = await patientService.getPatientSummary(
      appointment.patient.patient_id,
    );
    console.log(appointment);

    const mappedAppointment = {
      id: appointment.id,
      appointmentNo: appointment.appointmentNo,
      patientId: appointment.patient.patient_id,
      patientName: appointment.patient.full_name,
      doctorId: appointment.doctor.id,
      doctorName: appointment.doctor.name,
      date: appointment.date,
      time: appointment.time,
    };

    const mappedPatient = {
      id: patient.patient_id,
      name: patient.name,
      phone: patient.phone,
    };

    const mappedDoctor = {
      id: appointment.doctor.id,
      name: appointment.doctor.name,
    };

    setResult(mappedAppointment);

    onSelect(mappedPatient, mappedDoctor, mappedAppointment);
  };

  // const handleSelect = (aptNo: string) => {
  //   setSelectedAptNo(aptNo);
  //   if (!aptNo) {
  //     setResult(null);
  //     return;
  //   }

  //   const apt = mockAppointments.find((a) => a.appointmentNo === aptNo);
  //   if (apt) {
  //     setResult(apt);
  //     const pat = mockPatients.find((p) => p.id === apt.patientId);
  //     const doc = mockDoctors.find((d) => d.id === apt.doctorId);
  //     if (pat && doc) onSelect(pat, doc, apt);
  //   }
  // };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Search Appointment
        </label>
        <SearchableSelect
          options={appointmentOptions}
          value={selectedAptNo}
          onChange={handleSelect}
          placeholder="Search by APT No or Patient Name..."
          emptyMessage="No scheduled appointments found."
        />
      </div>

      {result && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
            <CheckCircle2 className="w-16 h-16 text-primary" />
          </div>
          <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" /> Appointment Found
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm relative z-10">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                Patient Details
              </p>
              <p className="font-medium text-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> {result.patientName}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                Consulting Doctor
              </p>
              <p className="font-medium text-foreground">{result.doctorName}</p>
            </div>
            <div className="col-span-2 flex items-center gap-4 p-2 bg-background/50 rounded border border-border">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />{" "}
                {new Date(result.date).toLocaleDateString("en-IN")}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" /> {result.time}
              </span>
              <span className="ml-auto px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded">
                Scheduled
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
