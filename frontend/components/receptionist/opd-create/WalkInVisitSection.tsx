"use client";

import { useState, useMemo } from "react";
import { UserPlus, CheckCircle2 } from "lucide-react";
import { Patient, Doctor, mockPatients, mockDoctors } from "@/types/opd";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select"; // Adjust path
import { useSearchPatients } from "@/hooks/patients/usePatietns";
import { useOpdDoctors } from "@/hooks/doctors/useDoctors";

interface Props {
  hospitalId: number;
  onSelect: (patient: Patient | null, doctor: Doctor | null) => void;
}

export default function WalkInVisitSection({ onSelect, hospitalId }: Props) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");

  const [patient, setPatient] = useState<Patient | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patientSearch, setPatientSearch] = useState("");

  const { data: patientData } = useSearchPatients(patientSearch);
  const patients = patientData || [];

  const { data: doctorData } = useOpdDoctors(hospitalId, patient?.id);
  const doctors = doctorData || [];

  // Mapped Options
  const patientOptions = useMemo(() => {
    return patients.map((p: any) => ({
      label: `${p.name} - ${p.phone} (${p.patientNo})`,
      value: p.id,
    }));
  }, [patients]);
  const doctorOptions = useMemo(() => {
    return doctors.map((d: any) => ({
      label: `${d.name} (${d.department}) - ${d.status}`,
      value: d.id,
    }));
  }, [doctors]);

  // const patientOptions = useMemo(() => {
  //   return mockPatients.map((p) => ({
  //     label: `${p.name} - ${p.phone} (${p.id})`,
  //     value: p.id,
  //   }));
  // }, []);

  // const doctorOptions = useMemo(() => {
  //   return mockDoctors.map((d) => ({
  //     label: `${d.name} (${d.department}) - ${d.status}`,
  //     value: d.id,
  //   }));
  // }, []);

  const handlePatientSelect = (id: string) => {
    setSelectedPatientId(id);
    const p = patients.find((pat) => pat.id === id) || null;
    setPatient(p);
    onSelect(p, doctor); // Send current combo to parent
  };

  const handleDoctorSelect = (id: string) => {
    setSelectedDoctorId(id);
    const d = doctors.find((doc) => doc.id === id) || null;
    setDoctor(d);
    onSelect(patient, d); // Send current combo to parent
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Patient Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            1. Search Patient
          </label>
          <Button variant="link" size="sm" className="h-auto p-0 text-primary">
            <UserPlus className="w-3.5 h-3.5 mr-1" /> Register New
          </Button>
        </div>

        <SearchableSelect
          options={patientOptions}
          value={selectedPatientId}
          onChange={handlePatientSelect}
          onSearch={setPatientSearch}
          placeholder="Search by Name, Phone, or ID..."
          emptyMessage="Patient not found. Please register."
        />

        {patient && (
          <div className="p-3 bg-success/5 border border-success/20 rounded-lg flex justify-between items-center animate-in fade-in">
            <div>
              <p className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" /> {patient.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                +91 {patient.phone} • {patient.patientNo}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Doctor Selection */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          2. Assign Doctor
        </label>

        <SearchableSelect
          disabled={!patient}
          options={doctorOptions}
          value={selectedDoctorId}
          onChange={handleDoctorSelect}
          placeholder="Search Doctor or Department..."
          emptyMessage="No doctors found."
        />
      </div>
    </div>
  );
}
