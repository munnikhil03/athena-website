import { z } from "zod";

export const behavioralFlagEnum = z.enum([
  "DO_NOT_CHASE",
  "SKITTISH",
  "INJURED",
  "MAY_BITE",
  "FOOD_MOTIVATED",
]);

const latLng = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const lostReportSchema = z.object({
  petName: z.string().min(1, "Your pet's name is required"),
  species: z.string().min(1, "Species is required (dog, cat, etc.)"),
  breed: z.string().optional(),
  sex: z.string().optional(),
  color: z.string().min(1, "Color and markings help searchers identify your pet"),
  collarDescription: z.string().optional(),
  behavioralFlags: z.array(behavioralFlagEnum).default([]),
  missingAt: z.string().min(1, "When did they go missing?"),
  location: latLng,
  locationLabel: z.string().optional(),
  description: z.string().optional(),
  contactPreference: z.string().min(1, "How should people reach you?"),
  specialInstructions: z.string().optional(),
  photoUrls: z.array(z.string()).default([]),
});
export type LostReportInput = z.infer<typeof lostReportSchema>;

export const seenReportSchema = z.object({
  location: latLng,
  seenAt: z.string().min(1, "When did you see them?"),
  directionOfTravel: z.string().optional(),
  description: z.string().min(1, "A quick description helps other searchers"),
  condition: z.string().optional(),
  contactPreference: z.string().optional(),
  photoUrls: z.array(z.string()).default([]),
});
export type SeenReportInput = z.infer<typeof seenReportSchema>;

export const foundReportSchema = z.object({
  location: latLng,
  foundAt: z.string().min(1, "When did you find them?"),
  description: z.string().min(1, "A description is required"),
  condition: z.string().optional(),
  contained: z.boolean().default(false),
  takenTo: z.string().optional(),
  contactPreference: z.string().min(1, "How should the owner reach you?"),
  photoUrls: z.array(z.string()).default([]),
});
export type FoundReportInput = z.infer<typeof foundReportSchema>;
