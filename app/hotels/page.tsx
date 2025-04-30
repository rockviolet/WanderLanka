import React from "react";
import MainNavbar from "../(components)/MainNavbar";

type Hotel = {
  id: string;
  name: string;
  location: string;
  price: string;
  rating: number;
  image: string;
  amenities: string[];
};

const hotels: Hotel[] = [
  {
    id: "1",
    name: "Tropical Paradise Resort",
    location: "Bentota",
    price: "$25,000/night",
    rating: 4.7,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9_MVfhXnXaZiovTtzFRvajQ6AMfqrqQ8Bdw&s",
    amenities: ["Beachfront", "Pool", "Spa", "Free WiFi"],
  },
  {
    id: "2",
    name: "Serenity Beach Hotel",
    location: "Mirissa",
    price: "$32,000/night",
    rating: 4.9,
    image:
      "https://www.bestoflanka.com/images/recommended-stays-sri-lanka/stay-on-the-beach-sri-lanka/01.jpg",
    amenities: ["Infinity Pool", "Restaurant", "Ocean View", "Bar"],
  },
  {
    id: "3",
    name: "KK Beach Resort",
    location: "Kalutara",
    price: "$28,500/night",
    rating: 4.5,
    image:
      "https://d3prz3jkfh1dmo.cloudfront.net/2021/02/facilities-kk-beach-3-1.jpg",
    amenities: ["Private Beach", "Ayurveda", "Fitness Center", "Kids Club"],
  },
  {
    id: "4",
    name: "Centara Ceysands",
    location: "Negombo",
    price: "$35,000/night",
    rating: 4.6,
    image:
      "https://media-cdn.tripadvisor.com/media/photo-s/06/1e/f7/57/centara-ceysands-resort.jpg",
    amenities: ["Water Sports", "Spa", "Beach Access", "Luxury Rooms"],
  },
  {
    id: "5",
    name: "Colombo Grand Hotel",
    location: "Colombo",
    price: "$40,000/night",
    rating: 4.8,
    image:
      "https://media-cdn.tripadvisor.com/media/photo-s/13/0b/a3/be/hotel-exterior.jpg",
    amenities: ["City Center", "Rooftop Pool", "Fine Dining", "Concierge"],
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

const HotelsPage = () => {
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

      <div className="relative z-10">
        <MainNavbar />

        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Featured Hotels in Sri Lanka
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <div key={hotel.id}>
                <div className="bg-white/30 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium border border-white/30">
                      {hotel.price}
                    </div>
                  </div>

                  <div className="p-5 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center">
                        {renderStars(hotel.rating)}
                        <span className="text-sm text-gray-700 ml-1">
                          {hotel.rating}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {hotel.location}
                    </p>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-800 mb-1">
                        Amenities:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities.map((amenity, i) => (
                          <span
                            key={i}
                            className="text-xs bg-white/50 backdrop-blur-sm text-gray-800 px-2 py-1 rounded border border-white/30"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;
