"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PatientProfile } from "@/types/patient";
import { patientService } from "@/services/patient.service";
import { MapPin, Loader2, Edit2, X } from "lucide-react";
import { apiClient } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

// --- API FETCHERS ---
const fetchStates = async () => {
  const res = await apiClient.get("api/states");
  // console.log(res);

  return res;
};

const fetchCities = async (stateId: number | null) => {
  if (!stateId) {
    return {
      success: false,
      statusCode: 400,
      message: "No state",
      data: [],
      meta: null,
    };
  }
  const res = await apiClient.get(`api/cities?state=${stateId}`);
  return res;
};

const contactSchema = z.object({
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Valid phone is required"),
  address: z.string().min(5, "Address is required"),
  city_id: z.number().nullable(),
  state_id: z.number().nullable(),
  pincode: z.string().min(4, "Valid pincode required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

// Helper styling for react-select to match Tailwind theme
const reactSelectStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: "38px",
    borderRadius: "0.5rem",
    borderColor: "hsl(var(--border))",
    backgroundColor: "hsl(var(--background))",
    fontSize: "0.875rem",
    boxShadow: "none",
    "&:hover": { borderColor: "hsl(var(--border))" },
  }),
  menu: (base: any) => ({ ...base, fontSize: "0.875rem", zIndex: 9999 }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "hsl(var(--muted))" : "transparent",
    color: "hsl(var(--foreground))",
    cursor: "pointer",
    "&:active": { backgroundColor: "hsl(var(--muted))" },
  }),
  singleValue: (base: any) => ({ ...base, color: "hsl(var(--foreground))" }),
};

export default function ContactDetailsForm({
  patient,
  onSaved,
}: {
  patient: PatientProfile;
  onSaved: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      city_id: patient.city_id ?? null,
      state_id: patient.state_id ?? null,
      pincode: patient.pincode,
    },
  });

  const selectedStateId = watch("state_id");

  //--- TANSTACK QUERIES ---
  const { data: statesRes, isLoading: isLoadingStates } = useQuery({
    queryKey: ["states"],
    queryFn: fetchStates,
  });

  const { data: citiesRes, isLoading: isLoadingCities } = useQuery({
    queryKey: ["cities", selectedStateId],
    queryFn: () => fetchCities(selectedStateId),
    enabled: !!selectedStateId,
  });

  // Map API data to React-Select option format
  const stateOptions =
    statesRes?.data?.map((s: any) => ({
      label: s.state_name,
      value: s.state_id,
    })) || [];

  const cityOptions =
    citiesRes?.data?.map((c: any) => ({
      label: c.city_name,
      value: c.city_id,
    })) || [];

  // Reset city if state changes, unless we are initializing
  useEffect(() => {
    if (selectedStateId === null) {
      setValue("city_id", null);
      return;
    }

    if (patient.state_id !== selectedStateId) {
      setValue("city_id", null);
    }
  }, [selectedStateId, setValue, patient]);

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await patientService.updateContact({
        email: data.email,
        phone_number: data.phone,
        address: data.address,
        pincode: data.pincode,
        city_id: data.city_id,
        state_id: data.state_id,
      });
      setIsEditing(false);
      onSaved();
    } catch (err) {
      console.error("Failed to update contact details:", err);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const inputStyles =
    "w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none transition-colors disabled:bg-muted/30 disabled:text-muted-foreground disabled:opacity-100 disabled:cursor-default";

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm transition-all">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Contact Details
          </h2>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit Details
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Email Address
            </label>
            <input
              disabled={!isEditing}
              {...register("email")}
              className={inputStyles}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Phone Number
            </label>
            <input
              disabled={!isEditing}
              {...register("phone")}
              className={`${inputStyles} font-mono`}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Residential Address
            </label>
            <input
              disabled={!isEditing}
              {...register("address")}
              className={inputStyles}
            />
            {errors.address && (
              <p className="text-xs text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-3 md:col-span-2 gap-4">
            {/* STATE */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                State
              </label>
              <Controller
                name="state_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={stateOptions}
                    isLoading={isLoadingStates}
                    isDisabled={!isEditing}
                    placeholder="Select State"
                    styles={reactSelectStyles}
                    value={
                      stateOptions.find((s: any) => s.value === field.value) ||
                      null
                    }
                    onChange={(val: any) =>
                      field.onChange(val ? Number(val.value) : null)
                    }
                  />
                )}
              />
            </div>

            {/* CITY */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                City
              </label>
              <Controller
                name="city_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={cityOptions}
                    isLoading={isLoadingCities}
                    isDisabled={!selectedStateId || !isEditing}
                    placeholder="Select City"
                    styles={reactSelectStyles}
                    value={
                      cityOptions.find((c: any) => c.value === field.value) ||
                      null
                    }
                    onChange={(val: any) =>
                      field.onChange(val ? Number(val.value) : null)
                    }
                  />
                )}
              />
            </div>

            {/* PINCODE */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Pincode
              </label>
              <input
                disabled={!isEditing}
                {...register("pincode")}
                className={`${inputStyles} font-mono`}
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4 animate-in fade-in duration-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-input text-foreground text-sm font-medium rounded-md hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
