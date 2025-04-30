"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

interface Review {
  id: string;
  review: string;
  numOfStars: number;
  createdAt: string;
  client: {
    name: string;
    email: string;
    imageUrl?: string;
  };
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
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
      toast.error("Error fetching reviews");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Reviews Report", 14, 22);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare data for the table
    const tableData = filteredReviews.map((review) => [
      review.client.name,
      review.client.email,
      review.review,
      review.numOfStars.toString(),
      new Date(review.createdAt).toLocaleDateString(),
    ]);

    // Add table using autoTable
    autoTable(doc, {
      head: [["Client Name", "Client Email", "Review", "Rating", "Date"]],
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
      columnStyles: {
        2: { cellWidth: "wrap" }, // Make review column width flexible
      },
    });

    // Save the PDF
    doc.save("reviews-report.pdf");
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reviews Management</h1>
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={generatePDF}>Generate PDF Report</Button>
        </div>
      </div>

      <Table>
        <TableCaption>A list of all reviews.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {review.client.imageUrl && (
                      <img
                        src={review.client.imageUrl}
                        alt={review.client.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    {review.client.name}
                  </div>
                </TableCell>
                <TableCell>{review.client.email}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {review.review}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < review.numOfStars
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="ml-1 text-sm text-gray-500">
                      ({review.numOfStars})
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(review.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No reviews found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminReviews;
