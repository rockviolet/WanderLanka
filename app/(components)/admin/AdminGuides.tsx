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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

interface TourGuide {
  id: string;
  name: string;
  email: string;
  username: string;
  contactNumber: string;
  isActive: boolean;
  imageUrl?: string;
  languages: string[];
  serviceAreas: string[];
  nicNumber: string;
}

const AdminGuides = () => {
  const [guides, setGuides] = useState<TourGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuide, setSelectedGuide] = useState<TourGuide | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tour-guide");
      if (!response.ok) throw new Error("Failed to fetch guides");
      const data = await response.json();
      setGuides(data);
    } catch (error) {
      toast.error("Error fetching guides");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateActiveStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/tour-guide/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setGuides(
        guides.map((guide) =>
          guide.id === id ? { ...guide, isActive } : guide
        )
      );

      // Update the selected guide if it's the same as the one being updated
      if (selectedGuide && selectedGuide.id === id) {
        setSelectedGuide({ ...selectedGuide, isActive });
      }

      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Error updating status");
      console.error(error);
    }
  };

  const openGuideDetails = (guide: TourGuide) => {
    setSelectedGuide(guide);
    setIsDialogOpen(true);
  };

  const filteredGuides = guides.filter(
    (guide) =>
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGuides = filteredGuides.slice(indexOfFirstItem, indexOfLastItem);

  const pageCount = Math.ceil(filteredGuides.length / itemsPerPage);

  const generatePDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Tour Guides Report", 14, 22);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare data for the table
    const tableData = filteredGuides.map((guide) => [
      guide.name,
      guide.email,
      guide.username,
      guide.contactNumber,
      guide.nicNumber,
      guide.languages.join(", "),
      guide.serviceAreas.join(", "),
      guide.isActive ? "Active" : "Inactive",
    ]);

    // Add table using autoTable
    autoTable(doc, {
      head: [
        [
          "Name",
          "Email",
          "Username",
          "Contact",
          "NIC",
          "Languages",
          "Service Areas",
          "Status",
        ],
      ],
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

    // Save the PDF
    doc.save("tour-guides-report.pdf");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tour Guides Management</h1>
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Input
              placeholder="Search guides..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
          <Button onClick={generatePDF}>Make a report</Button>
        </div>
      </div>

      <Table>
        <TableCaption>A list of registered tour guides.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>NIC</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentGuides.length > 0 ? (
            currentGuides.map((guide) => (
              <TableRow key={guide.id}>
                <TableCell className="font-medium max-w-[200px]">
                  <div className="flex items-center gap-2 w-[200px]">
                    {guide.imageUrl && (
                      <img
                        src={guide.imageUrl}
                        alt={guide.name}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                    )}
                    <div className="flex-grow overflow-hidden">
                      <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                        {guide.name}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{guide.email}</TableCell>
                <TableCell>{guide.contactNumber}</TableCell>
                <TableCell>{guide.nicNumber}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openGuideDetails(guide)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No tour guides found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {pageCount}
        </span>
        <Button
          variant="outline"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, pageCount))
          }
          disabled={currentPage === pageCount}
        >
          Next
        </Button>
      </div>

      {/* Guide Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tour Guide Details</DialogTitle>
            <DialogDescription>
              Detailed information about the tour guide
            </DialogDescription>
          </DialogHeader>
          {selectedGuide && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                {selectedGuide.imageUrl ? (
                  <img
                    src={selectedGuide.imageUrl}
                    alt={selectedGuide.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-full">
                    <ImageIcon className="w-12 h-12 text-gray-500" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold">{selectedGuide.name}</h2>
                  <p className="text-sm text-gray-500">{selectedGuide.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Username</p>
                  <p>{selectedGuide.username}</p>
                </div>
                <div>
                  <p className="font-medium">Contact Number</p>
                  <p>{selectedGuide.contactNumber}</p>
                </div>
                <div>
                  <p className="font-medium">NIC Number</p>
                  <p>{selectedGuide.nicNumber}</p>
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <Select
                    value={selectedGuide.isActive ? "active" : "inactive"}
                    onValueChange={(value) =>
                      updateActiveStatus(selectedGuide.id, value === "active")
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <p className="font-medium">Languages</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedGuide.languages?.map((lang) => (
                    <Badge key={lang} variant="outline">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium">Service Areas</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedGuide.serviceAreas?.map((area) => (
                    <Badge key={area} variant="outline">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGuides;
