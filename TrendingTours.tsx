import React from "react";

type Tour = {
  id: string;
  title: string;
  duration: string;
  price: string;
  rating: number;
  image: string;
  destinations: string[];
  highlights: string[];
};

const generateTours = (): Tour[] => [
  {
    id: "1",
    title: "Classic Cultural Triangle",
    duration: "5 Days",
    price: "$450",
    rating: 4.8,
    image:
      "https://acuvrfkwen.cloudimg.io/width/1500/q35.foil1/https://voyageinstyle.net/wp-content/uploads/2020/01/sigiriya-pond6-scaled.jpg",
    destinations: ["Sigiriya", "Dambulla", "Anuradhapura", "Polonnaruwa"],
    highlights: ["Ancient ruins", "UNESCO sites", "Cultural shows"],
  },
  {
    id: "2",
    title: "Tea Country Explorer",
    duration: "3 Days",
    price: "$320",
    rating: 4.7,
    image:
      "https://blog.bhlankatours.com/wp-content/uploads/2024/08/Sri-Lankas-Tea-Country-Discover-the-Heart-of-the-Island-1000x600.jpg",
    destinations: ["Nuwara Eliya", "Ella", "Haputale"],
    highlights: ["Tea factory tour", "Scenic train ride", "Waterfalls"],
  },
  {
    id: "3",
    title: "Wildlife Adventure",
    duration: "4 Days",
    price: "$580",
    rating: 4.9,
    image:
      "https://www.travelmapsrilanka.com/blogs/images/udawalawe-wildlife-adventure.jpg",
    destinations: ["Yala", "Udawalawe", "Tissamaharama"],
    highlights: ["Safari drives", "Leopard spotting", "Bird watching"],
  },
  {
    id: "4",
    title: "Beach Paradise",
    duration: "7 Days",
    price: "$720",
    rating: 4.6,
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/431440691.jpg?k=573ea34f5c9906278c9deee1fcd05023c5c70fd2ea1a9e80aef4ecdfc46412a4&o=&hp=1",
    destinations: ["Mirissa", "Unawatuna", "Tangalle", "Bentota"],
    highlights: ["Whale watching", "Surfing", "Sunset cruises"],
  },
  {
    id: "5",
    title: "Hill Country Trek",
    duration: "2 Days",
    price: "$210",
    rating: 4.5,
    image:
      "https://caliterraliving.com/wp-content/uploads/2016/05/Caliterra_5.3.16-01.jpeg",
    destinations: ["Horton Plains", "Adam's Peak"],
    highlights: ["World's End", "Sunrise hike", "Nature trails"],
  },
  {
    id: "6",
    title: "East Coast Discovery",
    duration: "5 Days",
    price: "$490",
    rating: 4.4,
    image:
      "https://images.docs.travel/operators/apt/headers/ms_caledonian_sky5.jpg",
    destinations: ["Trincomalee", "Nilaveli", "Pasikudah"],
    highlights: ["Dolphin watching", "Snorkeling", "Pristine beaches"],
  },
  {
    id: "7",
    title: "Spice & Heritage",
    duration: "4 Days",
    price: "$380",
    rating: 4.3,
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/37/98/5b/getlstd-property-photo.jpg?w=900&h=500&s=1",
    destinations: ["Kandy", "Matale", "Dambulla"],
    highlights: ["Temple of Tooth", "Spice gardens", "Cultural dance"],
  },
  {
    id: "8",
    title: "Northern Exploration",
    duration: "6 Days",
    price: "$550",
    rating: 4.2,
    image:
      "https://www.miningnewsnorth.com/IMG/QqMhyoGimQfmlkehkKqF7wqMtI72n/XPATH/home/cms_data/dfault/photos/stories/id/1/5/8915/s_topXEXT1547x34981is.jpg",
    destinations: ["Jaffna", "Anuradhapura", "Mannar"],
    highlights: ["Jaffna culture", "Ancient sites", "Local cuisine"],
  },
];

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        className={`w-4 h-4 ${
          i <= rating
            ? "text-yellow-500 fill-yellow-500"
            : "text-gray-300 fill-gray-300"
        }`}
        viewBox="0 0 24 24"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    );
  }
  return stars;
};

const TrendingTours = () => {
  const tours = generateTours();

  return (
    <div className="bg-white/30 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        TRENDING TOURS
      </h3>

      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-6 w-max px-2">
          {tours.map((tour) => (
            <div key={tour.id}>
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 h-full flex flex-col">
                <div className="relative h-40 rounded-lg overflow-hidden mb-4">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2">
                    <div className="bg-white/80 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium border border-white/30">
                      {tour.duration}
                    </div>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-gray-800 mb-1">
                  {tour.title}
                </h4>

                <div className="flex items-center mb-2">
                  {renderStars(tour.rating)}
                  <span className="text-sm text-gray-700 ml-1">
                    {tour.rating}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-800">
                    Destinations:
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-1">
                    {tour.destinations.join(", ")}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-800">
                    Highlights:
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {tour.highlights.join(", ")}
                  </p>
                </div>

                <div className="mt-auto flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">
                    {tour.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingTours;
