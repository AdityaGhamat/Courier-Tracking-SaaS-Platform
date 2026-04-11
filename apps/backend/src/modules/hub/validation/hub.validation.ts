import { z } from "zod";

export const createHubSchema = z.object({
  name: z.string().min(2, "Hub name must be at least 2 characters"),
  address: z.string().min(5, "Address is required"),
});

export const updateHubSchema = z.object({
  name: z.string().min(2, "Hub name must be at least 2 characters").optional(),
  address: z.string().min(5, "Address is required").optional(),
});

export const assignShipmentToHubSchema = z.object({
  shipmentId: z.string().uuid("Invalid shipment ID"),
});

export type CreateHubInput = z.infer<typeof createHubSchema>;
export type UpdateHubInput = z.infer<typeof updateHubSchema>;
export type AssignShipmentToHubInput = z.infer<
  typeof assignShipmentToHubSchema
>;
