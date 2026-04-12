import { z } from "zod";

export const createHubSchema = z.object({
  name: z.string().min(2).max(255),
  address: z.string().min(5),
  city: z.string().min(2).max(100),
  state: z.string().optional(),
  country: z.string().min(2).max(100),
  phone: z.string().optional(),
});

export const updateHubSchema = createHubSchema.partial();

export const assignHubSchema = z.object({
  hubId: z.string().uuid(),
});

export type CreateHubInput = z.infer<typeof createHubSchema>;
export type UpdateHubInput = z.infer<typeof updateHubSchema>;
export type AssignHubInput = z.infer<typeof assignHubSchema>;
