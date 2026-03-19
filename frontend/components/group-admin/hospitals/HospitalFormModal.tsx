"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Loader2, Info } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Hospital } from "@/types/hospital";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import { apiClient } from "@/lib/axios";
import {
  useCreateHospital,
  useUpdateHospital,
} from "@/hooks/hospitals/useHospitals";
import { useToast } from "@/components/ui/toast";

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

// --- SCHEMA ---
export const hospitalSchema = z.object({
  hospital_name: z.string().min(3, "Hospital name is required"),
  hospital_code: z.string().min(2, "Hospital code is required"),

  registration_validity_months: z
    .number()
    .min(0)
    .transform((val) => (isNaN(val) ? 0 : val)),

  receptionist_contact: z.string().min(8, "Receptionist contact is required"),

  opening_date: z.string().min(1, "Opening date is required"),

  address: z.string().min(5, "Address is required"),

  pincode: z.string().min(5, "Pincode is required").max(10),

  city_id: z.number().nullable(),
  state_id: z.number().nullable(),

  description: z.string().optional().nullable(),

  registration_no: z.string().optional().nullable(),

  license_no: z.string().optional().nullable(),

  gst_no: z.string().optional().nullable(),

  contact_phone: z.string().optional().nullable(),

  contact_email: z.string().email("Invalid email").optional().nullable(),

  opening_time: z.string().nullable().optional(),
  closing_time: z.string().nullable().optional(),

  is_24by7: z.boolean().default(false),
});

type HospitalFormValues = z.infer<typeof hospitalSchema>;

interface HospitalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Hospital; // Adjusted type for flexibility
}

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

