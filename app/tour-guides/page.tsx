"use client";
import { useEffect, useState } from "react";
import MainNavbar from "../(components)/MainNavbar";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Languages, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export interface TourGuide {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  imageUrl: string | null;
  languages: string[];
  serviceAreas: string[];
  reviews: {
    rating: number;
  }[];
}

const TourGuidesPage = () => {
  const [guides, setGuides] = useState<TourGuide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/tour-guide");
        const data = await response.json();
        setGuides(data);
      } catch (error) {
        console.error("Failed to fetch tour guides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  const calculateAverageRating = (reviews: { rating: number }[]) => {
    if (!reviews?.length) return 0;
    const sum = reviews?.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews?.length).toFixed(1);
  };

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Meet Our Expert Guides
            </h1>
            <p className="text-xl text-gray-600">
              Discover Sri Lanka with our knowledgeable local guides
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <Skeleton className="h-48 w-full rounded-lg" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : guides.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-md p-8 text-center"
            >
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No guides available
              </h3>
              <p className="text-gray-500">Please check back later</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {guides.map((guide, index) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white/30 backdrop-blur-sm border border-white/20">
                    <div className="relative h-48">
                      {guide.imageUrl ? (
                        <img
                          src={guide.imageUrl}
                          alt={guide.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200/50 flex items-center justify-center">
                          <span className="text-gray-600 text-lg">
                            No Image
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2">
                        <Badge className="flex items-center gap-1 bg-white/80 backdrop-blur-sm text-gray-800 border border-white/30">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          {calculateAverageRating(guide.reviews)}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-xl text-gray-800">
                        {guide.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 text-gray-700">
                        <Phone className="h-4 w-4" />
                        {guide.contactNumber}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-grow space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-gray-700" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            Service Areas:
                          </p>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {guide.serviceAreas?.join(", ")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Languages className="h-4 w-4 mt-1 flex-shrink-0 text-gray-700" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            Languages:
                          </p>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {guide.languages?.join(", ")}
                          </p>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Link href={`/tour-guides/${guide.id}`}>
                        <Button
                          className="w-full bg-white/50 hover:bg-white/70 border-white/30 text-gray-800"
                          variant="outline"
                        >
                          View Profile
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourGuidesPage;
