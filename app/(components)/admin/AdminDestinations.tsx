"use client";
import { useEffect, useState } from "react";
import { DestinationForm } from "./DestinationForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  fetchDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
} from "@/services/destination-service";
import { Destination } from "@/schemas/destination";

const AdminDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [editingDestination, setEditingDestination] =
    useState<Destination | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await fetchDestinations();
        setDestinations(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load destinations.");
      }
    };
    loadDestinations();
  }, []);

  const handleCreateOrUpdate = async (data: Destination) => {
    try {
      if (editingDestination) {
        const updatedDestination = await updateDestination(
          editingDestination.id!,
          data
        );
        setDestinations((prev) =>
          prev.map((dest) =>
            dest.id === editingDestination.id ? updatedDestination : dest
          )
        );
        setEditingDestination(null);
      } else {
        const newDestination = await createDestination(data);
        setDestinations((prev) => [...prev, newDestination]);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save destination.");
    }
  };

  const openEditDialog = (destination: Destination) => {
    setEditingDestination(destination);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingDestination(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Destinations</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>Add New Destination</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDestination ? "Edit Destination" : "Create Destination"}
              </DialogTitle>
            </DialogHeader>
            <DestinationForm
              initialData={editingDestination || undefined}
              onSubmit={handleCreateOrUpdate}
              onOpenChange={setIsDialogOpen}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* List of Destinations */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Destinations</h2>
        <ul className="space-y-4">
          {destinations.map((destination) => (
            <li
              key={destination.id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-md"
            >
              <div>
                <h3 className="font-bold">{destination.name}</h3>
                <p className="text-sm text-gray-600">{destination.location}</p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => openEditDialog(destination)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    try {
                      await deleteDestination(destination.id!);
                      setDestinations((prev) =>
                        prev.filter((dest) => dest.id !== destination.id)
                      );
                      toast.success("Destination deleted successfully!");
                    } catch (error) {
                      console.error(error);
                      toast.error("Failed to delete destination.");
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDestinations;
