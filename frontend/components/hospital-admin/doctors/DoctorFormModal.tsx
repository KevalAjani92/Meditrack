"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Loader2, DollarSign } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Doctor,
  DepartmentDropdown,
  SpecializationDropdown,
} from "@/types/doctor";
import { doctorService } from "@/services/doctor.service";
import { toast } from "sonner";
import { SearchableSelect } from "@/components/ui/searchable-select";

const doctorSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(10, "Phone number required"),
  department_id: z.string().min(1, "Department is required"),
  specialization_id: z.string().min(1, "Specialization is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  qualification: z.string().min(2, "Qualification is required"),
  experience_years: z.coerce.number().min(0).pipe(z.number()),
  consultation_fees: z.coerce.number().min(0).pipe(z.number()),
  medical_license_no: z.string().min(3, "License No is required"),
  is_available: z.boolean(),
  is_active: z.boolean(),
  description: z.string().optional(),
});

type DoctorFormValues = z.infer<typeof doctorSchema>;

interface DoctorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Doctor;
  departments: DepartmentDropdown[];
  hospitalId: number;
  onSuccess: (password?: string) => void;
}

export default function DoctorFormModal({
  isOpen,
  onClose,
  defaultValues,
  departments,
  hospitalId,
  onSuccess,
}: DoctorFormModalProps) {
  const isEdit = !!defaultValues;
  const [specializations, setSpecializations] = useState<
    SpecializationDropdown[]
  >([]);
  const [backendError, setBackendError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      is_active: true,
      is_available: true,
      gender: "Male",
    },
  });

  const isAvailable = watch("is_available");

  // Fetch specializations
  useEffect(() => {
    if (isOpen) {
      doctorService
        .getSpecializations()
        .then((res) => {
          setSpecializations(res);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setBackendError(null);
      reset({
        full_name: defaultValues?.doctor_name || "",
        email: defaultValues?.email || "",
        phone_number: defaultValues?.phone_number || "",
        department_id: defaultValues?.department_id
          ? String(defaultValues.department_id)
          : "",
        specialization_id: defaultValues?.specialization_id
          ? String(defaultValues.specialization_id)
          : "",
        gender: (defaultValues?.gender as any) || "Male",
        qualification: defaultValues?.qualification || "",
        experience_years: defaultValues?.experience_years || 0,
        consultation_fees: defaultValues?.consultation_fees || 0,
        medical_license_no: defaultValues?.medical_license_no || "",
        is_available:
          defaultValues?.availability === "Unavailable" ? false : true,
        is_active: defaultValues?.status === "Inactive" ? false : true,
        description: defaultValues?.description || "",
      });
    }
  }, [isOpen, defaultValues, reset]);

  const onSubmit = async (data: DoctorFormValues) => {
    setBackendError(null);
    try {
      const payload = {
        ...data,
        department_id: parseInt(data.department_id),
        specialization_id: parseInt(data.specialization_id),
      };

      if (isEdit) {
        await doctorService.updateDoctor(defaultValues!.doctor_id, payload);
        toast.success("Doctor updated successfully");
        onSuccess();
      } else {
        const res = await doctorService.createDoctor(hospitalId, payload);
        toast.success("Doctor created successfully");
        onSuccess(res.generatedPassword);
      }
    } catch (err: any) {
      const msg = err?.message || err?.errors?.[0] || "Something went wrong";
      setBackendError(msg);
      toast.error(msg);
    }
  };

  const departmentOptions = departments.map((d) => ({
    label: d.department_name,
    value: String(d.department_id),
  }));

  const specializationOptions = specializations.map((s) => ({
    label: s.specialization_name,
    value: String(s.specialization_id),
  }));

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-0 shadow-lg border border-border animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
          <div className="p-6 border-b border-border bg-muted/10 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-foreground">
              {isEdit ? "Edit Doctor Profile" : "Register New Doctor"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="overflow-y-auto p-6">
            {backendError && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                {backendError}
              </div>
            )}

            <form
              id="doctor-form"
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* LEFT COLUMN: Personal & Professional */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">
                  Professional Identity
                </h4>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Doctor Name</label>
                  <input
                    {...register("full_name")}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                    placeholder="Dr. John Doe"
                  />
                  {errors.full_name && (
                    <span className="text-xs text-destructive">
                      {errors.full_name.message}
                    </span>
                  )}
                </div>

                {!isEdit && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">
                        Email Address
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                        placeholder="doctor@hospital.com"
                      />
                      {errors.email && (
                        <span className="text-xs text-destructive">
                          {errors.email.message}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">
                        Phone Number
                      </label>
                      <input
                        {...register("phone_number")}
                        className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                        placeholder="+91 9876543210"
                      />
                      {errors.phone_number && (
                        <span className="text-xs text-destructive">
                          {errors.phone_number.message}
                        </span>
                      )}
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Department</label>

                  <Controller
                    name="department_id"
                    control={control}
                    render={({ field }) => (
                      <SearchableSelect
                        options={departmentOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Search department..."
                      />
                    )}
                  />

                  {errors.department_id && (
                    <span className="text-xs text-destructive">
                      {errors.department_id.message}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Specialization</label>

                  <Controller
                    name="specialization_id"
                    control={control}
                    render={({ field }) => (
                      <SearchableSelect
                        options={specializationOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Search specialization..."
                      />
                    )}
                  />

                  {errors.specialization_id && (
                    <span className="text-xs text-destructive">
                      {errors.specialization_id.message}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Qualification</label>
                    <input
                      {...register("qualification")}
                      className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                      placeholder="MBBS, MD"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">
                      Experience (Yrs)
                    </label>
                    <input
                      type="number"
                      {...register("experience_years")}
                      className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Gender</label>
                  <div className="flex gap-4">
                    {["Male", "Female", "Other"].map((g) => (
                      <label
                        key={g}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="radio"
                          value={g}
                          {...register("gender")}
                          className="accent-primary"
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Operational & Status */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">
                  Operational Details
                </h4>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">
                    Medical License No
                  </label>
                  <input
                    {...register("medical_license_no")}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background uppercase font-mono"
                    placeholder="MED-12345"
                  />
                  {errors.medical_license_no && (
                    <span className="text-xs text-destructive">
                      {errors.medical_license_no.message}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">
                    Consultation Fees
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="number"
                      {...register("consultation_fees")}
                      className="w-full pl-8 pr-3 py-2 border border-input rounded-lg text-sm bg-background"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted/20 rounded-lg border border-border mt-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">
                        Current Availability
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Can accept appointments?
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        {...register("is_available")}
                      />
                      <div
                        className={`w-9 h-5 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${isAvailable ? "bg-success after:translate-x-full after:border-white" : "bg-gray-200"}`}
                      ></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">
                        Account Status
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Active in system?
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        {...register("is_active")}
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-success"></div>
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">
                    Short Bio / Description
                  </label>
                  <textarea
                    {...register("description")}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background resize-none h-20"
                    placeholder="Brief professional bio..."
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="p-4 bg-muted/30 border-t border-border flex justify-end gap-3 mt-auto">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="doctor-form"
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "Update Profile" : "Create Doctor"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
