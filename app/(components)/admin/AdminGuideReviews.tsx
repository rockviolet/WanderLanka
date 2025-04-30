"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

interface Review {
  id: string;
  tourGuideId: string;
  clientId: string;
  numOfStars: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
  };
  tourGuide: {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
  };
}

const AdminGuideReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch("/api/tour-guide-reviews");
        const response = await result.json();
        setReviews(response);
        setFilteredReviews(response);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredReviews(reviews);
    } else {
      const filtered = reviews.filter(
        (review) =>
          review.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.tourGuide.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReviews(filtered);
    }
  }, [searchTerm, reviews]);

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Tour Guide Reviews Report", 14, 22);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare data for the table
    const tableData = filteredReviews.map((review) => [
      review.client.name,
      review.tourGuide.name,
      review.numOfStars,
      review.comment,
      new Date(review.createdAt).toLocaleDateString(),
    ]);

    // Add table
    autoTable(doc, {
      head: [["Client", "Tour Guide", "Rating", "Comment", "Date"]],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save("tour-guide-reviews.pdf");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white/30 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Tour Guide Reviews
        </h1>

        {/* Search and Export */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search by client or tour guide name..."
              className="pl-10 bg-white/50 border-white/30 text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={generatePDF}
            className="bg-blue-600 hover:bg-blue-700 flex gap-2"
          >
            <Download className="h-4 w-4" />
            Export to PDF
          </Button>
        </div>

        {/* Reviews Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg">
            <thead className="bg-white/70">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Tour Guide
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/30">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-white/70">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {review.client.imageUrl ? (
                          <img
                            src={review.client.imageUrl}
                            alt={review.client.name}
                            className="h-8 w-8 rounded-full mr-2"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                            <span className="text-xs font-medium">
                              {review.client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {review.client.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {review.client.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {review.tourGuide.imageUrl ? (
                          <img
                            src={review.tourGuide.imageUrl}
                            alt={review.tourGuide.name}
                            className="h-8 w-8 rounded-full mr-2"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                            <span className="text-xs font-medium">
                              {review.tourGuide.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {review.tourGuide.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {review.tourGuide.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.numOfStars
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300 fill-gray-300"
                            }`}
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-xs text-gray-600">
                          ({review.numOfStars})
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 max-w-xs truncate">
                      {review.comment}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-gray-600"
                  >
                    No reviews found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminGuideReviews;
