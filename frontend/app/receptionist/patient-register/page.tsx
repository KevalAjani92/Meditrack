"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

import RegistrationStepper from "@/components/receptionist/patient-register/RegistrationStepper";
import BasicInfoStep from "@/components/receptionist/patient-register/BasicInfoStep";
import MedicalDetailsStep from "@/components/receptionist/patient-register/MedicalDetailsStep";
import EmergencyContactsStep from "@/components/receptionist/patient-register/EmergencyContactsStep";
import RegistrationSummaryStep from "@/components/receptionist/patient-register/RegistrationSummaryStep";
import RegistrationSuccessModal from "@/components/receptionist/patient-register/RegistrationSuccessModal";

import {
  patientRegistrationSchema,
  PatientRegistrationData,
} from "@/types/patient-registration";
import { useRegisterPatient } from "@/hooks/patients/usePatientMutations";

const STEP_KEYS: (keyof PatientRegistrationData)[][] = [
  [
    "fullName",
    "gender",
    "dob",
    "phone",
    "email",
    "address",
    "city_id",
    "state_id",
    "pincode",
  ], // Step 1
  ["bloodGroup", "allergies", "chronicConditions", "currentMedications"], // Step 2
  ["emergencyContacts"], // Step 3
];

export default function PatientRegistrationPage() {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState("");

  const methods = useForm<PatientRegistrationData>({
    resolver: zodResolver(patientRegistrationSchema),
    defaultValues: {
      gender: "",
      emergencyContacts: [],
    },
    mode: "onTouched",
  });

  const handleNext = async () => {
    // Validate only current step fields before moving
    const fieldsToValidate = STEP_KEYS[step - 1];
    const isValid = await methods.trigger(fieldsToValidate);

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const registerPatientMutation = useRegisterPatient();

  const onSubmit = async (data: PatientRegistrationData) => {
    registerPatientMutation.mutate(data, {
      onSuccess: (res) => {
        setGeneratedId(res.patient_no);
        setShowSuccess(true);
      },
    });
  };

  return (
    <main className="min-h-full bg-background p-4 sm:p-6 lg:p-8 flex justify-center">
      <div className="w-full flex flex-col h-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Patient Registration
          </h1>
          <p className="text-muted-foreground mt-1">
            Register a new patient into the system.
          </p>
        </div>

        <RegistrationStepper currentStep={step} />

        <FormProvider {...methods}>
          <form className="flex-1 flex flex-col">
            <div className="flex-1 bg-card border border-border rounded-xl p-6 shadow-sm overflow-hidden min-h-[450px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 1 && <BasicInfoStep />}
                  {step === 2 && <MedicalDetailsStep />}
                  {step === 3 && <EmergencyContactsStep />}
                  {step === 4 && <RegistrationSummaryStep />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className="px-6 py-2 border border-input rounded-md text-foreground font-medium flex items-center gap-2 hover:bg-muted disabled:opacity-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={methods.handleSubmit(onSubmit)}
                  disabled={registerPatientMutation.isPending}
                  className="px-6 py-2 bg-success text-success-foreground rounded-md font-medium flex items-center gap-2 hover:bg-success/90 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" /> Confirm & Register
                </button>
              )}
            </div>
          </form>
        </FormProvider>

        <RegistrationSuccessModal
          isOpen={showSuccess}
          patientName={methods.getValues("fullName")}
          patientId={generatedId}
        />
      </div>
    </main>
  );
}
