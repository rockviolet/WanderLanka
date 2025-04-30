import React from "react";

type Tour = {
  id: string;
  name: string;
  destinations: [string, string, string?]; // 2-3 destinations
  duration: string;
  price: string;
  rating: number;
  description: string;
  highlights: string[];
};

const recommendedTours: Tour[] = [
  {
    id: "1",
    name: "Cultural Triangle Explorer",
    destinations: ["Anuradhapura", "Polonnaruwa", "Sigiriya"],
    duration: "3 Days",
    price: "$450",
    rating: 4.8,
    description: "Discover ancient kingdoms and UNESCO heritage sites",
    highlights: ["Ancient ruins", "Historical monuments", "Local culture"],
  },
  {
    id: "2",
    name: "Tea Country Escape",
    destinations: ["Kandy", "Nuwara Eliya"],
    duration: "2 Days",
    price: "$3200",
    rating: 4.6,
    description: "Experience Sri Lanka's famous tea plantations",
    highlights: ["Tea factory tour", "Cool climate", "Scenic views"],
  },
  {
    id: "3",
    name: "Wildlife Adventure",
    destinations: ["Yala", "Udawalawe"],
    duration: "2 Days",
    price: "$380",
    rating: 4.7,
    description: "Safari experience in Sri Lanka's national parks",
    highlights: ["Leopard spotting", "Elephant herds", "Bird watching"],
  },
  {
    id: "4",
    name: "Southern Beaches",
    destinations: ["Galle", "Mirissa", "Unawatuna"],
    duration: "4 Days",
    price: "$52,000",
    rating: 4.5,
    description: "Relax on Sri Lanka's beautiful southern coast",
    highlights: ["Beach hopping", "Whale watching", "Historic Galle Fort"],
  },
  {
    id: "5",
    name: "Hill Country Trek",
    destinations: ["Ella", "Adam's Peak"],
    duration: "3 Days",
    price: "$35,000",
    rating: 4.4,
    description: "Hiking through scenic mountain landscapes",
    highlights: ["Sunrise hikes", "Nine Arch Bridge", "Waterfalls"],
  },
];

const renderStars = (rating: number) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? "text-yellow-500 fill-yellow-500"
              : "text-gray-300 fill-gray-300"
          }`}
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
};

const RecommendedTours = () => {
  return (
    <div className="bg-white/30 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        RECOMMENDED TOURS
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedTours.map((tour) => (
          <div key={tour.id}>
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/20 h-full flex flex-col">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {tour.name}
              </h4>

              <div className="flex items-center mb-3">
                {renderStars(tour.rating)}
                <span className="text-sm text-gray-700 ml-2">
                  {tour.rating}
                </span>
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium text-gray-800">
                  Destinations:
                </p>
                <p className="text-sm text-gray-700">
                  {tour.destinations.join(" → ")}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-800">Highlights:</p>
                <p className="text-sm text-gray-700">
                  {tour.highlights.join(", ")}
                </p>
              </div>

              <p className="text-sm text-gray-700 mb-4">{tour.description}</p>

              <div className="mt-auto flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-600">Duration</p>
                  <p className="font-medium text-gray-800">{tour.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">From</p>
                  <p className="font-bold text-gray-800">{tour.price}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedTours;
