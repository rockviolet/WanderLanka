"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";

interface DestinationFormData {
  name: string;
  description: string;
  imageUrl: string;
  location: string;
}

interface DestinationFormProps {
  initialData?: DestinationFormData & { id?: string };
  onSubmit: (data: DestinationFormData) => Promise<void>;
  onOpenChange?: (open: boolean) => void;
}

export const DestinationForm = ({
  initialData,
  onSubmit,
  onOpenChange,
}: DestinationFormProps) => {
  const [formData, setFormData] = useState<DestinationFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    location: initialData?.location || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof DestinationFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
  );

  const validateField = (name: keyof DestinationFormData, value: string) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.length < 2 || value.length > 100)
          return "Name must be between 2 and 100 characters";
        return "";

      case "description":
        if (!value.trim()) return "Description is required";
        if (value.length < 10 || value.length > 500)
          return "Description must be between 10 and 500 characters";
        return "";

      case "imageUrl":
        if (!value.trim()) return "Image is required";
        return "";

      case "location":
        if (!value.trim()) return "Location is required";
        if (value.length < 2 || value.length > 100)
          return "Location must be between 2 and 100 characters";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate the field immediately
    const error = validateField(name as keyof DestinationFormData, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Please upload a JPEG, PNG, GIF, or WebP."
      );
      return;
    }

    if (file.size > maxSize) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Update form data with uploaded image path
        setFormData((prev) => ({
          ...prev,
          imageUrl: result.path,
        }));

        // Set image preview
        setImagePreview(result.path);

        // Clear any previous image URL error
        setErrors((prev) => ({
          ...prev,
          imageUrl: "",
        }));

        toast.success("Image uploaded successfully!");
      } else {
        toast.error(result.error || "Image upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof DestinationFormData, string>> = {};

    (Object.keys(formData) as Array<keyof DestinationFormData>).forEach(
      (key) => {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    );

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate the entire form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      toast.success(
        initialData
          ? "Destination updated successfully!"
          : "Destination created successfully!"
      );

      // Reset form
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        location: "",
      });
      setImagePreview(null);
      setErrors({});

      // Close dialog if provided
      onOpenChange?.(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <Input
          id="name"
          name="name"
          placeholder="Enter destination name"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter destination description"
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="imageUpload"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Destination Image
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500 
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
          disabled={isLoading}
        />
        {errors.imageUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
        )}

        {imagePreview && (
          <div className="mt-4 relative w-full max-w-xs h-48">
            <Image
              src={imagePreview}
              alt="Destination Preview"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Location
        </label>
        <Input
          id="location"
          name="location"
          placeholder="Enter location"
          value={formData.location}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.location && (
          <p className="text-red-500 text-sm">{errors.location}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading
          ? "Saving..."
          : initialData
          ? "Update Destination"
          : "Create Destination"}
      </Button>
    </form>
  );
};
