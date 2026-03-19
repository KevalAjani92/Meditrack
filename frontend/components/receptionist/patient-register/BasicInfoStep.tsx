"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Info } from "lucide-react";
import { PatientRegistrationData } from "@/types/patient-registration";
import { apiClient } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Select from "react-select";

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

export default function BasicInfoStep() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PatientRegistrationData>();

  const dobValue = watch("dob");
  const ageValue = watch("age");
  const selectedStateId = watch("state_id");

  const { data: statesRes, isLoading: isLoadingStates } = useQuery({
    queryKey: ["states"],
    queryFn: fetchStates,
  });

  const { data: citiesRes, isLoading: isLoadingCities } = useQuery({
    queryKey: ["cities", selectedStateId],
    queryFn: () => fetchCities(selectedStateId),
    enabled: !!selectedStateId,
  });

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

  useEffect(() => {
    setValue("city_id", null);
  }, [selectedStateId]);

  // Auto-calculate DOB from Age
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const age = parseInt(e.target.value, 10);
    setValue("age", age);
    if (!isNaN(age) && age > 0) {
      const currentYear = new Date().getFullYear();
      const assumedDob = `${currentYear - age}-01-01`; // Default to Jan 1st of calculated year
      setValue("dob", assumedDob, { shouldValidate: true });
    }
  };

  // Determine if Minor
  const isMinor = () => {
    if (!dobValue) return false;
    const ageDifMs = Date.now() - new Date(dobValue).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) < 18;
  };

  const inputClass =
    "w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:ring-2 focus:ring-ring outline-none transition-shadow";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Basic Information</h2>
        {isMinor() && (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-warning/10 text-warning border border-warning/20 rounded-full text-xs font-bold uppercase tracking-wider">
            <Info className="w-3.5 h-3.5" /> Minor Patient
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Full Name <span className="text-destructive">*</span>
          </label>
          <input
            {...register("fullName")}
            className={inputClass}
            placeholder="e.g. John Doe"
          />
          {errors.fullName && (
            <p className="text-xs text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Gender <span className="text-destructive">*</span>
          </label>
          <select {...register("gender")} className={inputClass}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-xs text-destructive">{errors.gender.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground flex justify-between">
            <span>Age (Years)</span>
            <span className="text-xs text-muted-foreground font-normal">
              Auto-fills DOB
            </span>
          </label>
          <input
            type="number"
            value={ageValue || ""}
            onChange={handleAgeChange}
            className={inputClass}
            placeholder="e.g. 32"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Date of Birth <span className="text-destructive">*</span>
          </label>
          <input type="date" {...register("dob")} className={inputClass} />
          {errors.dob && (
            <p className="text-xs text-destructive">{errors.dob.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Phone Number <span className="text-destructive">*</span>
          </label>
          <input
            {...register("phone")}
            className={inputClass}
            placeholder="+1 555-0000"
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Email Address
          </label>
          <input
            {...register("email")}
            className={inputClass}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-border space-y-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Address Details
        </h3>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Residential Address <span className="text-destructive">*</span>
          </label>
          <input
            {...register("address")}
            className={inputClass}
            placeholder="Street, Apt, etc."
          />
          {errors.address && (
            <p className="text-xs text-destructive">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              State <span className="text-destructive">*</span>
            </label>
            <Controller
              name="state_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={stateOptions}
                  isLoading={!!isLoadingStates}
                  placeholder="Select State"
                  styles={reactSelectStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
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
            {errors.state_id && (
              <p className="text-xs text-destructive">
                {errors.state_id.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              City <span className="text-destructive">*</span>
            </label>
            <Controller
              name="city_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={cityOptions}
                  isLoading={!!isLoadingCities}
                  isDisabled={!selectedStateId}
                  placeholder="Select City"
                  styles={reactSelectStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
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
            {errors.city_id && (
              <p className="text-xs text-destructive">
                {errors.city_id.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Pincode <span className="text-destructive">*</span>
            </label>
            <input
              {...register("pincode")}
              className={inputClass}
              placeholder="10001"
            />
            {errors.pincode && (
              <p className="text-xs text-destructive">
                {errors.pincode.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
