"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { ChevronLeft, EyeOff, Eye } from "lucide-react";
import { useState } from "react";

const isPhoneNumber = (value: string) => /^[6-9]\d{9}$/.test(value);

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  // Form State
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    credential?: string;
    password?: string;
  }>({});

  // const handleRoleLogin = (role: UserRole) => {
  //   login(role);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { credential?: string; password?: string } = {};

    if (!credential) {
      newErrors.credential = "Email or phone number is required";
    } else if (!isEmail(credential) && !isPhoneNumber(credential)) {
      newErrors.credential = "Enter a valid email or phone number";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    await login(credential, password);
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Column: Branding/Image */}
      <div className="relative hidden h-full flex-col justify-between p-10 lg:flex">
        {/* Background Image Container */}
        <div className="absolute inset-0 bg-zinc-900">
          {" "}
          {/* Dark fallback color */}
          <Image
            src="/bg_2.png"
            alt="Medical Background"
            fill
            className="object-cover"
            priority
          />
          {/* 1. Subtle dark overlay for overall contrast (optional, low opacity) */}
          <div className="absolute inset-0 bg-black/10" />
          {/* 2. Bottom Gradient: Ensures the Quote/Text is readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900/90 via-teal-900/40 to-transparent" />
        </div>

        {/* Logo Area */}
        <div className="relative z-20 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary backdrop-blur-md text-2xl font-bold text-primary-foreground shadow-lg border border-white/30">
            M
          </div>
          <span className="text-2xl font-bold tracking-tight drop-shadow-md">
            MediTrack
          </span>
        </div>

        {/* Quote/Testimonial Area */}
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg text-white font-medium leading-relaxed drop-shadow-md">
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
      <div className="flex items-center justify-center p-8 bg-muted/20 lg:p-12">
        {/* --- NEW: Mobile Background Image --- */}
        <div className="fixed inset-0 w-full h-full lg:hidden z-0 pointer-events-none">
          <Image
            src="/bg_2.png"
            alt="Medical Background"
            fill
            className="object-cover opacity-60" // Low opacity (10%)
            priority
          />
          {/* Optional: Add a light blur or gradient to make text more readable */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />
        </div>

        <div className="w-full max-w-[400px] space-y-6 relative z-10">
          {" "}
          {/* Reduced max-width for cleaner look without grid */}
          {/* Mobile Logo */}
          <div className="flex flex-col space-y-2 text-center lg:hidden lg:text-left mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-2xl font-bold text-primary-foreground shadow-lg mb-4">
              M
            </div>
            <h1 className="text-3xl font-bold tracking-tight">MedCore</h1>
          </div>
          {/* Back Button */}
          <Link
            href="/landing"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
          {/* <div className="flex flex-col space-y-2 text-center lg:text-left">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <RoleButton
                role="SuperAdmin"
                icon={Shield}
                label="Super Admin"
                onClick={() => handleRoleLogin("SuperAdmin")}
                disabled={isLoading}
              />
              <RoleButton
                role="GroupAdmin"
                icon={Building2}
                label="Group Admin"
                onClick={() => handleRoleLogin("GroupAdmin")}
                disabled={isLoading}
              />
              <RoleButton
                role="HospitalAdmin"
                icon={Activity}
                label="Hospital Admin"
                onClick={() => handleRoleLogin("HospitalAdmin")}
                disabled={isLoading}
              />
              <RoleButton
                role="Doctor"
                icon={Stethoscope}
                label="Doctor"
                onClick={() => handleRoleLogin("Doctor")}
                disabled={isLoading}
              />
              <RoleButton
                role="Receptionist"
                icon={BookOpen}
                label="Receptionist"
                onClick={() => handleRoleLogin("Receptionist")}
                disabled={isLoading}
              />
              <RoleButton
                role="Patient"
                icon={User}
                label="Patient"
                onClick={() => handleRoleLogin("Patient")}
                disabled={isLoading}
              />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your portal.
            </p>
          </div> */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email">Email or Phone</label>
              <Input
                id="credential"
                type="text"
                placeholder="Email or Phone Number"
                className={`h-11 ${errors.credential ? "border-red-500" : ""}`}
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
              />
              {errors.credential && (
                <p className="text-sm text-red-500">{errors.credential}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password">Password</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`h-11 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="underline underline-offset-4 hover:text-primary font-medium"
            >
              Register as Patient
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// function RoleButton({
//   role,
//   icon: Icon,
//   label,
//   onClick,
//   disabled,
// }: {
//   role: string;
//   icon: any;
//   label: string;
//   onClick: () => void;
//   disabled: boolean;
// }) {
//   return (
//     <Button
//       variant="outline"
//       className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5 transition-all text-center border-2 border-transparent hover:border-primary/20 bg-background shadow-sm hover:shadow-md"
//       onClick={onClick}
//       disabled={disabled}
//     >
//       <div className="p-2 rounded-full bg-primary/10 text-primary">
//         <Icon className="h-6 w-6" />
//       </div>
//       <span className="font-semibold text-sm">{label}</span>
//     </Button>
//   );
// }
