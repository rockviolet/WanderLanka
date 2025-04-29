import { Destination } from "@/schemas/destination";

export const fetchDestinations = async (): Promise<Destination[]> => {
  const res = await fetch("/api/destination");
  if (!res.ok) throw new Error("Failed to fetch destinations");
  return res.json();
};

export const createDestination = async (
  data: Destination
): Promise<Destination> => {
  const res = await fetch("/api/destination", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create destination");
  return res.json();
};

export const updateDestination = async (
  id: string,
  data: Partial<Destination>
): Promise<Destination> => {
  const res = await fetch(`/api/destination/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update destination");
  return res.json();
};

export const deleteDestination = async (id: string): Promise<void> => {
  const res = await fetch(`/api/destination/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete destination");
};
