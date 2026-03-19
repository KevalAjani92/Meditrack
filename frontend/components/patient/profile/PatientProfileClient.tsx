"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import ProfileSummaryCard from "@/components/patient/profile/ProfileSummaryCard";
import PersonalInfoForm from "@/components/patient/profile/PersonalInfoForm";
import ContactDetailsForm from "@/components/patient/profile/ContactDetailsForm";
import EmergencyContactsSection from "@/components/patient/profile/EmergencyContactsSection";
import MedicalDetailsForm from "@/components/patient/profile/MedicalDetailsForm";

import { patientService } from "@/services/patient.service";
import type { PatientProfile } from "@/types/patient";

export default function PatientProfileClient() {
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientService.getMyProfile();
      setPatient(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <main className="min-h-full bg-background p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading profile...</span>
      </main>
    );
  }

  if (error || !patient) {
    return (
      <main className="min-h-full bg-background p-4 sm:p-6 lg:p-8">
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          {error || "Profile not found"}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-background p-4 sm:p-6 lg:p-8 space-y-6">

      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your personal information, medical details, and emergency contacts.</p>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={itemVariants}>
          <ProfileSummaryCard patient={patient} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <PersonalInfoForm patient={patient} onSaved={fetchProfile} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ContactDetailsForm patient={patient} onSaved={fetchProfile} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <EmergencyContactsSection contacts={patient.emergencyContacts} onChanged={fetchProfile} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <MedicalDetailsForm patient={patient} onSaved={fetchProfile} />
        </motion.div>
      </motion.div>

    </main>
  );
}