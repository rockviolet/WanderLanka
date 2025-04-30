"use client";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
import { TourGuide } from "@/types/tour-guide";
import MainNavbar from "../(components)/MainNavbar";

const TourGuideProfile = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<TourGuide | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nicNumber: "",
    contactNumber: "",
    username: "",
    imageUrl: "",
    languages: [] as string[],
    serviceAreas: [] as string[],
  });
  const [languageInput, setLanguageInput] = useState("");
  const [serviceAreaInput, setServiceAreaInput] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);
    if (id) fetchProfile(id);
  }, []);

  const fetchProfile = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tour-guide/${id}`);
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfileData(data);
      setFormData({
        name: data.name,
        email: data.email,
        nicNumber: data.nicNumber,
        contactNumber: data.contactNumber,
        username: data.username,
        imageUrl: data.imageUrl || "",
        languages: data.languages || [],
        serviceAreas: data.serviceAreas || [],
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const addLanguage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && languageInput.trim()) {
      e.preventDefault();
      if (!formData.languages.includes(languageInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          languages: [...prev.languages, languageInput.trim()],
        }));
        setLanguageInput("");
      }
    }
  };

  const removeLanguage = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== language),
    }));
  };

  const addServiceArea = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && serviceAreaInput.trim()) {
      e.preventDefault();
      if (!formData.serviceAreas.includes(serviceAreaInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          serviceAreas: [...prev.serviceAreas, serviceAreaInput.trim()],
        }));
        setServiceAreaInput("");
      }
    }
  };

  const removeServiceArea = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((a) => a !== area),
    }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tour-guide/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedData = await response.json();
      setProfileData(updatedData);
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tour-guide/${userId}`, {
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
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/bg.png')" }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <MainNavbar />
        <div className="max-w-3xl mx-auto mt-12 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-start mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Tour Guide Profile
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
                  <Label htmlFor="nicNumber">NIC Number</Label>
                  <Input
                    id="nicNumber"
                    name="nicNumber"
                    value={formData.nicNumber}
                    onChange={handleChange}
                    disabled
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
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Languages</Label>
                  <Input
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    onKeyDown={addLanguage}
                    placeholder="Add a language and press Enter"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.languages.map((language) => (
                      <Badge key={language} className="flex items-center gap-1">
                        {language}
                        <button
                          type="button"
                          onClick={() => removeLanguage(language)}
                          className="text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Service Areas</Label>
                  <Input
                    value={serviceAreaInput}
                    onChange={(e) => setServiceAreaInput(e.target.value)}
                    onKeyDown={addServiceArea}
                    placeholder="Add a service area and press Enter"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.serviceAreas.map((area) => (
                      <Badge key={area} className="flex items-center gap-1">
                        {area}
                        <button
                          type="button"
                          onClick={() => removeServiceArea(area)}
                          className="text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Profile Image</Label>
                  <div className="flex items-center gap-4 mt-2">
                    {formData.imageUrl ? (
                      <img
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
                        disabled={loading}
                      >
                        {loading ? "Uploading..." : "Upload Image"}
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
                    <img
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
                    <Label className="text-gray-500">Email</Label>
                    <p className="text-lg">{profileData?.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">NIC Number</Label>
                    <p className="text-lg">{profileData?.nicNumber}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Contact Number</Label>
                    <p className="text-lg">{profileData?.contactNumber}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Member Since</Label>
                    <p className="text-lg">
                      {new Date(profileData!.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-500">Languages</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profileData?.languages?.length ? (
                      profileData.languages.map((lang) => (
                        <Badge key={lang} variant="outline">
                          {lang}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">No languages specified</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-gray-500">Service Areas</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profileData?.serviceAreas?.length ? (
                      profileData.serviceAreas.map((area) => (
                        <Badge key={area} variant="outline">
                          {area}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        No service areas specified
                      </p>
                    )}
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
          </div>
        </div>
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

export default TourGuideProfile;
