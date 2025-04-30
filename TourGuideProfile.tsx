"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Review {
  id: string;
  numOfStars: number;
  comment: string;
  client: {
    name: string;
    imageUrl?: string;
  };
  createdAt: string;
}

interface TourGuide {
  id: string;
  name: string;
  contactNumber: string;
  imageUrl?: string;
  serviceAreas: string[];
  languages: string[];
  reviews: Review[];
}

const TourGuideProfile = ({ guide }: { guide: TourGuide }) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateAverageRating = () => {
    if (!guide.reviews.length) return 0;
    const sum = guide.reviews.reduce(
      (acc, review) => acc + review.numOfStars,
      0
    );
    return (sum / guide.reviews.length).toFixed(1);
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      toast.error("Please enter your review");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/tour-guide-reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tourGuideId: guide.id,
          numOfStars: rating,
          comment: reviewText,
          clientId: localStorage.getItem("userId"),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      toast.success("Review submitted successfully!");
      setReviewText("");
      setRating(5);
      window.location.reload();
      // You might want to refresh the reviews here
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="container mx-auto px-4 py-12">
          {/* Profile Header */}
          <div className="bg-white/30 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-white/20 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30">
                {guide.imageUrl ? (
                  <img
                    src={guide.imageUrl}
                    alt={guide.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-500">
                      {guide.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {guide.name}
                </h1>

                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 text-gray-800 font-medium">
                      {calculateAverageRating()} ({guide.reviews.length}{" "}
                      reviews)
                    </span>
                  </div>

                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="ml-1 text-gray-700">
                      {guide.contactNumber}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {guide.serviceAreas.map((area, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/50 backdrop-blur-sm text-gray-800 rounded-full text-sm border border-white/30"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Languages Section */}
          <div className="bg-white/30 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Languages
            </h2>
            <div className="flex flex-wrap gap-2">
              {guide.languages.map((language, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/50 backdrop-blur-sm text-gray-800 rounded-full text-sm border border-white/30"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white/30 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Reviews
            </h2>

            {/* Reviews List */}
            <div className="space-y-4">
              {guide.reviews.length > 0 ? (
                guide.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-white/30"
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        {review.client.imageUrl ? (
                          <img
                            src={review.client.imageUrl}
                            alt={review.client.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-sm font-bold text-gray-500">
                            {review.client.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {review.client.name}
                        </h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.numOfStars
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300 fill-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-700 text-center py-4">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>
            {/* Add Review Form */}
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-white/30 mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Add Your Review
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Rating
                </label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300 fill-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Your Review
                </label>
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this guide..."
                  className="bg-white/70 border-white/30 text-gray-800"
                  rows={4}
                />
              </div>

              <Button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuideProfile;