export default function HospitalFormModal({
  isOpen,
  onClose,
  defaultValues,
}: HospitalFormModalProps) {
  const isEdit = !!defaultValues;

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HospitalFormValues>({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      is_24by7: false,
      registration_validity_months: 0,
    },
  });
  const is24x7 = watch("is_24by7");
  const selectedStateId = watch("state_id");

  //--- TANSTACK QUERIES ---
  const { data: statesRes, isLoading: isLoadingStates } = useQuery({
    queryKey: ["states"],
    queryFn: fetchStates,
    enabled: isOpen,
  });

  const { data: citiesRes, isLoading: isLoadingCities } = useQuery({
    queryKey: ["cities", selectedStateId],
    queryFn: () => fetchCities(selectedStateId),
    enabled: !!selectedStateId && isOpen,
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
    if (!isOpen) return;

    if (selectedStateId === null) {
      setValue("city_id", null);
      return;
    }

    if (defaultValues?.state_id !== selectedStateId) {
      setValue("city_id", null);
    }
  }, [selectedStateId, setValue, defaultValues, isOpen]);

  // Hydrate form on open
  useEffect(() => {
    if (isOpen) {
      reset({
        hospital_name: defaultValues?.hospital_name || "",
        hospital_code: defaultValues?.hospital_code || "",
        registration_validity_months:
          defaultValues?.registration_validity_months || 0,
        receptionist_contact: defaultValues?.receptionist_contact || "",
        opening_date: defaultValues?.opening_date
          ? new Date(defaultValues.opening_date).toISOString().slice(0, 10)
          : "",
        description: defaultValues?.description || "",
        address: defaultValues?.address || "",
        pincode: defaultValues?.pincode || "",
        city_id: defaultValues?.city_id || null,
        state_id: defaultValues?.state_id || null,
        contact_phone: defaultValues?.contact_phone || "",
        contact_email: defaultValues?.contact_email || "",
        registration_no: defaultValues?.registration_no || "",
        license_no: defaultValues?.license_no || "",
        gst_no: defaultValues?.gst_no || "",
        is_24by7: defaultValues?.is_24by7 ?? false,
        opening_time: defaultValues?.opening_time
          ? new Date(defaultValues.opening_time).toISOString().slice(11, 16)
          : "",

        closing_time: defaultValues?.closing_time
          ? new Date(defaultValues.closing_time).toISOString().slice(11, 16)
          : "",
      });
    }
  }, [isOpen, defaultValues, reset]);

  const { mutateAsync: createHospital, isPending: isCreating } =
    useCreateHospital();
  const { mutateAsync: updateHospital, isPending: isUpdating } =
    useUpdateHospital();

  const isLoading = isCreating || isUpdating;
  const { addToast } = useToast();
  const sanitizePayload = (data: any) => {
    const sanitized: any = { ...data };

    Object.keys(sanitized).forEach((key) => {
      if (sanitized[key] === "") {
        sanitized[key] = null;
      }
    });

    return sanitized;
  };

  const onSubmit = async (data: HospitalFormValues) => {

    try {
      const payload = sanitizePayload(data);

      // If 24x7 → force time null
      if (payload.is_24by7) {
        payload.opening_time = null;
        payload.closing_time = null;
      }
      console.log("Payload:",payload);
      
      if (isEdit) {
        await updateHospital({
          id: defaultValues!.hospital_id,
          payload: payload,
        });
        addToast("Hospital updated successfully", "success");
      } else {
        await createHospital(payload);
        addToast("Hospital created successfully", "success");
      }

      onClose();
    } catch (error: any) {
      addToast(
        error?.response?.data?.message || "Something went wrong",
        "error",
      );
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-0 shadow-lg border border-border animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
          <div className="p-6 border-b border-border flex items-center justify-between bg-muted/10">
            <Dialog.Title className="text-lg font-semibold text-foreground">
              {isEdit ? "Edit Hospital Details" : "Register New Hospital"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="overflow-y-auto p-6">
            <form
              id="hospital-form"
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* LEFT COLUMN: Identity & Location */}
              <div className="space-y-5">
                <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">
                  Identity & Location
                </h4>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">
                    Hospital Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    {...register("hospital_name")}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                    placeholder="Apex Heart Institute"
                  />
                  {errors.hospital_name && (
                    <span className="text-xs text-destructive">
                      {errors.hospital_name.message}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">
                      Code <span className="text-destructive">*</span>
                    </label>
                    <input
                      {...register("hospital_code")}
                      className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background uppercase font-mono"
                      placeholder="APEX-01"
                    />
                    {errors.hospital_code && (
                      <span className="text-xs text-destructive">
                        {errors.hospital_code.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Description</label>
                  <textarea
                    {...register("description")}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background resize-none h-16"
                    placeholder="Brief description of the hospital..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">
                    Address Line <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    {...register("address")}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background resize-none h-16"
                    placeholder="Street address..."
                  />
                  {errors.address && (
                    <span className="text-xs text-destructive">
                      {errors.address.message}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-xs font-medium">State</label>
                    <Controller
                      name="state_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={stateOptions}
                          isLoading={isLoadingStates}
                          isDisabled={isLoadingStates}
                          placeholder="Search..."
                          styles={reactSelectStyles}
                          value={
                            stateOptions.find(
                              (c: any) => c.value === field.value,
                            ) || null
                          }
                          onChange={(val: any) =>
                            field.onChange(val ? Number(val.value) : null)
                          }
                        />
                      )}
                    />
                    {errors.state_id && (
                      <span className="text-xs text-destructive">
                        {errors.state_id.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-xs font-medium">City</label>
                    <Controller
                      name="city_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={cityOptions}
                          isLoading={isLoadingCities}
                          isDisabled={!selectedStateId || isLoadingCities}
                          placeholder="Search..."
                          styles={reactSelectStyles}
                          value={
                            cityOptions.find(
                              (c: any) => c.value === field.value,
                            ) || null
                          }
                          onChange={(val: any) =>
                            field.onChange(val ? Number(val.value) : null)
                          }
                        />
                      )}
                    />
                    {errors.city_id && (
                      <span className="text-xs text-destructive">
                        {errors.city_id.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-xs font-medium">
                      Pincode <span className="text-destructive">*</span>
                    </label>
                    <input
                      {...register("pincode")}
                      className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background h-[38px]"
                    />
                    {errors.pincode && (
                      <span className="text-xs text-destructive">
                        {errors.pincode.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Contact, Legal & Operational */}
              <div className="space-y-5">
                <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">
                  Contact, Legal & Operations
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Email Address</label>
                    <input
                      {...register("contact_email")}
                      className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                      placeholder="admin@hospital.com"
                    />
                    {errors.contact_email && (
                      <span className="text-xs text-destructive">
                        {errors.contact_email.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Contact Phone</label>
                    <input
                      {...register("contact_phone")}
                      className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                      placeholder="+91 99999 00000"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">
                    Receptionist Contact{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    {...register("receptionist_contact")}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                    placeholder="Reception desk number or email"
                  />
                  {errors.receptionist_contact && (
                    <span className="text-xs text-destructive">
                      {errors.receptionist_contact.message}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-medium">Reg. No</label>
                    <input
                      {...register("registration_no")}
                      className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                      placeholder="REG-123"
                    />
                  </div>
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-medium">License No</label>
                    <input
                      {...register("license_no")}
                      className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                    />
                  </div>
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-medium">GST No</label>
                    <input
                      {...register("gst_no")}
                      className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">
                      Opening Date <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="date"
                      {...register("opening_date")}
                      className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background h-[38px]"
                    />
                    {errors.opening_date && (
                      <span className="text-xs text-destructive">
                        {errors.opening_date.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">
                      Validity (Months)
                    </label>
                    <input
                      type="number"
                      {...register("registration_validity_months", {
                        valueAsNumber: true,
                      })}
                      className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background h-[38px]"
                    />
                    {errors.registration_validity_months && (
                      <span className="text-xs text-destructive">
                        {errors.registration_validity_months.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-muted/20 rounded-lg border border-border mt-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      24x7 Operational?
                    </label>
                    <input
                      type="checkbox"
                      {...register("is_24by7")}
                      className="w-4 h-4 accent-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Opening Time
                      </label>
                      <input
                        type="time"
                        {...register("opening_time")}
                        disabled={is24x7}
                        className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Closing Time
                      </label>
                      <input
                        type="time"
                        {...register("closing_time")}
                        disabled={is24x7}
                        className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background disabled:opacity-50"
                      />
                    </div>
                  </div>
                  {is24x7 && (
                    <div className="flex items-center gap-2 text-xs text-primary">
                      <Info className="w-3 h-3" />
                      <span>Time slots disabled for 24x7 hospitals.</span>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="p-4 bg-muted/30 border-t border-border flex justify-end gap-3 mt-auto">
            <Button variant="ghost" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              type="submit"
              form="hospital-form"
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "Update Hospital" : "Register Hospital"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
