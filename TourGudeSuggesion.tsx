"use client";
import { TourGuide } from "@/types/tour-guide";
import React, { useEffect, useState } from "react";

interface TourGuideSuggestionProps {
  location: string[];
}

const TourGuideSuggestion = ({ location }: TourGuideSuggestionProps) => {
  const [guides, setGuides] = useState<TourGuide[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/tour-guide");
        if (!response.ok) {
          throw new Error("Failed to fetch tour guides");
        }
        const data = await response.json();
        setGuides(data);
      } catch (error) {
        console.error("Failed to fetch tour guides:", error);
        setError("Failed to load tour guides. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  // Filter guides based on matching service areas with locations
  const matchedGuides = guides.filter((guide) => {
    // Check if any of the guide's service areas match with any of the locations
    return guide.serviceAreas.some((area) =>
      location.some(
        (loc) =>
          (loc && loc.toLowerCase().includes(area.toLowerCase())) ||
          area.toLowerCase().includes(loc.toLowerCase())
      )
    );
  });

  if (loading) {
    return <div className="text-center py-4">Loading tour guides...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (matchedGuides.length === 0) {
    return (
      <div className="text-center py-4">
        No tour guides available for the selected locations.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matchedGuides.map((guide) => (
          <div
            key={guide.id}
            className="border rounded-lg overflow-hidden shadow-md"
          >
            <div className="aspect-w-16 aspect-h-9">
              {guide.imageUrl ? (
                <img
                  src={guide.imageUrl}
                  alt={guide.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{guide.name}</h3>
              <p className="text-sm text-gray-600">{guide.contactNumber}</p>
              <div className="mt-2">
                <p className="text-sm font-medium">Languages:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {guide.languages.map((language) => (
                    <span
                      key={language}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium">Service Areas:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {guide.serviceAreas.map((area) => (
                    <span
                      key={area}
                      className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourGuideSuggestion;
