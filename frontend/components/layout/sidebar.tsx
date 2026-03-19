"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/layout/sidebar-provider";
import { useAuth, UserRole } from "@/context/auth-context";
import { Tooltip } from "@/components/ui/tooltip";
import { SidebarTrigger } from "@/components/ui/sidebar-trigger";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  FileText,
  CreditCard,
  Stethoscope,
  Building2,
  Activity,
  BarChart3,
  UserCircle,
  Building,
  Shield,
  Tag,
  Network,
  NetworkIcon,
  StethoscopeIcon,
  Syringe,
  TestTube2,
  PillIcon,
  BriefcaseMedical,
  FlaskConical,
  ClipboardList,
  CalendarPlus,
  Receipt,
  UserPlus,
} from "lucide-react";

// Define Menu Items with Role Permissions
type MenuItem = {
  key: string; // Unique key for filtering
  path: string; // Relative path from role root
  icon: any;
  label: string;
  allowedRoles: UserRole[];
};

const ALL_ROLES: UserRole[] = [
  "SuperAdmin",
  "GroupAdmin",
  "HospitalAdmin",
  "Doctor",
  "Receptionist",
  "Patient",
];

const SIDEBAR_ITEMS: MenuItem[] = [
  // --- Common ---
  {
    key: "dashboard",
    path: "",
    icon: LayoutDashboard,
    label: "Dashboard",
    allowedRoles: ALL_ROLES,
  },

  // --- Super Admin Menu ---
  {
    key: "hospital-groups",
    path: "groups", // Maps to Hospital Groups Page
    icon: Building,
    label: "Hospital Groups",
    allowedRoles: ["SuperAdmin"],
  },
  {
    key: "group-admin-mgmt",
    path: "group-admins",
    icon: Shield,
    label: "Group Admins",
    allowedRoles: ["SuperAdmin"],
  },
  {
    key: "department-mgmt",
    path: "departments",
    icon: NetworkIcon,
    label: "Departments",
    allowedRoles: ["SuperAdmin", "HospitalAdmin"],
  },
  {
    key: "diagnosis-mgmt",
    path: "diagnosis",
    icon: StethoscopeIcon,
    label: "Diagnosis",
    allowedRoles: ["SuperAdmin", "HospitalAdmin"],
  },
  {
    key: "treatment-types-mgmt",
    path: "treatment-types",
    icon: BriefcaseMedical,
    label: "Treatment Types",
    allowedRoles: ["SuperAdmin", "HospitalAdmin"],
  },
  {
    key: "medical-tests-mgmt",
    path: "medical-tests",
    icon: FlaskConical,
    label: "Medical Tests",
    allowedRoles: ["SuperAdmin", "HospitalAdmin"],
  },
  {
    key: "medicines-mgmt",
    path: "medicines",
    icon: PillIcon,
    label: "Medicines",
    allowedRoles: ["SuperAdmin", "HospitalAdmin"],
  },
  // {
  //   key: "global-reports",
  //   path: "reports",
  //   icon: BarChart3,
  //   label: "Global Reports",
  //   allowedRoles: ["SuperAdmin"],
  // },

  // --- Group Admin Menu ---
  {
    key: "hospital-branches",
    path: "hospitals",
    icon: Building2,
    label: "Hospital Branches",
    allowedRoles: ["GroupAdmin"],
  },
  {
    key: "hospital-admin-mgmt",
    path: "hospital-admins",
    icon: Shield,
    label: "Hospital Admins",
    allowedRoles: ["GroupAdmin"],
  },
  {
    key: "group-reports",
    path: "group-reports",
    icon: BarChart3,
    label: "Group Reports",
    allowedRoles: ["GroupAdmin"],
  },

  // --- Hospital Admin Menu ---
  {
    key: "doctors",
    path: "doctors",
    icon: Stethoscope,
    label: "Doctors",
    allowedRoles: ["HospitalAdmin"],
  },
  {
    key: "receptionists",
    path: "receptionists",
    icon: ClipboardList,
    label: "Receptionists",
    allowedRoles: ["HospitalAdmin"],
  },

  // Patients: HospitalAdmin, Receptionist
  // {
  //   key: "patients-common",
  //   path: "patients",
  //   icon: Users,
  //   label: "Patients",
  //   allowedRoles: ["Receptionist"],
  // },
  {
  key: "patient-registration",
  path: "patient-register",
  icon: UserPlus,
  label: "Patient Registration",
  allowedRoles: ["Receptionist"],
},
{
  key: "opd-manage",
  path: "opd-create",
  icon: Stethoscope,
  label: "OPD Manage",
  allowedRoles: ["Receptionist"],
},
{
  key: "payment-history",
  path: "payments",
  icon: Receipt,
  label: "Payment History",
  allowedRoles: ["Receptionist"],
},
  // Appointments: HospitalAdmin, Doctor, Receptionist
  {
    key: "appointments-common",
    path: "appointments",
    icon: Calendar,
    label: "Appointments",
    allowedRoles: ["Doctor",],
  },
  // OPD: HospitalAdmin, Doctor
  {
    key: "opd-clinical",
    path: "opd",
    icon: Activity,
    label: "OPD",
    allowedRoles: ["Doctor"],
  },
  // Records: HospitalAdmin, Doctor
  {
    key: "records-clinical",
    path: "records",
    icon: FileText,
    label: "Medical Records",
    allowedRoles: ["Doctor"],
  },
  // Billing: HospitalAdmin, Receptionist
  {
    key: "billing-common",
    path: "billing",
    icon: CreditCard,
    label: "Billing",
    allowedRoles: ["Receptionist"],
  },
  // Reports: HospitalAdmin
  {
    key: "hospital-reports",
    path: "reports",
    icon: BarChart3,
    label: "Reports",
    allowedRoles: ["HospitalAdmin"],
  },

  // --- Patient Specific ---
  // REMOVED 'book-appointment' as requested
  {
    key: "appointment-booking",
    path: "appointment-booking",
    icon: CalendarPlus,
    label: "Book Appointment",
    allowedRoles: ["Patient"],
  },
  {
    key: "my-appointments",
    path: "appointments",
    icon: Calendar,
    label: "My Appointments",
    allowedRoles: ["Patient"],
  },
  {
    key: "my-receipts",
    path: "receipts",
    icon: CreditCard,
    label: "My Receipts",
    allowedRoles: ["Patient"],
  },

  // --- Profile (All) ---
  {
    key: "profile",
    path: "profile",
    icon: UserCircle,
    label: "Profile",
    allowedRoles: ALL_ROLES,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { user, getRoleBasePath } = useAuth();

  // Default to 'patient' or handle via auth redirect
  const role = user?.role || "Patient";
  const basePath = getRoleBasePath(role);

  const filteredItems = SIDEBAR_ITEMS.filter((item) => {
    // Basic Role Check
    if (!item.allowedRoles.includes(role)) return false;

    return true;
  });

  return (
    <>
      {!isCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-sidebar backdrop-blur-md transition-all duration-300 ease-in-out",
          isCollapsed ? "-translate-x-full" : "translate-x-0 w-64",
          "md:translate-x-0",
          isCollapsed ? "md:w-[70px]" : "md:w-64",
        )}
      >
        {/* Toggle Area */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center px-4 cursor-pointer hover:bg-accent/50 transition-colors duration-200 group",
            isCollapsed ? "justify-center" : "justify-start",
          )}
          onClick={toggleSidebar}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <div className="transition-transform duration-300 group-hover:scale-110">
            <SidebarTrigger isOpen={!isCollapsed} />
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto py-4 overflow-x-hidden">
          <nav className="flex-1 space-y-2 px-2">
            {filteredItems.map((item) => {
              // Construct Dynamic HREF using AuthContext helper
              const isRoot = item.path === "";
              const href = isRoot ? basePath : `${basePath}/${item.path}`;

              // Active State Logic:
              // 1. Basic match: Exact or StartsWith
              const isMatch =
                pathname === href ||
                (pathname?.startsWith(`${href}/`) && !isRoot);

              // 2. Specificity Check: Is there a LONGER matched item in the list?
              // If yes, then this item is a "false positive" parent/prefix match and should not be active.
              const hasMoreSpecificMatch = filteredItems.some((other) => {
                if (other.key === item.key) return false;
                const otherHref = isRoot
                  ? basePath
                  : `${basePath}/${other.path}`;
                const otherIsMatch =
                  pathname === otherHref ||
                  (pathname?.startsWith(`${otherHref}/`) && !isRoot);
                return otherIsMatch && otherHref.length > href.length;
              });

              const isActive = isMatch && !hasMoreSpecificMatch;

              const linkClasses = cn(
                "flex items-center gap-3 rounded-xl py-3 transition-all duration-300 group h-11 relative overflow-hidden font-medium",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-blue-500/25 translate-x-1"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:translate-x-1",
                isCollapsed
                  ? "md:justify-center md:px-0 md:w-11 md:mx-auto"
                  : "px-4 w-full",
              );

              const LinkContent = (
                <Link
                  href={href}
                  className={linkClasses}
                  onClick={(e) => {
                    if (window.innerWidth < 768) {
                      toggleSidebar();
                    } else if (isCollapsed) {
                      e.stopPropagation();
                    }
                  }}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-300",
                      isCollapsed && "md:scale-110 group-hover:scale-125",
                    )}
                  />
                  <span
                    className={cn(
                      "whitespace-nowrap transition-all duration-300 overflow-hidden",
                      isCollapsed
                        ? "md:w-0 md:opacity-0 md:hidden"
                        : "w-auto opacity-100 block",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );

              return (
                <div key={item.key}>
                  {isCollapsed ? (
                    <>
                      <div className="hidden md:block">
                        <Tooltip content={item.label} side="right">
                          {LinkContent}
                        </Tooltip>
                      </div>
                      <div className="md:hidden">{LinkContent}</div>
                    </>
                  ) : (
                    LinkContent
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="border-t p-2">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg p-2 transition-all duration-200 cursor-pointer hover:bg-accent/50 hover:shadow-sm hover:scale-[1.02]",
              isCollapsed && "md:justify-center",
            )}
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 transition-transform group-hover:scale-110 uppercase">
              {user?.role?.substring(0, 2) || "GU"}
            </div>
            <div
              className={cn(
                "text-sm overflow-hidden transition-all duration-300",
                isCollapsed
                  ? "md:w-0 md:opacity-0 md:hidden"
                  : "w-auto opacity-100",
              )}
            >
              <p className="font-medium truncate group-hover:text-primary transition-colors">
                {user?.name || "Guest"}
              </p>
              <p className="text-xs text-muted-foreground truncate capitalize">
                {user?.role || "Visitor"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
