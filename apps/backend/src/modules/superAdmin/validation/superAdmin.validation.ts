import { z } from "zod";

export const createPlanSchema = z.object({
  name: z.string().min(2, "Plan name is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  maxShipments: z.number().int().positive("Max shipments must be positive"),
  maxAgents: z.number().int().positive("Max agents must be positive"),
});

export const updatePlanSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  maxShipments: z.number().int().positive().optional(),
  maxAgents: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

export const assignPlanSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspace ID"),
  planId: z.string().uuid("Invalid plan ID"),
  endDate: z.string().datetime().optional(),
});

export const updateTenantStatusSchema = z.object({
  isActive: z.boolean(),
});

export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
export type AssignPlanInput = z.infer<typeof assignPlanSchema>;
export type UpdateTenantStatusInput = z.infer<typeof updateTenantStatusSchema>;
