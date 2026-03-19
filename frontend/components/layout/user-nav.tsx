"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import { LogOut, User, Settings, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserNav() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const role = user?.role ? user.role.toLowerCase() : 'patient';

    if (!user) {
        return (
            <Button onClick={() => router.push("/auth/login")} variant="outline" size="sm">
                Log In
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full focus:ring-0">
                    <Avatar className="h-9 w-9 border transition-transform hover:scale-105 items-center justify-center bg-muted">
                        <User className="h-5 w-5 text-muted-foreground" />
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                        <span className="mt-1 w-fit rounded bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary uppercase">
                            {user.role}
                        </span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push(`/${role}/profile`)}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${role}/profile?tab=security`)}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Change Password</span>
                    </DropdownMenuItem>

                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
