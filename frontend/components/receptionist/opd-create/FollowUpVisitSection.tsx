"use client";

import { useState, useMemo } from "react";
import { RefreshCw, Calendar, FileText } from "lucide-react";
import {
  Patient,
  Doctor,
  mockPatients,
  mockDoctors,
  mockPastOpds,
  PastOpd,
} from "@/types/opd";
import { SearchableSelect } from "@/components/ui/searchable-select"; // Adjust path
import {
  usePatientOpdHistory,
  useSearchPatients,
} from "@/hooks/patients/usePatietns";

interface Props {
  onSelect: (patient: Patient, doctor: Doctor, oldOpd: PastOpd) => void;
}

export default function FollowUpVisitSection({ onSelect }: Props) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [patientSearch, setPatientSearch] = useState("");

  const { data: patientData } = useSearchPatients(patientSearch);
  const patients = patientData || [];

  const { data: opdHistoryData } = usePatientOpdHistory(
    patient ? Number(patient.id) : undefined,
  );

  const pastOpds = opdHistoryData?.data || [];

  const patientOptions = useMemo(() => {
    return patients.map((p: any) => ({
      label: `${p.name} - ${p.phone} (${p.id})`,
      value: p.id,
    }));
  }, [patients]);

  // const patientOptions = useMemo(() => {
  //   return mockPatients.map((p) => ({
  //     label: `${p.name} - ${p.phone} (${p.id})`,
  //     value: p.id,
  //   }));
  // }, []);

  const handlePatientSelect = (id: string) => {
    setSelectedPatientId(id);
    const p = patients.find((pat) => pat.id === id) || null;
    setPatient(p);
  };

  const handleSelectOpd = (opd: PastOpd) => {
    if (!patient) return;

    const mappedDoctor: Doctor = {
      id: opd.doctorId,
      name: opd.doctorName,
    };

    const mappedOpd: PastOpd = {
      opdId: opd.opdId,
      opdNo: opd.opdNo,
      date: opd.date,
      doctorId: opd.doctorId,
      doctorName: opd.doctorName,
      diagnosis: opd.diagnosis,
    };

    onSelect(patient, mappedDoctor, mappedOpd);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          1. Search Patient
        </label>
        <SearchableSelect
          options={patientOptions}
          value={selectedPatientId}
          onChange={handlePatientSelect}
          onSearch={setPatientSearch}
          placeholder="Search by Name, Phone, or ID..."
          emptyMessage="Patient not found."
        />
      </div>

      {patient && (
        <div className="space-y-3 animate-in fade-in duration-300">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" /> 2. Select Previous OPD
          </label>

          <div className="grid grid-cols-1 gap-3 max-h-[220px] overflow-y-auto pr-1">
            {pastOpds.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-border rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  No previous OPD visits found for this patient.
                </p>
              </div>
            ) : (
              pastOpds.map((opd) => (
                <div
                  key={opd.opdNo}
                  onClick={() => handleSelectOpd(opd)}
                  className="p-3 border border-border rounded-lg bg-card hover:bg-primary/5 hover:border-primary/40 cursor-pointer flex justify-between items-center group transition-all"
                >
                  <div>
                    <p className="font-semibold text-foreground flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      {opd.opdNo}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" /> {opd.date} •{" "}
                      {opd.doctorName}
                    </p>
                  </div>

                  <span className="text-xs font-medium bg-muted px-2 py-1 rounded text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {opd.diagnosis}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
