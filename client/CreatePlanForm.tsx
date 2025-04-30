"use client";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Wand2 } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  SRI_LANKAN_DESTINATIONS,
  VEHICLE_TYPES,
  TRAVEL_TYPES,
} from "@/lib/constants";

const CreatePlanForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    startLocation: "",
    endLocation: "",
    startDate: "",
    endDate: "",
    vehicle: "",
    numOfMembers: "",
    travelType: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  // Suggestions state
  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);

  // Date picker state
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);

  // Check if all required fields are filled (except description)
  const canGeneratePlan =
    formData.startLocation &&
    formData.endLocation &&
    formData.startDate &&
    formData.endDate &&
    formData.vehicle &&
    formData.numOfMembers &&
    formData.travelType;

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle location suggestions
  const handleStartLocationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, startLocation: value }));

    if (value.length > 1) {
      const matches = SRI_LANKAN_DESTINATIONS.filter((dest) =>
        dest.toLowerCase().includes(value.toLowerCase())
      );
      setStartSuggestions(matches);
      setShowStartSuggestions(true);
    } else {
      setShowStartSuggestions(false);
    }
  };

  const handleEndLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, endLocation: value }));

    if (value.length > 1) {
      const matches = SRI_LANKAN_DESTINATIONS.filter((dest) =>
        dest.toLowerCase().includes(value.toLowerCase())
      );
      setEndSuggestions(matches);
      setShowEndSuggestions(true);
    } else {
      setShowEndSuggestions(false);
    }
  };

  // Select suggestion
  const selectSuggestion = (
    field: "startLocation" | "endLocation",
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "startLocation") {
      setShowStartSuggestions(false);
    } else {
      setShowEndSuggestions(false);
    }
  };

  // Handle date selection
  const handleDateSelect = (field: "startDate" | "endDate", date?: Date) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [field]: date.toISOString() }));
    }
    if (field === "startDate") {
      setStartDatePickerOpen(false);
    } else {
      setEndDatePickerOpen(false);
    }
  };

  // Generate tour plan using AI
  const generatePlan = async () => {
    if (!canGeneratePlan) return;

    setGeneratingPlan(true);
    try {
      const response = await fetch("/api/plan-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          numOfMembers: parseInt(formData.numOfMembers),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }

      const data = await response.json();
      if (data.success && data.data?.summary) {
        setFormData((prev) => ({
          ...prev,
          description: `AI-Generated Plan:\n\n${
            data.data.summary
          }\n\nItinerary:\n${data.data.itinerary
            ?.map((day: any) => `Day ${day.day}: ${day.activities.join(", ")}`)
            .join("\n")}`,
        }));

        toast.success("Plan generated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate plan");
    } finally {
      setGeneratingPlan(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);

    // Basic validation
    if (!formData.startLocation || !formData.endLocation) {
      toast.error("Please enter both start and end locations");
      setLoading(false);
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Please select both start and end dates");
      setLoading(false);
      return;
    }

    if (!formData.vehicle) {
      toast.error("Please select a vehicle type");
      setLoading(false);
      return;
    }

    if (!formData.numOfMembers || parseInt(formData.numOfMembers) < 1) {
      toast.error("Please enter a valid number of members (at least 1)");
      setLoading(false);
      return;
    }

    if (!formData.travelType) {
      toast.error("Please select a travel type");
      setLoading(false);
      return;
    }

    // Submit the form data
    try {
      await fetch("/api/tour-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          numOfMembers: parseInt(formData.numOfMembers),
          clientId: localStorage.getItem("userId"),
        }),
      });

      toast.success("Tour plan created successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong, Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto bg-white/30 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-white/20">
        <h2 className="text-2xl text-gray-800 font-medium mb-6 text-center">
          FIND YOUR JOURNEY HERE
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Start Location with Suggestions */}
            <div className="relative">
              <label
                htmlFor="startLocation"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Start Destination
              </label>
              <input
                id="startLocation"
                name="startLocation"
                value={formData.startLocation}
                onChange={handleStartLocationChange}
                placeholder="e.g. Colombo"
                className="w-full py-3 px-4 rounded-md border border-white/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-600"
              />
              {showStartSuggestions && startSuggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white/80 backdrop-blur-sm border border-white/30 rounded-md shadow-lg max-h-60 overflow-auto">
                  {startSuggestions.map((dest) => (
                    <li
                      key={dest}
                      className="px-4 py-2 hover:bg-white/60 cursor-pointer text-gray-800"
                      onClick={() => selectSuggestion("startLocation", dest)}
                    >
                      {dest}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* End Location with Suggestions */}
            <div className="relative">
              <label
                htmlFor="endLocation"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                End Destination
              </label>
              <input
                id="endLocation"
                name="endLocation"
                value={formData.endLocation}
                onChange={handleEndLocationChange}
                placeholder="e.g. Kandy"
                className="w-full py-3 px-4 rounded-md border border-white/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-600"
              />
              {showEndSuggestions && endSuggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white/80 backdrop-blur-sm border border-white/30 rounded-md shadow-lg max-h-60 overflow-auto">
                  {endSuggestions.map((dest) => (
                    <li
                      key={dest}
                      className="px-4 py-2 hover:bg-white/60 cursor-pointer text-gray-800"
                      onClick={() => selectSuggestion("endLocation", dest)}
                    >
                      {dest}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Start Date
                </label>
                <Popover
                  open={startDatePickerOpen}
                  onOpenChange={setStartDatePickerOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal bg-white/50 border-white/30 hover:bg-white/70 text-gray-800"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? (
                        format(new Date(formData.startDate), "PPP")
                      ) : (
                        <span>Pick a start date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white/80 backdrop-blur-sm border-white/30">
                    <Calendar
                      mode="single"
                      selected={
                        formData.startDate
                          ? new Date(formData.startDate)
                          : undefined
                      }
                      onSelect={(date) => handleDateSelect("startDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  End Date
                </label>
                <Popover
                  open={endDatePickerOpen}
                  onOpenChange={setEndDatePickerOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal bg-white/50 border-white/30 hover:bg-white/70 text-gray-800"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? (
                        format(new Date(formData.endDate), "PPP")
                      ) : (
                        <span>Pick an end date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white/80 backdrop-blur-sm border-white/30">
                    <Calendar
                      mode="single"
                      selected={
                        formData.endDate
                          ? new Date(formData.endDate)
                          : undefined
                      }
                      onSelect={(date) => handleDateSelect("endDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex w-full gap-8">
              {/* Vehicle Type */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Vehicle Type
                </label>
                <Select
                  value={formData.vehicle}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, vehicle: value }))
                  }
                >
                  <SelectTrigger className="w-full bg-white/50 border-white/30 text-gray-800">
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/80 backdrop-blur-sm border-white/30">
                    {VEHICLE_TYPES.map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="hover:bg-white/60 focus:bg-white/60"
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Number of Members */}
              <div className="flex-1">
                <label
                  htmlFor="numOfMembers"
                  className="block text-sm font-medium text-gray-800 mb-1"
                >
                  Number of Members
                </label>
                <input
                  id="numOfMembers"
                  name="numOfMembers"
                  value={formData.numOfMembers}
                  onChange={handleInputChange}
                  type="number"
                  min="1"
                  className="w-full py-3 px-4 rounded-md border border-white/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800"
                />
              </div>

              {/* Trip Type */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Trip Type
                </label>
                <Select
                  value={formData.travelType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, travelType: value }))
                  }
                >
                  <SelectTrigger className="w-full bg-white/50 border-white/30 text-gray-800">
                    <SelectValue placeholder="Select a trip type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/80 backdrop-blur-sm border-white/30">
                    {TRAVEL_TYPES.map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="hover:bg-white/60 focus:bg-white/60"
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Optional: Add any extra details..."
                className="w-full py-3 px-4 rounded-md border border-white/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-600"
              />
            </div>

            {/* Generate Plan Button (shown when all required fields are filled) */}
            {canGeneratePlan && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  onClick={generatePlan}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-md flex items-center gap-2"
                  disabled={generatingPlan}
                >
                  <Wand2 className="h-4 w-4" />
                  {generatingPlan ? "Generating..." : "Generate Plan with AI"}
                </Button>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Plan"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreatePlanForm;
