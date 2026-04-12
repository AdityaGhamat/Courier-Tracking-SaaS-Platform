import { z } from "zod";

export const createPlanSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  type: z.enum(["basic", "pro", "enterprise"]),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal e.g. 49.99"),
  billingCycle: z.enum(["monthly", "yearly"]),
  maxShipments: z.number().int().positive(),
  maxAgents: z.number().int().positive(),
});

export const updatePlanSchema = createPlanSchema.partial();

export const assignPlanSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspace ID"),
  planId: z.string().uuid("Invalid plan ID"),
  endDate: z
    .string()
    .datetime(
      "Invalid date format — use ISO string e.g. 2027-04-12T00:00:00.000Z",
    ),
});

export const updateSubscriptionSchema = z.object({
  status: z.enum(["active", "inactive", "expired", "cancelled"]),
});

export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
export type AssignPlanInput = z.infer<typeof assignPlanSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
