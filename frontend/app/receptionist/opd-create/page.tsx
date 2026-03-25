"use client";

import { useState } from "react";
import VisitTypeSelector from "@/components/receptionist/opd-create/VisitTypeSelector";
import ScheduledVisitSection from "@/components/receptionist/opd-create/ScheduledVisitSection";
import WalkInVisitSection from "@/components/receptionist/opd-create/WalkInVisitSection";
import EmergencyVisitSection from "@/components/receptionist/opd-create/EmergencyVisitSection";
import FollowUpVisitSection from "@/components/receptionist/opd-create/FollowUpVisitSection";
import PatientQuickInfoPanel from "@/components/receptionist/opd-create/PatientQuickInfoPanel";
import DoctorQueueIndicator from "@/components/receptionist/opd-create/DoctorQueueIndicator";
import OpdFormSection, {
  OpdFormData,
} from "@/components/receptionist/opd-create/OpdFormSection";
import OpdSuccessModal from "@/components/receptionist/opd-create/OpdSuccessModal";
import { VisitType, Patient, Doctor, Appointment, PastOpd } from "@/types/opd";
import { useCreateOpd } from "@/hooks/opd/useCreateOpd";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";

export default function CreateOpdVisitPage() {
  const { user } = useAuth();
  const hospitalId = Number(user?.hospitalid);
  const [visitType, setVisitType] = useState<VisitType>("Scheduled");

  // Selection State
  const [patient, setPatient] = useState<Patient | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [oldOpd, setOldOpd] = useState<PastOpd | null>(null);

  const [modalData, setModalData] = useState<any>(null);

  // Clear selections when switching tabs to avoid mismatched states
  const handleTypeChange = (type: VisitType) => {
    setVisitType(type);
    setPatient(null);
    setDoctor(null);
    setAppointment(null);
    setOldOpd(null);
  };

  const handleScheduledSelect = (p: Patient, d: Doctor, a: Appointment) => {
    setPatient(p);
    setDoctor(d);
    setAppointment(a);
  };

  const handleWalkInSelect = (p: Patient | null, d: Doctor | null) => {
    setPatient(p);
    setDoctor(d);
  };

  const handleFollowUpSelect = (p: Patient, d: Doctor, o: PastOpd) => {
    setPatient(p);
    setDoctor(d);
    setOldOpd(o);
  };

  const createOpdMutation = useCreateOpd();
  const { addToast } = useToast();
  console.log(appointment)

  // const handleSubmit = (formData: OpdFormData) => {
  //   const finalPayload = {
  //     visitType,
  //     patient,
  //     doctor,
  //     appointment,
  //     oldOpd,
  //     ...formData
  //   };
  //   console.log("Submitting OPD:", finalPayload);
  //   setModalData(finalPayload);
  // };
  const handleSubmit = (formData: OpdFormData) => {
    if (!patient || !doctor) return;

    const payload = {
      hospital_id: hospitalId,
      patient_id: patient.id,
      doctor_id: doctor.id,

      appointment_id: appointment?.id ?? null,
      old_opd_id: oldOpd?.opdNo ?? null,

      visitType,

      chief_complaint: formData.chiefComplaint,
      clinical_notes: formData.clinicalNotes,
      skip_queue: formData.skipQueue ?? false,
    };
    createOpdMutation.mutate(payload, {
      onSuccess: (res) => {
        setModalData(res);
      },
      onError:(err) =>{
        addToast(err.message,"error");
      }
    });
  };

  const resetPage = () => {
    setModalData(null);
    handleTypeChange("Walk-In"); // Default reset state
  };

  // Compute if form can be submitted (must have patient and doctor)
  const canSubmit = patient !== null && doctor !== null;

  return (
    <main className="min-h-full bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create OPD Visit
          </h1>
          <p className="text-muted-foreground">
            Register patients into the doctor's queue.
          </p>
        </div>

        <VisitTypeSelector selected={visitType} onChange={handleTypeChange} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Dynamic Flow & Form */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm min-h-[250px]">
              {visitType === "Scheduled" && (
                <ScheduledVisitSection
                  hospitalId={hospitalId}
                  onSelect={handleScheduledSelect}
                />
              )}
              {visitType === "Walk-In" && (
                <WalkInVisitSection
                  hospitalId={hospitalId}
                  onSelect={handleWalkInSelect}
                />
              )}
              {visitType === "Emergency" && (
                <EmergencyVisitSection
                  hospitalId={hospitalId}
                  onSelect={handleWalkInSelect}
                />
              )}
              {visitType === "Follow-Up" && (
                <FollowUpVisitSection onSelect={handleFollowUpSelect} />
              )}
            </div>

            <OpdFormSection
              isEmergency={visitType === "Emergency"}
              onSubmit={handleSubmit}
              canSubmit={canSubmit}
              isLoading={createOpdMutation.isPending}
            />
          </div>

          {/* RIGHT: Persistent Info Panels */}
          <div className="flex flex-col gap-4">
            <PatientQuickInfoPanel patient={patient} />
            <DoctorQueueIndicator doctor={doctor} />
          </div>
        </div>
      </div>

      <OpdSuccessModal
        isOpen={modalData !== null}
        data={modalData}
        onReset={resetPage}
      />
    </main>
  );
}
