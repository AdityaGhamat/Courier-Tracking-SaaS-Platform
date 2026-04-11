import { z } from "zod";

export const createVehicleSchema = z.object({
  type: z.enum(["bike", "car", "van", "truck"]),
  licensePlate: z
    .string()
    .min(2, "License plate is required")
    .max(20, "License plate too long"),
  capacityKg: z.string().optional(),
});

export const updateVehicleSchema = z.object({
  type: z.enum(["bike", "car", "van", "truck"]).optional(),
  licensePlate: z.string().min(2).max(20).optional(),
  capacityKg: z.string().optional(),
  isAvailable: z.boolean().optional(),
});

export const assignAgentToVehicleSchema = z.object({
  agentId: z.string().uuid("Invalid agent ID"),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type AssignAgentToVehicleInput = z.infer<
  typeof assignAgentToVehicleSchema
>;
