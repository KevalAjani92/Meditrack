"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/axios";
import { useToast } from "@/components/ui/toast";

export type UserRole =
  | "SuperAdmin"
  | "GroupAdmin"
  | "HospitalAdmin"
  | "Doctor"
  | "Receptionist"
  | "Patient";

export interface User {
  id: string; // Added ID for linking to Data entities
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  hospitalgroupid?: string | null;
  hospitalid?: string | null;
}

export interface RegisterData {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  gender: string;
  dob: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => void;
  logout: () => void;
  getRoleBasePath: (role?: UserRole) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { addToast } = useToast();

  // // Load user from local storage on mount
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("medcore_user");
  //   if (storedUser) {
  //     try {
  //       setUser(JSON.parse(storedUser));
  //     } catch (e) {
  //       console.error("Failed to parse user data", e);
  //       localStorage.removeItem("medcore_user");
  //     }
  //   }
  //   setIsLoading(false);
  // }, []);

  const getRoleBasePath = (role?: UserRole) => {
    const r = role || user?.role;
    if (!r) return "/";

    // Map multiple admin roles to the single /admin directory structure
    if (r === "HospitalAdmin") return "/hospital-admin";

    // Others map 1:1 to their directory (lowercase)
    if (r === "SuperAdmin") return "/super-admin";
    if (r === "GroupAdmin") return "/group-admin";
    if (r === "Doctor") return "/doctor";
    if (r === "Receptionist") return "/receptionist";
    if (r === "Patient") return "/patient";

    return "/";
  };

  // // Helper to set cookie
  // const setCookie = (name: string, value: string, days: number) => {
  //   const expires = new Date();
  //   expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  //   document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  // };

  // // Helper to remove cookie
  // const removeCookie = (name: string) => {
  //   document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  // };

  // const login = (
  //   role: UserRole,
  //   name?: string,
  //   hospitalgroupid?: string,
  //   hospitalid?: string,
  // ) => {
  //   setIsLoading(true);

  //   // Map roles to stable Mock IDs from DataContext for testing
  //   let mockId = "admin-1";
  //   let mockName = name || "Admin User";

  //   if (role === "Doctor") {
  //     mockId = "d1"; // Maps to Dr. Smith
  //     mockName = "Dr. Smith";
  //   } else if (role === "Patient") {
  //     mockId = "p1"; // Maps to John Doe
  //     mockName = "John Doe";
  //   } else if (role === "Receptionist") {
  //     mockId = "r1";
  //     mockName = "Receptionist";
  //   } else if (role === "GroupAdmin") {
  //     mockId = "ga1";
  //     mockName = "Apollo Group Admin";
  //     // Default to first group if not specified
  //     if (!hospitalgroupid) hospitalgroupid = "g1";
  //   } else if (role === "HospitalAdmin") {
  //     mockId = "ha1";
  //     mockName = "Greams Admin";
  //     // Default to first hospital/group if not specified
  //     if (!hospitalgroupid) hospitalgroupid = "g1";
  //     if (!hospitalid) hospitalid = "h1";
  //   } else {
  //     // SuperAdmin
  //     mockId = "admin-1";
  //     mockName = name || `${role} User`;
  //   }

  //   // Simulate API delay
  //   const mockUser: User = {
  //     id: mockId,
  //     name: mockName,
  //     email: `${role.toLowerCase()}@medcore.com`,
  //     role: role,
  //     avatar: "",
  //     hospitalgroupid: hospitalgroupid || null,
  //     hospitalid: hospitalid || null,
  //   };

  //   localStorage.setItem("medcore_user", JSON.stringify(mockUser));
  //   setCookie("medcore_user", JSON.stringify(mockUser), 7); // Set cookie for 7 days
  //   setUser(mockUser);
  //   setIsLoading(false);

  //   // Redirect based on role
  //   router.push(getRoleBasePath(role));
  // };

  // const logout = () => {
  //   localStorage.removeItem("medcore_user");
  //   removeCookie("medcore_user");
  //   setUser(null);
  //   router.push("/");
  // };

  // Load user on page refresh
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get("/auth/me");
        setUser(res.data.user);
      } catch (error: any) {
        // addToast(error.message,"error")
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const res = await apiClient.post("/auth/login", {
        credential: email,
        password,
      });

      const user = res.data.user;

      setUser(user);

      router.push(getRoleBasePath(user.role));
    } catch (error: any) {
      addToast(error.message, "error");
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post("/auth/register", {
        ...data,
        hospital_group_id: 1,
      });
      console.log("Respi", res);
      const registeredUser = res.data.user;
      setUser(registeredUser);
      router.push(getRoleBasePath(registeredUser.role));
    } catch (error: any) {
      addToast(error.message, "error");
      console.log(error.message);

      // console.error("Registration Failed : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error: any) {
      addToast(error.message, "error");
      console.error(
        "Logout request failed, clearing local state anyway",
        error,
      );
    } finally {
      // Always clear user and redirect, even if the server throws an error
      setUser(null);
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        getRoleBasePath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
