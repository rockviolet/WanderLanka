"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";
import { clientSchema } from "@/schemas/client";
import { tourGuideSchema } from "@/schemas/tour-guide";
import { Badge } from "@/components/ui/badge";

// Client Form Component
const ClientRegisterForm = ({
  onSubmit,
  loading,
}: {
  onSubmit: (data: z.infer<typeof clientSchema>) => Promise<void>;
  loading: boolean;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    email: "",
    username: "",
    contactNumber: "",
    country: "",
    imageUrl: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    try {
      if (field === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) throw new Error("Invalid email address");
      } else if (field === "password") {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(value))
          throw new Error(
            "Password must be at least 8 characters with at least one letter and one number"
          );
      } else if (field === "confirmPassword") {
        if (value !== formData.password)
          throw new Error("Passwords don't match");
      } else if (field === "contactNumber") {
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(value)) throw new Error("Invalid phone number");
      } else if (value.trim() === "") {
        throw new Error("This field is required");
      }

      // If validation passes, remove error
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [field]: error instanceof Error ? error.message : "Invalid input",
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;

    // Validate all fields
    Object.entries(formData).forEach(([field, value]) => {
      if (field !== "imageUrl") {
        validateField(field, value);
        if (errors[field]) isValid = false;
      }
    });

    if (!isValid) return;

    await onSubmit({
      name: formData.name,
      gender: formData.gender,
      email: formData.email,
      username: formData.username,
      contactNumber: formData.contactNumber,
      country: formData.country,
      imageUrl: formData.imageUrl || undefined,
      password: formData.password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1 */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => validateField("name", formData.name)}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <Input
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              onBlur={() => validateField("gender", formData.gender)}
            />
            {errors.gender && (
              <p className="text-sm text-red-500">{errors.gender}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => validateField("email", formData.email)}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={() => validateField("username", formData.username)}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username}</p>
            )}
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              onBlur={() =>
                validateField("contactNumber", formData.contactNumber)
              }
            />
            {errors.contactNumber && (
              <p className="text-sm text-red-500">{errors.contactNumber}</p>
            )}
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              onBlur={() => validateField("country", formData.country)}
            />
            {errors.country && (
              <p className="text-sm text-red-500">{errors.country}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => validateField("password", formData.password)}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() =>
                validateField("confirmPassword", formData.confirmPassword)
              }
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Registering..." : "Register as Client"}
      </Button>
    </form>
  );
};

// Tour Guide Form Component
const TourGuideRegisterForm = ({
  onSubmit,
  loading,
}: {
  onSubmit: (data: z.infer<typeof tourGuideSchema>) => Promise<void>;
  loading: boolean;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nicNumber: "",
    contactNumber: "",
    username: "",
    password: "",
    confirmPassword: "",
    imageUrl: "",
    languages: [] as string[],
    serviceAreas: [] as string[],
  });

  const [languageInput, setLanguageInput] = useState("");
  const [serviceAreaInput, setServiceAreaInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    try {
      if (field === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) throw new Error("Invalid email address");
      } else if (field === "password") {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!passwordRegex.test(value))
          throw new Error(
            "Password must be at least 8 characters with at least one letter and one number"
          );
      } else if (field === "confirmPassword") {
        if (value !== formData.password)
          throw new Error("Passwords don't match");
      } else if (field === "contactNumber") {
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(value)) throw new Error("Invalid phone number");
      } else if (field === "nicNumber") {
        const nicRegex = /^(?:\d{12}|\d{11}[vV])$/;
        if (!nicRegex.test(value)) throw new Error("Invalid NIC number");
      } else if (value.trim() === "") {
        throw new Error("This field is required");
      }

      // If validation passes, remove error
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [field]: error instanceof Error ? error.message : "Invalid input",
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) validateField(name, value);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;

    // Validate all fields
    Object.entries(formData).forEach(([field, value]) => {
      if (
        field !== "imageUrl" &&
        field !== "languages" &&
        field !== "serviceAreas"
      ) {
        if (typeof value === "string") {
        validateField(field, value);
        if (errors[field]) isValid = false;
        }
      }
    });

    if (!isValid) return;

    await onSubmit({
      name: formData.name,
      email: formData.email,
      nicNumber: formData.nicNumber,
      contactNumber: formData.contactNumber,
      username: formData.username,
      password: formData.password,
      imageUrl: formData.imageUrl || undefined,
      languages: formData.languages,
      serviceAreas: formData.serviceAreas,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1 */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => validateField("name", formData.name)}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => validateField("email", formData.email)}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="nicNumber">NIC Number</Label>
            <Input
              id="nicNumber"
              name="nicNumber"
              value={formData.nicNumber}
              onChange={handleChange}
              onBlur={() => validateField("nicNumber", formData.nicNumber)}
              placeholder="2002076191v"
            />
            {errors.nicNumber && (
              <p className="text-sm text-red-500">{errors.nicNumber}</p>
            )}
          </div>

          <div>
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              onBlur={() =>
                validateField("contactNumber", formData.contactNumber)
              }
            />
            {errors.contactNumber && (
              <p className="text-sm text-red-500">{errors.contactNumber}</p>
            )}
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={() => validateField("username", formData.username)}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => validateField("password", formData.password)}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() =>
                validateField("confirmPassword", formData.confirmPassword)
              }
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
      </div>

      {/* Full width fields */}
      <div>
        <Label htmlFor="languages">Languages (Press Enter to add)</Label>
        <Input
          id="languages"
          value={languageInput}
          onChange={(e) => setLanguageInput(e.target.value)}
          onKeyDown={addLanguage}
          placeholder="Enter a language and press Enter"
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
        <Label htmlFor="serviceAreas">Service Areas (Press Enter to add)</Label>
        <Input
          id="serviceAreas"
          value={serviceAreaInput}
          onChange={(e) => setServiceAreaInput(e.target.value)}
          onKeyDown={addServiceArea}
          placeholder="Enter a service area and press Enter"
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

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Registering..." : "Register as Tour Guide"}
      </Button>
    </form>
  );
};

// Main Register Page Component
const RegisterPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("client");
  const [loading, setLoading] = useState(false);

  const handleClientRegister = async (data: z.infer<typeof clientSchema>) => {
    setLoading(true);
    try {
      const response = await fetch("/api/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      toast.success("Client registration successful!");
      router.push("/login");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGuideRegister = async (data: z.infer<typeof tourGuideSchema>) => {
    setLoading(true);
    try {
      const response = await fetch("/api/tour-guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      toast.success("Tour guide registration successful!");
      router.push("/login");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/assets/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <div className="w-full max-w-2xl relative z-10">
        <div className="p-6">
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-8 shadow-lg border border-white/30">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Create Your Account
            </h1>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="client">Client</TabsTrigger>
                <TabsTrigger value="guide">Tour Guide</TabsTrigger>
              </TabsList>

              <TabsContent value="client" className="mt-6">
                <ClientRegisterForm
                  onSubmit={handleClientRegister}
                  loading={loading}
                />
              </TabsContent>

              <TabsContent value="guide" className="mt-6">
                <TourGuideRegisterForm
                  onSubmit={handleGuideRegister}
                  loading={loading}
                />
              </TabsContent>
            </Tabs>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
