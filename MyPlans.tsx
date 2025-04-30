"use client";
import { useEffect, useState } from "react";
import MainNavbar from "./MainNavbar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SRI_LANKAN_DESTINATIONS, TRAVEL_TYPES } from "@/lib/constants";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TourPlan } from "@prisma/client";
import { TourPlanDetailsModal } from "./client/TourPlanDetailsModal";

const MyPlansPage = () => {
  const [plans, setPlans] = useState<TourPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<TourPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<TourPlan | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    location: "all",
    travelType: "all",
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
  });

  useEffect(() => {
    const id = localStorage.getItem("userId");

    if (id) fetchPlans(id);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, plans]);

  const fetchPlans = async (userId: string) => {
    try {
      setLoading(true);
      const req = await fetch("/api/tour-plan");
      const response = (await req.json()) as TourPlan[];

      setPlans(response.filter((tour) => tour.clientId === userId));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...plans];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (plan) =>
          plan.startLocation.toLowerCase().includes(searchTerm) ||
          plan.endLocation.toLowerCase().includes(searchTerm) ||
          plan.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Location filter
    if (filters.location && filters.location !== "all") {
      result = result.filter(
        (plan) =>
          plan.startLocation === filters.location ||
          plan.endLocation === filters.location
      );
    }

    // Travel type filter
    if (filters.travelType && filters.travelType !== "all") {
      result = result.filter((plan) => plan.travelType === filters.travelType);
    }

    // Date range filter
    if (filters.dateRange.from) {
      result = result.filter(
        (plan) => new Date(plan.startDate) >= filters.dateRange.from!
      );
    }
    if (filters.dateRange.to) {
      result = result.filter(
        (plan) => new Date(plan.endDate) <= filters.dateRange.to!
      );
    }

    setFilteredPlans(result);
  };

  const handleFilterChange = (key: keyof typeof filters, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTravelTypeColor = (type: string) => {
    switch (type) {
      case "family":
        return "bg-blue-100 text-blue-800";
      case "couple":
        return "bg-pink-100 text-pink-800";
      case "friends":
        return "bg-green-100 text-green-800";
      case "solo":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="relative z-10">
        {/* Header/Navigation */}
        {/* <MainNavbar /> */}

        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              My Travel Plans
            </h1>
            <p className="text-gray-100">
              Manage and explore your upcoming adventures
            </p>
          </motion.div>

          {/* Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#1e293b]/70 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Search
                </label>
                <Input
                  placeholder="Search plans..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="bg-[#0f172a]/70 border-gray-700 placeholder-gray-500 text-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location
                </label>
                <Select
                  value={filters.location}
                  onValueChange={(value: string) =>
                    handleFilterChange("location", value)
                  }
                >
                  <SelectTrigger className="bg-[#0f172a]/70 border-gray-700 text-gray-300">
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-gray-700 text-gray-300">
                    <SelectItem value="all">All locations</SelectItem>
                    {SRI_LANKAN_DESTINATIONS.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Travel Type
                </label>
                <Select
                  value={filters.travelType}
                  onValueChange={(value: string) =>
                    handleFilterChange("travelType", value)
                  }
                >
                  <SelectTrigger className="bg-[#0f172a]/70 border-gray-700 text-gray-300">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-gray-700 text-gray-300">
                    <SelectItem value="all">All types</SelectItem>
                    {TRAVEL_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-[#0f172a]/70 border-gray-700 text-gray-300 hover:bg-[#1e293b]/70"
                      >
                        {filters.dateRange.from
                          ? formatDate(filters.dateRange.from.toString())
                          : "From"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#1e293b] border-gray-700">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.from}
                        onSelect={(date) =>
                          handleFilterChange("dateRange", {
                            ...filters.dateRange,
                            from: date,
                          })
                        }
                        initialFocus
                        className="bg-[#1e293b] text-gray-300"
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-[#0f172a]/70 border-gray-700 text-gray-300 hover:bg-[#1e293b]/70"
                      >
                        {filters.dateRange.to
                          ? formatDate(filters.dateRange.to.toString())
                          : "To"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#1e293b] border-gray-700">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.to}
                        onSelect={(date) =>
                          handleFilterChange("dateRange", {
                            ...filters.dateRange,
                            to: date,
                          })
                        }
                        initialFocus
                        className="bg-[#1e293b] text-gray-300"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Plans List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredPlans.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-md p-8 text-center"
            >
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No plans found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or create a new plan
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 bg-[#1e293b]/70 backdrop-blur-sm border-gray-700/50 text-gray-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">
                            {plan.startLocation} → {plan.endLocation}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {formatDate(plan.startDate)} -{" "}
                            {formatDate(plan.endDate)}
                          </CardDescription>
                        </div>
                        <Badge className={getTravelTypeColor(plan.travelType)}>
                          {plan.travelType.charAt(0).toUpperCase() +
                            plan.travelType.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <span className="font-medium mr-2 text-gray-400">
                            Vehicle:
                          </span>
                          <span className="text-gray-300">{plan.vehicle}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="font-medium mr-2 text-gray-400">
                            Members:
                          </span>
                          <span className="text-gray-300">
                            {plan.numOfMembers}
                          </span>
                        </div>
                        {plan.description && (
                          <div className="text-sm">
                            <p className="font-medium mb-1 text-gray-400">
                              Notes:
                            </p>
                            <div className="max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-1 text-gray-300">
                              <p className="text-gray-300">
                                {plan.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <div className="p-4 border-t">
                      <Button
                        variant="outline"
                        className="w-full bg-[#0f172a]/50 border-gray-700 text-gray-300 hover:bg-[#0f172a]/80 hover:text-white"
                        onClick={() => {
                          setSelectedPlan(plan);
                          setModalOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <TourPlanDetailsModal
        plan={selectedPlan}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onPlanUpdated={(updatedPlan) => {
          setPlans(
            plans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
          );
        }}
        onPlanDeleted={(deletedPlanId) => {
          setPlans(plans.filter((p) => p.id !== deletedPlanId));
        }}
      />
    </div>
  );
};

export default MyPlansPage;
