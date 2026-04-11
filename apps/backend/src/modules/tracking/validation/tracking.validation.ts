import { z } from "zod";

export const trackingParamsSchema = z.object({
  trackingNumber: z
    .string()
    .min(1, "Tracking number is required")
    .regex(/^TRK-/, "Invalid tracking number format"),
});

export type TrackingParamsInput = z.infer<typeof trackingParamsSchema>;
