"use client";

import { Menu, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useSidebar } from "@/components/layout/sidebar-provider";
import { UserNav } from "@/components/layout/user-nav";
import Snowfall from "react-snowfall";
import { useSnow } from "@/context/snow-context";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";

export function Header() {
  const { toggleSidebar } = useSidebar();
  const { showSnow, toggleSnow } = useSnow();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to white if not mounted yet (SSR)
  const snowColor =
    mounted && resolvedTheme === "light" ? "#3b82f6" : "#ffffff";

  return (
    <>
      {showSnow && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Snowfall
            snowflakeCount={200}
            color={snowColor}
            style={{
              position: "fixed",
              width: "100vw",
              height: "100vh",
            }}
          />
        </div>
      )}
      <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center justify-between border-b bg-background/80 backdrop-blur-md px-6 shadow-sm transition-all duration-300">
        <div className="flex items-center gap-4">
          {/* Mobile Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="flex md:hidden hover:bg-accent/50 hover:scale-105 transition-all duration-200"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* MedCore Logo - Now visible on Desktop too */}
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-extrabold text-2xl shadow-lg">
              M
            </div>
            {/* Text Block */}
            <div className="flex flex-col leading-tight">
              {/* Desktop */}
              <span className="font-bold text-2xl tracking-tight text-foreground hidden md:block">
                MediTrack
              </span>
              <span className="text-xs text-muted-foreground hidden md:block">
                {user?.role} Panel
              </span>

              {/* Mobile */}
              <span className="font-bold text-2xl tracking-tight text-foreground md:hidden">
                MediTrack
              </span>
              <span className="text-xs text-muted-foreground md:hidden">
                {user?.role} Panel
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 justify-end items-center gap-4">
          {/* Snow Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSnow}
            className="hidden md:flex transition-transform duration-200 hover:scale-105"
            title="Toggle Snow"
          >
            <Snowflake className={`h-[1.2rem] w-[1.2rem] ${showSnow ? "text-blue-400" : "text-muted-foreground"}`} />
          </Button>

          <div className="transition-transform duration-200 hover:scale-105">
            <ModeToggle />
          </div>
          <div className="transition-transform duration-200 hover:scale-105">
            <UserNav />
          </div>
        </div>
      </header>
    </>
  );
}
