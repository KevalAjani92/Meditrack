"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import PatientHeader from "@/components/doctor/opd-consultation/PatientHeader";
import PastVisitsTimeline from "@/components/doctor/opd-consultation/PastVisitsTimeline";

import ConsultationStep from "@/components/doctor/opd-consultation/steps/ConsultationStep";
import PrescriptionStep from "@/components/doctor/opd-consultation/steps/PrescriptionStep";
import TestStep from "@/components/doctor/opd-consultation/steps/TestsStep";
import FollowupStep from "@/components/doctor/opd-consultation/steps/FollowUpStep";
import ConsultationSummaryStep from "@/components/doctor/opd-consultation/steps/ConsultationSummaryStep";

import AddDiagnosisModal from "@/components/doctor/opd-consultation/modals/AddDiagnosisModal";
import AddProcedureModal from "@/components/doctor/opd-consultation/modals/AddProcedureModal";
import AddMedicineModal from "@/components/doctor/opd-consultation/modals/AddMedicineModal";
import AddTestModal from "@/components/doctor/opd-consultation/modals/AddTestModal";
import AddFollowupModal from "@/components/doctor/opd-consultation/modals/AddFollowupModal";

import {
  ConsultationData,
  PatientEMR,
  Diagnosis,
  Procedure,
  Prescription,
  TestOrder,
  FollowUp,
  PastVisit,
} from "@/types/consultation";
import { opdConsultationService } from "@/services/opd-consultation.service";

const steps = [
  "Profile",
  "Consultation",
  "Prescription",
  "Tests",
  "Follow-up",
  "Summary",
];

