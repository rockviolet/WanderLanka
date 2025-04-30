"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  SRI_LANKAN_DESTINATIONS,
  VEHICLE_TYPES,
  TRAVEL_TYPES,
} from "@/lib/constants";
import { format } from "date-fns";
import { TourPlan } from "@/types/tour-plan";
import TourGudeSuggesion from "../TourGudeSuggesion";

interface TourPlanDetailsModalProps {
  plan: TourPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlanUpdated: (updatedPlan: TourPlan) => void;
  onPlanDeleted: (planId: string) => void;
}

export function TourPlanDetailsModal({
  plan,
  open,
  onOpenChange,
  onPlanUpdated,
  onPlanDeleted,
}: TourPlanDetailsModalProps) {
  const [formData, setFormData] = useState<Partial<TourPlan>>({});
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // New state for tour guide modal
  const [showTourGuideModal, setShowTourGuideModal] = useState(false);

  // State to control calendar visibility
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);

  // Refs to handle click outside of calendar
  const startDateInputRef = useRef<HTMLDivElement>(null);
  const endDateInputRef = useRef<HTMLDivElement>(null);

  // Initialize form data when plan changes
  useEffect(() => {
    if (plan) {
      setFormData({
        ...plan,
        startDate: plan.startDate,
        endDate: plan.endDate,
      });
    }
  }, [plan]);

  // Close calendars when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        startDateInputRef.current &&
        !startDateInputRef.current.contains(event.target as Node)
      ) {
        setShowStartDateCalendar(false);
      }

      if (
        endDateInputRef.current &&
        !endDateInputRef.current.contains(event.target as Node)
      ) {
        setShowEndDateCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (field: "startDate" | "endDate", date?: Date) => {
    if (!date) return;

    // Ensure end date is after start date
    if (
      field === "startDate" &&
      formData.endDate &&
      new Date(date) > new Date(formData.endDate)
    ) {
      toast.error("Start date must be before end date");
      return;
    }

    if (
      field === "endDate" &&
      formData.startDate &&
      new Date(date) < new Date(formData.startDate)
    ) {
      toast.error("End date must be after start date");
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: date.toISOString() }));

    // Close the calendar after selection
    if (field === "startDate") {
      setShowStartDateCalendar(false);
    } else {
      setShowEndDateCalendar(false);
    }
  };

  // Handler for showing tour guide modal
  const handleShowTourGuides = () => {
    setShowTourGuideModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!plan?.id) return;

      const response = await fetch(`/api/tour-plan/${plan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update plan");
      }

      const updatedPlan = await response.json();
      onPlanUpdated(updatedPlan);
      toast.success("Plan updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update plan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);

    try {
      if (!plan?.id) return;

      const response = await fetch(`/api/tour-plan/${plan.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete plan");
      }

      onPlanDeleted(plan.id);
      toast.success("Plan deleted successfully");
      setShowDeleteConfirm(false);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete plan");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!plan) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[1000px] h-[70vh] bg-white/30 backdrop-blur-lg border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-gray-800">Edit Tour Plan</DialogTitle>
            <DialogDescription className="text-gray-700">
              Make changes to your travel plan here.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 overflow-y-auto max-h-[calc(70vh-150px)]"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Start Location
                </label>
                <Select
                  value={formData.startLocation}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, startLocation: value }))
                  }
                >
                  <SelectTrigger className="bg-white/50 border-white/30 text-gray-800">
                    <SelectValue placeholder="Select start location" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/80 backdrop-blur-sm border-white/30">
                    {SRI_LANKAN_DESTINATIONS.map((location) => (
                      <SelectItem
                        key={location}
                        value={location}
                        className="hover:bg-white/60 focus:bg-white/60"
                      >
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  End Location
                </label>
                <Select
                  value={formData.endLocation}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, endLocation: value }))
                  }
                >
                  <SelectTrigger className="bg-white/50 border-white/30 text-gray-800">
                    <SelectValue placeholder="Select end location" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/80 backdrop-blur-sm border-white/30">
                    {SRI_LANKAN_DESTINATIONS.map((location) => (
                      <SelectItem
                        key={location}
                        value={location}
                        className="hover:bg-white/60 focus:bg-white/60"
                      >
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div ref={startDateInputRef}>
                  <label className="block text-sm font-medium mb-1 text-gray-800">
                    Start Date
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      readOnly
                      value={
                        formData.startDate
                          ? format(new Date(formData.startDate), "PPP")
                          : ""
                      }
                      onClick={() => setShowStartDateCalendar(true)}
                      className="w-full cursor-pointer bg-white/50 border-white/30 text-gray-800"
                    />
                    {showStartDateCalendar && (
                      <Calendar
                        mode="single"
                        selected={
                          formData.startDate
                            ? new Date(formData.startDate)
                            : undefined
                        }
                        onSelect={(date) => handleDateChange("startDate", date)}
                        className="absolute z-10 mt-1 bg-white/80 backdrop-blur-sm border border-white/30 rounded-md shadow-lg"
                      />
                    )}
                  </div>
                </div>

                <div ref={endDateInputRef}>
                  <label className="block text-sm font-medium mb-1 text-gray-800">
                    End Date
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      readOnly
                      value={
                        formData.endDate
                          ? format(new Date(formData.endDate), "PPP")
                          : ""
                      }
                      onClick={() => setShowEndDateCalendar(true)}
                      className="w-full cursor-pointer bg-white/50 border-white/30 text-gray-800"
                    />
                    {showEndDateCalendar && (
                      <Calendar
                        mode="single"
                        selected={
                          formData.endDate
                            ? new Date(formData.endDate)
                            : undefined
                        }
                        onSelect={(date) => handleDateChange("endDate", date)}
                        className="absolute z-10 mt-1 bg-white/80 backdrop-blur-sm border border-white/30 rounded-md shadow-lg"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Vehicle
                </label>
                <Select
                  value={formData.vehicle}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, vehicle: value }))
                  }
                >
                  <SelectTrigger className="bg-white/50 border-white/30 text-gray-800">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/80 backdrop-blur-sm border-white/30">
                    {VEHICLE_TYPES.map((vehicle) => (
                      <SelectItem
                        key={vehicle}
                        value={vehicle}
                        className="hover:bg-white/60 focus:bg-white/60"
                      >
                        {vehicle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Travel Type
                </label>
                <Select
                  value={formData.travelType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, travelType: value }))
                  }
                >
                  <SelectTrigger className="bg-white/50 border-white/30 text-gray-800">
                    <SelectValue placeholder="Select travel type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/80 backdrop-blur-sm border-white/30">
                    {TRAVEL_TYPES.map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="hover:bg-white/60 focus:bg-white/60"
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Number of Members
              </label>
              <Input
                type="number"
                name="numOfMembers"
                min="1"
                value={formData.numOfMembers || ""}
                onChange={handleInputChange}
                className="bg-white/50 border-white/30 text-gray-800"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Description
              </label>
              <Textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder="Add any additional details about your trip"
                className="bg-white/50 border-white/30 text-gray-800 h-40"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-5">
              <Button
                type="button"
                variant="destructive"
                onClick={handleShowTourGuides}
                disabled={loading}
                className="bg-green-500/90 hover:bg-green-600/90"
              >
                Tour Guides
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
                className="bg-red-500/90 hover:bg-red-600/90"
              >
                Delete Plan
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Tour Guide Suggestion Modal */}
      <Dialog open={showTourGuideModal} onOpenChange={setShowTourGuideModal}>
        <DialogContent className="sm:max-w-[900px] bg-white/30 backdrop-blur-lg border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-gray-800">
              Recommended Tour Guides
            </DialogTitle>
            <DialogDescription className="text-gray-700">
              Explore tour guides available for your selected locations.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <TourGudeSuggesion
              location={[
                formData.startLocation ?? "",
                formData.endLocation ?? "",
              ]}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowTourGuideModal(false)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-white/30 backdrop-blur-lg border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-gray-800">Are you sure?</DialogTitle>
            <DialogDescription className="text-gray-700">
              This action cannot be undone. This will permanently delete your
              tour plan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleteLoading}
              className="bg-white/50 border-white/30 text-gray-800 hover:bg-white/70"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-red-500/90 hover:bg-red-600/90"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
