"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

import BookingStepper from "@/components/patient/appointment-booking/BookingStepper";
import HospitalSelectionStep from "@/components/patient/appointment-booking/HospitalSelectionStep";
import DepartmentSelectionStep from "@/components/patient/appointment-booking/DepartmentSelectionStep";
import DoctorSelectionStep from "@/components/patient/appointment-booking/DoctorSelectionStep";
import DoctorAvailabilityCalendar from "@/components/patient/appointment-booking/DoctorAvailabilityCalendar";
import SymptomsStep from "@/components/patient/appointment-booking/SymptomsStep";
import BookingSummaryCard from "@/components/patient/appointment-booking/BookingSummaryCard";
import BookingConfirmationModal from "@/components/patient/appointment-booking/BookingConfirmationModal";

import { appointmentService } from "@/services/appointment.service";
import type {
  Hospital,
  Department,
  Doctor,
  BookingResult,
} from "@/types/booking";
// import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

export default function AppointmentBookingClient() {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const router = useRouter();
  // const { user } = useAuth();
  // console.log(user);

  // ─── Selections ───
  const [hospitalId, setHospitalId] = useState<number | null>(null);
  const [deptId, setDeptId] = useState<number | null>(null);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [symptomsValid, setSymptomsValid] = useState(true);

  // ─── API Data ───
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  // ─── Loading & Error ───
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Modal ───
  const [showModal, setShowModal] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(
    null,
  );

  // ─── Fetch Hospitals on mount ───
  useEffect(() => {
    const fetchHospitals = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await appointmentService.getHospitals();
        setHospitals(res);
      } catch (err: any) {
        setError(err?.message || "Failed to load hospitals");
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  // ─── Fetch Departments when hospital changes ───
  useEffect(() => {
    if (!hospitalId) {
      setDepartments([]);
      return;
    }
    const fetchDepts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res =
          await appointmentService.getDepartmentsByHospital(hospitalId);
        setDepartments(res);
      } catch (err: any) {
        setError(err?.message || "Failed to load departments");
      } finally {
        setLoading(false);
      }
    };
    fetchDepts();
  }, [hospitalId]);

  // ─── Fetch Doctors when department changes ───
  useEffect(() => {
    if (!deptId || !hospitalId) {
      setDoctors([]);
      return;
    }
    const fetchDocs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await appointmentService.getDoctorsByDepartment(
          deptId,
          hospitalId,
        );
        setDoctors(res);
      } catch (err: any) {
        setError(err?.message || "Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [deptId, hospitalId]);

  // ─── Selected objects for summary ───
  const getSelectedObjects = useCallback(() => {
    return {
      hospital: hospitals.find((h) => h.hospital_id === hospitalId),
      department: departments.find((d) => d.department_id === deptId),
      doctor: doctors.find((d) => d.doctor_id === doctorId),
    };
  }, [hospitals, departments, doctors, hospitalId, deptId, doctorId]);

  // ─── Step Validation ───
  const isStepValid = () => {
    if (step === 1) return hospitalId !== null;
    if (step === 2) return deptId !== null;
    if (step === 3) return doctorId !== null;
    if (step === 4) return date !== null && time !== null && time !== "";
    if (step === 5) return symptomsValid;
    return true;
  };

  const handleNext = () => {
    if (step < totalSteps && isStepValid()) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // ─── Reset downstream selections when parent changes ───
  const handleHospitalSelect = (id: number) => {
    setHospitalId(id);
    setDeptId(null);
    setDoctorId(null);
    setDate(null);
    setTime(null);
  };

  const handleDeptSelect = (id: number) => {
    setDeptId(id);
    setDoctorId(null);
    setDate(null);
    setTime(null);
  };

  const handleDoctorSelect = (id: number) => {
    setDoctorId(id);
    setDate(null);
    setTime(null);
  };

  // ─── Book Appointment ───
  const handleBook = async () => {
    if (!hospitalId || !doctorId || !date || !time) return;

    setBookingLoading(true);
    setError(null);
    try {
      const res = await appointmentService.bookAppointment({
        hospital_id: hospitalId,
        doctor_id: doctorId,
        appointment_date: date,
        appointment_time: time,
        remarks: symptoms || undefined,
      });
      setBookingResult(res.data);
      setShowModal(true);
    } catch (err: any) {
      setError(err?.message || "Failed to book appointment");
    } finally {
      setBookingLoading(false);
    }
  };
  const handleCloseModal = () => {
  setShowModal(false);
  router.refresh(); // refresh server components
};

  // ─── Content Renderer ───
  const renderStepContent = () => {
    if (loading && step !== 4) {
      return (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading...</span>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <HospitalSelectionStep
            hospitals={hospitals}
            selectedId={hospitalId}
            onSelect={handleHospitalSelect}
          />
        );
      case 2:
        return (
          <DepartmentSelectionStep
            departments={departments}
            selectedId={deptId}
            onSelect={handleDeptSelect}
          />
        );
      case 3:
        return (
          <DoctorSelectionStep
            doctors={doctors}
            selectedId={doctorId}
            onSelect={handleDoctorSelect}
          />
        );
      case 4:
        return (
          <DoctorAvailabilityCalendar
            doctorId={doctorId!}
            selectedDate={date}
            selectedTime={time}
            onSelectDateTime={(d, t) => {
              setDate(d);
              setTime(t);
            }}
          />
        );
      case 5:
        return (
          <SymptomsStep
            initialValue={symptoms}
            onChange={setSymptoms}
            setIsValid={setSymptomsValid}
          />
        );
      case 6:
        const { hospital, department, doctor } = getSelectedObjects();
        return (
          <BookingSummaryCard
            hospital={hospital}
            department={department}
            doctor={doctor}
            date={date!}
            time={time!}
            symptoms={symptoms}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full flex flex-col h-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Book Appointment
          </h1>
          <p className="text-muted-foreground mt-1">
            Follow the steps to schedule your consultation.
          </p>
        </div>

        <BookingStepper currentStep={step} />

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Dynamic Step Content */}
        <div className="flex-1 bg-card border border-border rounded-xl p-6 shadow-sm overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="w-28 gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid() || loading}
              className="w-28 gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleBook}
              disabled={bookingLoading}
              className="w-40 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {bookingLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Booking...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" /> Confirm & Book
                </>
              )}
            </Button>
          )}
        </div>

        <BookingConfirmationModal
          isOpen={showModal}
          onClose={handleCloseModal}
          bookingResult={bookingResult}
        />
      </div>
    </main>
  );
}
