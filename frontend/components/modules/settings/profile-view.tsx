"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, UserRole } from "@/context/auth-context";
import { RoleGuard } from "@/components/auth/role-guard";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { User, Lock, Mail, Phone, Shield, Camera } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";

interface ProfileViewProps {
    allowedRoles?: UserRole[];
}

export function ProfileView({ allowedRoles = ['SuperAdmin', 'GroupAdmin', 'HospitalAdmin', 'Doctor', 'Receptionist', 'Patient'] }: ProfileViewProps) {
    const { user } = useAuth();
    const { addToast } = useToast();
    const searchParams = useSearchParams();
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [activeTab, setActiveTab] = useState("general");

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    // Profile State
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: "987-654-3210", // Mock
        role: user?.role || "",
        profileImage: "", // Preview URL
    });

    // Password State
    const [passwordData, setPasswordData] = useState({
        current: "",
        new: "",
        confirm: ""
    });

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        addToast("Profile details updated successfully", "success");
        setIsEditing(false);
    };

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            addToast("New passwords do not match", "error");
            return;
        }
        if (passwordData.new.length < 6) {
            addToast("Password must be at least 6 characters", "error");
            return;
        }
        // Logic to update password would go here
        addToast("Password changed successfully", "success");
        setPasswordData({ current: "", new: "", confirm: "" });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <RoleGuard allowedRoles={allowedRoles}>
            <div className="min-h-screen bg-background p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Profile & Settings</h2>
                        <p className="text-muted-foreground">Manage your personal information and account security</p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                        <TabsTrigger value="general" className="flex items-center gap-2"><User className="h-4 w-4" /> General</TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center gap-2"><Lock className="h-4 w-4" /> Security</TabsTrigger>
                    </TabsList>

                    {/* General Tab */}
                    <TabsContent value="general" className="mt-6 space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Avatar Section */}
                            <Card className="flex-shrink-0 w-full md:w-[300px]">
                                <CardContent className="pt-6 flex flex-col items-center">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <div
                                        className={`relative group mb-4 ${isEditing ? 'cursor-pointer' : ''}`}
                                        onClick={triggerFileInput}
                                    >
                                        <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary border-4 border-background shadow-xl overflow-hidden">
                                            {formData.profileImage ? (
                                                <img src={formData.profileImage} alt="Profile" className="h-full w-full object-cover" />
                                            ) : (
                                                formData.name.charAt(0)
                                            )}
                                        </div>
                                        {isEditing && (
                                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="h-8 w-8 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold">{formData.name}</h3>
                                    <p className="text-sm text-muted-foreground capitalize flex items-center gap-1 mt-1">
                                        <Shield className="h-3 w-3" /> {formData.role}
                                    </p>
                                    <Button variant="outline" className="mt-6 w-full" onClick={() => setIsEditing(!isEditing)}>
                                        {isEditing ? "Cancel Editing" : "Edit Details"}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Details Form */}
                            <Card className="flex-1">
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>Update your photo and personal details.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleProfileSave} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" /> Full Name
                                                </label>
                                                <Input
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium flex items-center gap-2">
                                                    <Shield className="h-4 w-4 text-muted-foreground" /> Role
                                                </label>
                                                <Input
                                                    value={formData.role.toUpperCase()}
                                                    disabled={true}
                                                    className="bg-muted"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" /> Email Address
                                                </label>
                                                <Input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-muted-foreground" /> Phone Number
                                                </label>
                                                <Input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                        </div>

                                        {isEditing && (
                                            <div className="flex justify-start pt-4 border-t mt-4">
                                                <Button type="submit">Save Changes</Button>
                                            </div>
                                        )}
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>Update your password to keep your account secure.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Current Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                className="pl-9"
                                                value={passwordData.current}
                                                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                className="pl-9"
                                                value={passwordData.new}
                                                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Confirm New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                className="pl-9"
                                                value={passwordData.confirm}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <Button type="submit">Update Password</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </RoleGuard>
    );
}
