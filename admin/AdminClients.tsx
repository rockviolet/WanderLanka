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

interface Client {
  id: string;
  name: string;
  email: string;
  username: string;
  contactNumber: string;
  gender: string;
  country: string;
  imageUrl?: string;
}

const AdminClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/client");
      if (!response.ok) throw new Error("Failed to fetch clients");
      const data = await response.json();
      setClients(data);
    } catch (error) {
      toast.error("Error fetching clients");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const response = await fetch(`/api/client/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete client");

      setClients(clients.filter((client) => client.id !== id));
      toast.success("Client deleted successfully");
    } catch (error) {
      toast.error("Error deleting client");
      console.error(error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Clients Report", 14, 22);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare data for the table
    const tableData = filteredClients.map((client) => [
      client.name,
      client.email,
      client.username,
      client.contactNumber,
      client.gender,
      client.country,
    ]);

    // Add table using autoTable
    autoTable(doc, {
      head: [["Name", "Email", "Username", "Contact", "Gender", "Country"]],
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
    doc.save("clients-report.pdf");
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.username.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl font-bold">Clients Management</h1>
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={generatePDF}>Generate PDF Report</Button>
        </div>
      </div>

      <Table>
        <TableCaption>A list of registered clients.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {client.imageUrl && (
                      <img
                        src={client.imageUrl}
                        alt={client.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    {client.name}
                  </div>
                </TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.username}</TableCell>
                <TableCell>{client.contactNumber}</TableCell>
                <TableCell>{client.gender}</TableCell>
                <TableCell>{client.country}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteClient(client.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No clients found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminClients;
