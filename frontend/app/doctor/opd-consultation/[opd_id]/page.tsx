"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save, CheckCircle } from "lucide-react";

// Layout & Steps
import PatientHeader from "@/components/doctor/opd-consultation/PatientHeader";
import ConsultationStepper from "@/components/doctor/opd-consultation/ConsultationStepper";
import PatientProfileStep from "@/components/doctor/opd-consultation/steps/PatientProfileStep";
import ConsultationStep from "@/components/doctor/opd-consultation/steps/ConsultationStep";
import PrescriptionStep from "@/components/doctor/opd-consultation/steps/PrescriptionStep";
import TestsStep from "@/components/doctor/opd-consultation/steps/TestsStep";
import FollowUpStep from "@/components/doctor/opd-consultation/steps/FollowUpStep";
import ConsultationSummaryStep from "@/components/doctor/opd-consultation/steps/ConsultationSummaryStep";

// Modals
import AddDiagnosisModal from "@/components/doctor/opd-consultation/modals/AddDiagnosisModal";
import AddProcedureModal from "@/components/doctor/opd-consultation/modals/AddProcedureModal";
import AddMedicineModal from "@/components/doctor/opd-consultation/modals/AddMedicineModal";
import AddTestModal from "@/components/doctor/opd-consultation/modals/AddTestModal";
import AddFollowupModal from "@/components/doctor/opd-consultation/modals/AddFollowupModal";

import {
  mockPatientEMR,
  ConsultationData,
  Diagnosis,
  Procedure,
  Prescription,
  TestOrder,
  FollowUp,
} from "@/types/consultation";

export default function OpdConsultationPage({
  params,
}: {
  params: { opd_id: string };
}) {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // --- Main EMR Data State ---
  const [data, setData] = useState<ConsultationData>({
    chiefComplaint: "",
    clinicalNotes: "",
    adviceNotes: "",
    diagnoses: [],
    procedures: [],
    prescriptions: [],
    tests: [],
    followUps: [],
  });

  // --- Modal States (Tracking Open state + Which item to edit) ---
  const [diagModal, setDiagModal] = useState<{
    isOpen: boolean;
    data: Diagnosis | null;
  }>({ isOpen: false, data: null });
  const [procModal, setProcModal] = useState<{
    isOpen: boolean;
    data: Procedure | null;
  }>({ isOpen: false, data: null });
  const [medModal, setMedModal] = useState<{
    isOpen: boolean;
    data: Prescription | null;
  }>({ isOpen: false, data: null });
  const [testModal, setTestModal] = useState<{
    isOpen: boolean;
    data: TestOrder | null;
  }>({ isOpen: false, data: null });
  const [followModal, setFollowModal] = useState<{
    isOpen: boolean;
    data: FollowUp | null;
  }>({ isOpen: false, data: null });

  // --- Autosave Simulator ---
  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(() => setIsSaving(false), 1000);
    return () => clearTimeout(timer);
  }, [data]);

  // Helper to partially update main state
  const updateData = (updates: Partial<ConsultationData>) =>
    setData((prev) => ({ ...prev, ...updates }));

  // Generic Save Handlers for Modals (Handles both Add and Edit based on presence of ID)
  const handleSaveItem = (listName: keyof ConsultationData, item: any) => {
    const list = data[listName] as any[];
    const exists = list.some((x) => x.id === item.id);
    if (exists) {
      updateData({
        [listName]: list.map((x) => (x.id === item.id ? item : x)),
      } as any);
    } else {
      updateData({ [listName]: [...list, item] } as any);
    }
  };

  // --- Navigation ---
  const handleNext = () => {
    if (step < 6) setStep((s) => s + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };
  const handleComplete = () => {
    console.log("Consultation Completed:", data);
  };

  return (
    <main className="min-h-screen bg-background flex flex-col relative">
      <PatientHeader patient={mockPatientEMR} isAutosaving={isSaving} />
      <ConsultationStepper currentStep={step} setStep={setStep} />

      <div className="flex-1 max-w-[1400px] mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && <PatientProfileStep patient={mockPatientEMR} />}

              {step === 2 && (
                <ConsultationStep
                  data={data}
                  updateData={updateData}
                  onOpenDiagnosis={() =>
                    setDiagModal({ isOpen: true, data: null })
                  }
                  onEditDiagnosis={(d) =>
                    setDiagModal({ isOpen: true, data: d })
                  }
                  onOpenProcedure={() =>
                    setProcModal({ isOpen: true, data: null })
                  }
                  onEditProcedure={(p) =>
                    setProcModal({ isOpen: true, data: p })
                  }
                />
              )}

              {step === 3 && (
                <PrescriptionStep
                  data={data}
                  updateData={updateData}
                  onOpenMedicine={() =>
                    setMedModal({ isOpen: true, data: null })
                  }
                  onEditMedicine={(m) => setMedModal({ isOpen: true, data: m })}
                />
              )}

              {step === 4 && (
                <TestsStep
                  data={data}
                  updateData={updateData}
                  onOpenTest={() => setTestModal({ isOpen: true, data: null })}
                  onEditTest={(t: any) =>
                    setTestModal({ isOpen: true, data: t })
                  }
                />
              )}

              {step === 5 && (
                <FollowUpStep
                  data={data}
                  updateData={updateData}
                  onOpenFollowup={() =>
                    setFollowModal({ isOpen: true, data: null })
                  }
                  onEditFollowup={(f: any) =>
                    setFollowModal({ isOpen: true, data: f })
                  }
                />
              )}

              {step === 6 && <ConsultationSummaryStep data={data} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-8 pt-4 border-t border-border flex items-center justify-between sticky bottom-0 bg-background/90 backdrop-blur-sm py-4 z-30">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="w-24 gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <Button variant="secondary" className="gap-2 hidden sm:flex">
              <Save className="w-4 h-4" /> Save Draft
            </Button>
          </div>

          {step < 6 ? (
            <Button onClick={handleNext} className="w-32 gap-2 shadow-sm">
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="bg-success hover:bg-success/90 text-success-foreground gap-2 shadow-md"
            >
              <CheckCircle className="w-4 h-4" /> Complete Consultation
            </Button>
          )}
        </div>
      </div>

      {/* --- ALL MODALS --- */}
      <AddDiagnosisModal
        isOpen={diagModal.isOpen}
        onClose={() => setDiagModal({ isOpen: false, data: null })}
        defaultValues={diagModal.data}
        onSave={(d) => handleSaveItem("diagnoses", d)}
      />
      <AddProcedureModal
        isOpen={procModal.isOpen}
        onClose={() => setProcModal({ isOpen: false, data: null })}
        defaultValues={procModal.data}
        onSave={(p) => handleSaveItem("procedures", p)}
      />
      <AddMedicineModal
        isOpen={medModal.isOpen}
        onClose={() => setMedModal({ isOpen: false, data: null })}
        defaultValues={medModal.data}
        onSave={(m) => handleSaveItem("prescriptions", m)}
      />
      <AddTestModal
        isOpen={testModal.isOpen}
        onClose={() => setTestModal({ isOpen: false, data: null })}
        defaultValues={testModal.data as any}
        onSave={(t) => handleSaveItem("tests", t)}
      />
      <AddFollowupModal
        isOpen={followModal.isOpen}
        onClose={() => setFollowModal({ isOpen: false, data: null })}
        defaultValues={followModal.data}
        onSave={(f) => handleSaveItem("followUps", f)}
      />
    </main>
  );
}
