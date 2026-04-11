import { z } from "zod";

export const createPaymentSchema = z.object({
  parcelId: z.string().uuid("Invalid parcel ID"),
  amount: z.string().min(1, "Amount is required"),
  currency: z.string().length(3).default("INR"),
  notes: z.string().optional(),
});

export const updatePaymentStatusSchema = z.object({
  status: z.enum(["pending", "paid", "failed", "refunded"]),
  gatewayTransactionId: z.string().optional(),
  notes: z.string().optional(),
});

export const listPaymentsQuerySchema = z.object({
  page: z.string().optional().transform(Number).default(1),
  limit: z.string().optional().transform(Number).default(10),
  status: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentStatusInput = z.infer<
  typeof updatePaymentStatusSchema
>;
export type ListPaymentsQueryInput = z.infer<typeof listPaymentsQuerySchema>;