export default function OPDConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const opdId = Number(params.opd_id);

  const [currentStep, setCurrentStep] = useState(0);
  const [patient, setPatient] = useState<PatientEMR | null>(null);
  const [pastVisits, setPastVisits] = useState<PastVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>(null);

  const [consultationData, setConsultationData] = useState<ConsultationData>({
    chiefComplaint: "",
    clinicalNotes: "",
    adviceNotes: "",
    diagnoses: [],
    procedures: [],
    prescriptions: [],
    tests: [],
    followUps: [],
  });

  // ─── Modal States ─────────────────────────────────────────────
  const [diagModal, setDiagModal] = useState(false);
  const [procModal, setProcModal] = useState(false);
  const [medModal, setMedModal] = useState(false);
  const [testModal, setTestModal] = useState(false);
  const [followupModal, setFollowupModal] = useState(false);
  const [editDiag, setEditDiag] = useState<Diagnosis | undefined>();
  const [editProc, setEditProc] = useState<Procedure | undefined>();
  const [editMed, setEditMed] = useState<Prescription | undefined>();
  const [editTest, setEditTest] = useState<TestOrder | undefined>();
  const [editFollowup, setEditFollowup] = useState<FollowUp | undefined>();

  // ─── Load Data ────────────────────────────────────────────────
  useEffect(() => {
    if (!opdId) return;
    setLoading(true);

    Promise.all([
      opdConsultationService.getVisitDetails(opdId),
      opdConsultationService.getPastVisits(opdId),
    ])
      .then(([visitRes, pastRes]) => {
        // console.log(pastRes);
        const vd = visitRes;
        setPatient(vd.patient);
        setConsultationData({
          chiefComplaint: vd.chiefComplaint || "",
          clinicalNotes: vd.clinicalNotes || "",
          adviceNotes: "",
          diagnoses: vd.diagnoses || [],
          procedures: vd.procedures || [],
          prescriptions: vd.prescriptions || [],
          tests: vd.tests || [],
          followUps: vd.followUps || [],
        });
        setPastVisits(pastRes || []);
      })
      .catch((err) => console.error("Load failed:", err))
      .finally(() => setLoading(false));
  }, [opdId]);

  // ─── Auto-save debounce for chief complaint & clinical notes ─
  const updateData = useCallback(
    (updates: Partial<ConsultationData>) => {
      setConsultationData((prev) => {
        const next = { ...prev, ...updates };

        // Debounce save chief_complaint and clinical_notes
        if (
          updates.chiefComplaint !== undefined ||
          updates.clinicalNotes !== undefined
        ) {
          if (debounceTimer.current) clearTimeout(debounceTimer.current);
          debounceTimer.current = setTimeout(async () => {
            setIsAutosaving(true);
            try {
              await opdConsultationService.updateVisit(opdId, {
                chief_complaint: next.chiefComplaint,
                clinical_notes: next.clinicalNotes,
              });
            } catch (e) {
              console.error("Autosave failed:", e);
            } finally {
              setIsAutosaving(false);
            }
          }, 1000);
        }

        return next;
      });
    },
    [opdId],
  );

  // ─── Diagnosis Handlers ───────────────────────────────────────
  const handleSaveDiagnosis = async (diag: any) => {
    try {
      const res = await opdConsultationService.addDiagnosis(opdId, {
        diagnosis_id: diag.diagnosisId || diag.id,
        is_primary: diag.isPrimary,
        remarks: diag.remarks,
      });
      
      setConsultationData((prev) => ({
        ...prev,
        diagnoses: [...(prev.diagnoses || []), res?.data].filter(Boolean),
      }));
    } catch (e: any) {
      alert(e?.message || "Failed to add diagnosis.");
    }
    setDiagModal(false);
    setEditDiag(undefined);
  };

  const handleRemoveDiagnosis = async (id: number) => {
    try {
      await opdConsultationService.removeDiagnosis(opdId, id);
      setConsultationData((prev) => ({
        ...prev,
        diagnoses: prev.diagnoses.filter((d) => d.id !== id),
      }));
    } catch (e: any) {
      alert(e?.message || "Failed to remove diagnosis.");
    }
  };

  // ─── Procedure Handlers ──────────────────────────────────────
  const handleSaveProcedure = async (proc: any) => {
    try {
      const res = await opdConsultationService.addProcedure(opdId, {
        procedure_id: proc.procedureId || proc.id,
        procedure_date: proc.date,
        remarks: proc.remarks,
      });
      setConsultationData((prev) => ({
        ...prev,
        procedures: [
          ...prev.procedures.filter((p) => p.id !== proc.id),
          res.data,
        ],
      }));
    } catch (e: any) {
      alert(e?.message || "Failed to add procedure.");
    }
    setProcModal(false);
    setEditProc(undefined);
  };

  const handleRemoveProcedure = async (id: number) => {
    try {
      await opdConsultationService.removeProcedure(opdId, id);
      setConsultationData((prev) => ({
        ...prev,
        procedures: prev.procedures.filter((p) => p.id !== id),
      }));
    } catch (e: any) {
      alert(e?.message || "Failed to remove procedure.");
    }
  };

  // ─── Medicine/Prescription Handlers ──────────────────────────
  const handleSaveMedicine = async (med: any) => {
    try {
      const res = await opdConsultationService.savePrescription(opdId, {
        notes: "",
        items: [
          {
            medicine_id: med.medicineId || med.id,
            dosage: med.dosage,
            quantity: med.quantity,
            duration_days: med.durationDays,
            instructions: med.instructions,
          },
        ],
      });
      if (res.data && res.data.length > 0) {
        setConsultationData((prev) => ({
          ...prev,
          prescriptions: [...prev.prescriptions, ...res.data],
        }));
      }
    } catch (e: any) {
      alert(e?.message || "Failed to save prescription.");
    }
    setMedModal(false);
    setEditMed(undefined);
  };

  // ─── Test Handlers ───────────────────────────────────────────
  const handleSaveTest = async (test: any) => {
    try {
      const res = await opdConsultationService.orderTest(opdId, {
        test_id: test.testId || test.id,
        remarks: test.remarks,
      });
      setConsultationData((prev) => ({
        ...prev,
        tests: [...prev.tests.filter((t) => t.id !== test.id), res.data],
      }));
    } catch (e: any) {
      alert(e?.message || "Failed to order test.");
    }
    setTestModal(false);
    setEditTest(undefined);
  };

  const handleRemoveTest = async (id: number) => {
    try {
      await opdConsultationService.removeTest(opdId, id);
      setConsultationData((prev) => ({
        ...prev,
        tests: prev.tests.filter((t) => t.id !== id),
      }));
    } catch (e: any) {
      alert(e?.message || "Failed to remove test.");
    }
  };

  // ─── Followup Handlers ──────────────────────────────────────
  const handleSaveFollowup = async (fu: any) => {
    try {
      const res = await opdConsultationService.scheduleFollowup(opdId, {
        recommended_date: fu.date,
        reason: fu.reason,
      });
      setConsultationData((prev) => ({
        ...prev,
        followUps: [...prev.followUps.filter((f) => f.id !== fu.id), res.data],
      }));
    } catch (e: any) {
      alert(e?.message || "Failed to schedule follow-up.");
    }
    setFollowupModal(false);
    setEditFollowup(undefined);
  };

  const handleRemoveFollowup = async (id: number) => {
    try {
      await opdConsultationService.removeFollowup(opdId, id);
      setConsultationData((prev) => ({
        ...prev,
        followUps: prev.followUps.filter((f) => f.id !== id),
      }));
    } catch (e: any) {
      alert(e?.message || "Failed to remove follow-up.");
    }
  };

  // ─── Complete Consultation ──────────────────────────────────
  const handleComplete = async () => {
    setCompleting(true);
    try {
      await opdConsultationService.completeConsultation(opdId);
      alert("Consultation completed successfully!");
      router.push("/doctor/opd");
    } catch (e: any) {
      alert(e?.message || "Failed to complete consultation.");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Visit not found or patient data unavailable.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <PatientHeader patient={patient} isAutosaving={isAutosaving} />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="xl:col-span-3 space-y-6">
            {/* Stepper */}
            <div className="flex flex-wrap gap-2 p-2 bg-muted/10 rounded-xl border border-border">
              {steps.map((step, i) => (
                <button
                  key={step}
                  onClick={() => setCurrentStep(i)}
                  className={`flex-1 px-3 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    i === currentStep
                      ? "bg-primary text-primary-foreground shadow-md"
                      : i < currentStep
                        ? "bg-success/10 text-success hover:bg-success/20"
                        : "text-muted-foreground hover:bg-muted/20"
                  }`}
                >
                  {i < currentStep ? "✓ " : ""}
                  {step}
                </button>
              ))}
            </div>

            {/* Step Content */}
            {currentStep === 0 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                {/* Patient info is shown in PatientHeader, step 0 can show extended profile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                    <h3 className="font-bold text-foreground text-sm uppercase tracking-wider border-b border-border pb-2">
                      Contact Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Phone</p>
                        <p className="font-medium">{patient.phone || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Email</p>
                        <p className="font-medium">{patient.email || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">City</p>
                        <p className="font-medium">{patient.city || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Address</p>
                        <p className="font-medium">
                          {patient.address || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                    <h3 className="font-bold text-foreground text-sm uppercase tracking-wider border-b border-border pb-2">
                      Medical Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">
                          Blood Group
                        </p>
                        <p className="font-bold text-destructive">
                          {patient.bloodGroup}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">DOB</p>
                        <p className="font-medium">{patient.dob}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">
                          Allergies
                        </p>
                        <p className="font-medium">{patient.allergies}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">
                          Chronic Conditions
                        </p>
                        <p className="font-medium">
                          {patient.chronicConditions}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground text-xs">
                          Current Medications
                        </p>
                        <p className="font-medium">
                          {patient.currentMedications}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <ConsultationStep
                data={consultationData}
                updateData={updateData}
                onEditDiagnosis={(d) => {
                  setEditDiag(d);
                  setDiagModal(true);
                }}
                onEditProcedure={(p) => {
                  setEditProc(p);
                  setProcModal(true);
                }}
                onOpenDiagnosis={() => {
                  setEditDiag(undefined);
                  setDiagModal(true);
                }}
                onOpenProcedure={() => {
                  setEditProc(undefined);
                  setProcModal(true);
                }}
              />
            )}

            {currentStep === 2 && (
              <PrescriptionStep
                data={consultationData}
                updateData={updateData}
                onEditMedicine={(m) => {
                  setEditMed(m);
                  setMedModal(true);
                }}
                onOpenMedicine={() => {
                  setEditMed(undefined);
                  setMedModal(true);
                }}
              />
            )}

            {currentStep === 3 && (
              <TestStep
                data={consultationData}
                updateData={updateData}
                onEditTest={(t) => {
                  setEditTest(t);
                  setTestModal(true);
                }}
                onOpenTest={() => {
                  setEditTest(undefined);
                  setTestModal(true);
                }}
              />
            )}

            {currentStep === 4 && (
              <FollowupStep
                data={consultationData}
                updateData={updateData}
                onEditFollowup={(f) => {
                  setEditFollowup(f);
                  setFollowupModal(true);
                }}
                onOpenFollowup={() => {
                  setEditFollowup(undefined);
                  setFollowupModal(true);
                }}
              />
            )}

            {currentStep === 5 && (
              <ConsultationSummaryStep data={consultationData} />
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((s) => s - 1)}
              >
                ← Previous
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button onClick={() => setCurrentStep((s) => s + 1)}>
                  Next →
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={completing}
                  className="gap-2 bg-success hover:bg-success/90 text-success-foreground font-bold shadow-lg shadow-success/20"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {completing ? "Completing..." : "Complete Consultation"}
                </Button>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1">
            <PastVisitsTimeline visits={pastVisits} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddDiagnosisModal
        isOpen={diagModal}
        onClose={() => {
          setDiagModal(false);
          setEditDiag(undefined);
        }}
        onSave={handleSaveDiagnosis}
        editData={editDiag}
      />
      <AddProcedureModal
        isOpen={procModal}
        onClose={() => {
          setProcModal(false);
          setEditProc(undefined);
        }}
        onSave={handleSaveProcedure}
        editData={editProc}
      />
      <AddMedicineModal
        isOpen={medModal}
        onClose={() => {
          setMedModal(false);
          setEditMed(undefined);
        }}
        onSave={handleSaveMedicine}
        editData={editMed}
      />
      <AddTestModal
        isOpen={testModal}
        onClose={() => {
          setTestModal(false);
          setEditTest(undefined);
        }}
        onSave={handleSaveTest}
        editData={editTest}
      />
      <AddFollowupModal
        isOpen={followupModal}
        onClose={() => {
          setFollowupModal(false);
          setEditFollowup(undefined);
        }}
        onSave={handleSaveFollowup}
        editData={editFollowup}
      />
    </main>
  );
}
