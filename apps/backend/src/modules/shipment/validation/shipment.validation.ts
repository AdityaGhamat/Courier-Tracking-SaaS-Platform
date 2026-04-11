import { z } from "zod";

export const createShipmentSchema = z.object({
  recipientName: z.string().min(2, "Recipient name is required"),
  recipientAddress: z.string().min(5, "Recipient address is required"),
  recipientPhone: z.string().optional(),
  recipientEmail: z.string().email("Invalid email").optional(),
  weight: z.string().optional(),
  estimatedDelivery: z.string().datetime().optional(),
  hubId: z.string().uuid("Invalid hub ID").optional(),
});

export const updateShipmentStatusSchema = z.object({
  status: z.enum([
    "label_created",
    "picked_up",
    "at_sorting_facility",
    "in_transit",
    "out_for_delivery",
    "delivered",
    "failed",
    "retry",
    "returned",
  ]),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
});

export const assignAgentSchema = z.object({
  agentId: z.string().uuid("Invalid agent ID"),
});

export const listShipmentsQuerySchema = z.object({
  page: z.string().optional().transform(Number).default(1),
  limit: z.string().optional().transform(Number).default(10),
  status: z
    .enum([
      "label_created",
      "picked_up",
      "at_sorting_facility",
      "in_transit",
      "out_for_delivery",
      "delivered",
      "failed",
      "retry",
      "returned",
    ])
    .optional(),
});

export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;
export type UpdateShipmentStatusInput = z.infer<
  typeof updateShipmentStatusSchema
>;
export type AssignAgentInput = z.infer<typeof assignAgentSchema>;
export type ListShipmentsQueryInput = z.infer<typeof listShipmentsQuerySchema>;
