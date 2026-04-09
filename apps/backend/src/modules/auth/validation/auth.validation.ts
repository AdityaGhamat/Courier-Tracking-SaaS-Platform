import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

export const registerTenantAdminSchema = z.object({
  tenantName: z.string().min(2, "Company name must be at least 2 characters"),
  adminName: z.string().min(2, "Admin name is required"),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerAgentSchema = z.object({
  name: z.string().min(2, "Agent name is required"),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerCustomerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterTenantAdminInput = z.infer<
  typeof registerTenantAdminSchema
>;
export type RegisterAgentInput = z.infer<typeof registerAgentSchema>;
export type RegisterCustomerInput = z.infer<typeof registerCustomerSchema>;
