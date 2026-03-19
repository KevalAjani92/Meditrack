"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { ChevronLeft } from "lucide-react";

// Adjust these import paths based on where you saved the provided components
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { DatePicker } from "@/components/ui/date-picker";

export default function RegisterPage() {
  const { register, isLoading } = useAuth();

  // Standardized form state matching RegisterDto
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    gender: "",
    dob: "",
  });

  // State to track validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Full Name Validation
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    } else if (formData.full_name.length > 150) {
      newErrors.full_name = "Full name cannot exceed 150 characters";
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (formData.email.length > 100) {
      newErrors.email = "Email cannot exceed 100 characters";
    }

    // Phone Number Validation (exactly 10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone_number)) {
      newErrors.phone_number = "Phone number must contain exactly 10 digits";
    }

    // Gender Validation
    if (!formData.gender) {
      newErrors.gender = "Please select a gender";
    }

    // DOB Validation (Must be 18+)
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const monthDifference = today.getMonth() - dobDate.getMonth();
      
      // Subtract a year if the current month is before the birth month, 
      // or if it's the birth month but the current day is before the birth day
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }

      if (age < 18) {
        newErrors.dob = "You must be at least 18 years old to register";
      }
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    } else if (formData.password.length > 100) {
      newErrors.password = "Password cannot exceed 100 characters";
    }

    setErrors(newErrors);
    
    // Return true if no errors, false otherwise
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error for this field when user starts typing
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleCustomChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user selects an option
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only proceed if validation passes
    if (validateForm()) {
      register(formData);
    }
  };

  

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Column: Branding/Image */}
      <div className="relative hidden h-full flex-col justify-between p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-zinc-900">
          <Image
            src="/bg_2.png"
            alt="Medical Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900/90 via-teal-900/40 to-transparent" />
        </div>

        <div className="relative z-20 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary backdrop-blur-md text-2xl font-bold text-white shadow-lg border border-white/30">
            M
          </div>
          <span className="text-2xl font-bold tracking-tight drop-shadow-md">
            MediTrack
          </span>
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium leading-relaxed drop-shadow-md">
              &ldquo;MediTrack has completely transformed how we manage patient
              records and appointments. It&apos;s not just software; it&apos;s
              the backbone of our clinic.&rdquo;
            </p>
            <footer className="text-sm font-medium text-teal-100 drop-shadow-sm">
              Dr. Sarah Mitchell, Chief of Cardiology
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex items-center justify-center p-8 bg-muted/20 lg:p-12 relative overflow-y-auto">
        <div className="fixed inset-0 w-full h-full lg:hidden z-0 pointer-events-none">
          <Image
            src="/bg_2.png"
            alt="Medical Background"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />
        </div>

        <div className="w-full max-w-[450px] space-y-6 relative z-10 py-6">
          <div className="flex flex-col space-y-2 text-center lg:hidden lg:text-left mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-2xl font-bold text-primary-foreground shadow-lg mb-4">
              M
            </div>
            <h1 className="text-3xl font-bold tracking-tight">MedCore</h1>
          </div>

          <Link
            href="/landing"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="flex flex-col space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight">
              Create an account
            </h1>
            <p className="text-muted-foreground">
              Enter your details below to create your patient profile
            </p>
          </div>

          <div className="grid gap-6">
            {/* Removed standard HTML5 validation (required, maxLength) so custom validation handles everything gracefully */}
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              
              <div className="space-y-2">
                <label
                  htmlFor="full_name"
                  className="text-sm font-medium leading-none"
                >
                  Full Name
                </label>
                <Input
                  id="full_name"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className={`h-11 ${errors.full_name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {errors.full_name && (
                  <p className="text-xs text-red-500">{errors.full_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`h-11 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone_number"
                  className="text-sm font-medium leading-none"
                >
                  Phone Number
                </label>
                <Input
                  id="phone_number"
                  type="tel"
                  placeholder="1234567890"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className={`h-11 ${errors.phone_number ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {errors.phone_number && (
                  <p className="text-xs text-red-500">{errors.phone_number}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Gender
                  </label>
                  <CustomDropdown
                    options={genderOptions}
                    value={formData.gender}
                    onChange={(value) => handleCustomChange("gender", value)}
                    placeholder="Select gender"
                    className={`h-11 w-full ${errors.gender ? "border-red-500 focus:ring-red-500" : ""}`}
                  />
                  {errors.gender && (
                    <p className="text-xs text-red-500">{errors.gender}</p>
                  )}
                </div>

                <div className="space-y-2 ">
                  <label className="text-sm font-medium leading-none">
                    Date of Birth
                  </label>
                  <DatePicker
                    value={formData.dob}
                    onChange={(date) => handleCustomChange("dob", date)}
                    placeholder="Select Date"
                    className={`h-11 w-full ${errors.dob ? "border-red-500 focus:ring-red-500" : ""}`}
                  />
                  {errors.dob && (
                    <p className="text-xs text-red-500">{errors.dob}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`h-11 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <Button
                className="w-full h-11 text-base mt-2"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <p className="px-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="underline underline-offset-4 hover:text-primary font-medium"
              >
                Log in
              </Link>
            </p>

            <p className="text-xs text-center text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}