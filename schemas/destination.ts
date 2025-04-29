import { z } from "zod";

export const destinationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string(),
  location: z.string().min(1, "Location is required"),
});

export type Destination = z.infer<typeof destinationSchema>;
export type DestinationFormData = z.infer<typeof destinationSchema>;
