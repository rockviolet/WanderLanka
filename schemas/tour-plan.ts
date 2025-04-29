import { z } from "zod";

export const tourPlanSchema = z.object({
  clientId: z.string().optional(),
  startLocation: z.string().min(1, "Start location is required"),
  endLocation: z.string().min(1, "End location is required"),
  startDate: z.string().datetime({ offset: true }),
  endDate: z.string().datetime({ offset: true }),
  vehicle: z.string().min(1, "Vehicle is required"),
  numOfMembers: z.number().int().positive("Must be at least 1 member"),
  travelType: z.enum([
    "family",
    "couple",
    "friends",
    "solo",
    "business",
    "other",
  ]),
  description: z.string().optional(),
});

export type TourPlanSchema = z.infer<typeof tourPlanSchema>;
