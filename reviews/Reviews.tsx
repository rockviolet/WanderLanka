"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  review: string;
  numOfStars: number;
  clientId: string;
  client: {
    name: string;
    imageUrl?: string;
  };
  createdAt: string;
}

interface ReviewsProps {
  showActions: boolean;
}

const Reviews = ({ showActions }: ReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  // Loading states for different actions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingReview, setIsDeletingReview] = useState(false);

  useEffect(() => {
    // Get clientId from localStorage
    const storedClientId = localStorage.getItem("userId");
    if (storedClientId) {
      setClientId(storedClientId);
    }
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reviews");
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async () => {
    if (!clientId) return;

    // Validate review text
    if (!reviewText.trim()) {
      toast.error("Review cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          review: reviewText,
          numOfStars: rating,
          clientId,
        }),
      });

      if (!response.ok) throw new Error("Failed to add review");

      toast.success("Review added successfully");
      setIsAddDialogOpen(false);
      setReviewText("");
      setRating(5);
      fetchReviews();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateReview = async () => {
    if (!currentReview) return;

    // Validate review text
    if (!reviewText.trim()) {
      toast.error("Review cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/reviews/${currentReview.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          review: reviewText,
          numOfStars: rating,
        }),
      });

      if (!response.ok) throw new Error("Failed to update review");

      toast.success("Review updated successfully");
      setIsEditDialogOpen(false);
      fetchReviews();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!currentReview) return;

    try {
      setIsDeletingReview(true);
      const response = await fetch(`/api/reviews/${currentReview.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete review");

      toast.success("Review deleted successfully");
      setIsDeleteDialogOpen(false);
      fetchReviews();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete review");
    } finally {
      setIsDeletingReview(false);
    }
  };

  const openEditDialog = (review: Review) => {
    setCurrentReview(review);
    setReviewText(review.review);
    setRating(review.numOfStars);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (review: Review) => {
    setCurrentReview(review);
    setIsDeleteDialogOpen(true);
  };

  const renderStars = (
    count: number,
    editable: boolean = false,
    onStarClick?: (star: number) => void
  ) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-6 h-6 ${
            i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          } ${editable ? "cursor-pointer hover:scale-110 transition" : ""}`}
          onClick={() => editable && onStarClick && onStarClick(i + 1)}
        />
      ));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Reviews</h1>
        {clientId && (
          <Button onClick={() => setIsAddDialogOpen(true)}>Add Review</Button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4 mb-2">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[80px]" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No reviews yet. Be the first to review!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="hover:shadow-lg transition-shadow bg-white/30 backdrop-blur-sm border border-white/20"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3">
                    {review.client.imageUrl ? (
                      <img
                        src={review.client.imageUrl}
                        alt={review.client.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/30"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200/50 flex items-center justify-center border border-white/30">
                        <span className="text-sm text-gray-700">
                          {review.client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-800">
                        {review.client.name}
                      </p>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.numOfStars)}
                        <span className="text-xs text-gray-600 ml-1"></span>
                      </div>
                      <h6 className="text-xs text-gray-600 mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </h6>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2">{review.review}</p>
                {clientId === review.clientId && showActions && (
                  <div className="flex space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(review)}
                      className="bg-white/50 hover:bg-white/70 border-white/30 text-gray-800"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog(review)}
                      className="bg-red-500/90 hover:bg-red-600/90 text-white"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Review Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Your Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Rating</label>
              <div className="flex space-x-1">
                {renderStars(rating, true, setRating)}
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Review</label>
              <Input
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddReview} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Review Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Your Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Rating</label>
              <div className="flex space-x-1">
                {renderStars(rating, true, setRating)}
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Review</label>
              <Input
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Update your review..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateReview} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Review Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete this review? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteReview}
              disabled={isDeletingReview}
            >
              {isDeletingReview ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reviews;
