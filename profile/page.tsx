"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { clientSchema } from "@/schemas/client";
import { z } from "zod";
import Reviews from "../(components)/reviews/Reviews";
import MyPlansPage from "../(components)/MyPlans";
import MainNavbar from "../(components)/MainNavbar";

const ClientProfilePage = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<z.infer<
    typeof clientSchema
  > | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    email: "",
    username: "",
    contactNumber: "",
    country: "",
    imageUrl: "",
    password: "", // For password updates
    confirmPassword: "", // For validation
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Phone number validation regex
  const phoneRegex = /^[0-9]{10,15}$/;

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);
    if (id) fetchProfile(id);
  }, []);

  const fetchProfile = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/client/${id}`);
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfileData(data);
      setFormData({
        name: data.name,
        gender: data.gender,
        email: data.email,
        username: data.username,
        contactNumber: data.contactNumber,
        country: data.country,
        imageUrl: data.imageUrl || "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingImage(true);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");

      setFormData((prev) => ({
        ...prev,
        imageUrl: result.path,
      }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdate = async () => {
    // Validate password if changed
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    // Validate phone number
    if (!phoneRegex.test(formData.contactNumber)) {
      toast.error("Invalid phone number format");
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        name: formData.name,
        gender: formData.gender,
        username: formData.username,
        contactNumber: formData.contactNumber,
        country: formData.country,
        imageUrl: formData.imageUrl,
        ...(formData.password ? { password: formData.password } : {}),
      };

      const response = await fetch(`/api/client/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedData = await response.json();
      setProfileData(updatedData);
      setEditMode(false);
      toast.success("Profile updated successfully");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/client/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete account");

      toast.success("Account deleted successfully");
      handleLogout();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Deletion failed");
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    router.push("/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading user data...</p>
      </div>
    );
  }

  if (loading && !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 relative">
      {/* Enhanced Background with Blur and Glass Effect */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Background Image with Stronger Blur */}
        <div
          className="w-full h-full bg-cover bg-center blur-sm scale-105"
          style={{
            backgroundImage: "url('/assets/bg.png')",
            filter: "blur(8px) brightness(0.8)",
          }}
        />

        {/* Glass Morphism Overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <MainNavbar />
        <div className="max-w-3xl mx-auto mt-12 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-start mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Client Profile
              </h1>
              {!editMode && (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setEditMode(true)}>
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowLogoutDialog(true)}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>

            {editMode ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, gender: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Profile Image</Label>
                  <div className="flex items-center gap-4 mt-2">
                    {formData.imageUrl ? (
                      <Image
                        src={formData.imageUrl}
                        alt="Current profile"
                        width={80}
                        height={80}
                        className="rounded-full w-20 h-20 object-cover border"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                      >
                        {uploadingImage ? "Uploading..." : "Upload Image"}
                      </Button>
                      {formData.imageUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          className="ml-2 text-red-500"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, imageUrl: "" }))
                          }
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">
                    New Password (leave blank to keep current)
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setEditMode(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdate} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  {profileData?.imageUrl ? (
                    <Image
                      src={profileData.imageUrl}
                      alt="Profile"
                      width={150}
                      height={150}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                      {profileData?.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {profileData?.name}
                    </h2>
                    <p className="text-gray-600">@{profileData?.username}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  <div>
                    <Label className="text-gray-500">Gender</Label>
                    <p className="text-lg capitalize">{profileData?.gender}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Email</Label>
                    <p className="text-lg">{profileData?.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Contact Number</Label>
                    <p className="text-lg">{profileData?.contactNumber}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Country</Label>
                    <p className="text-lg">{profileData?.country}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Member Since</Label>
                    <p className="text-lg">
                      {new Date(profileData!.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            )}
          </div>{" "}
        </div>
      </div>
      <div>
        <Reviews showActions={true} />
      </div>
      <div className="w-full bg-red-600 h-[50vh]">
        <MyPlansPage />
      </div>
      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout of your account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientProfilePage;
