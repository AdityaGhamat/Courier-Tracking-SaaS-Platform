export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type Payment = {
  id: string;
  parcelId: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  notes?: string;
  gatewayTransactionId?: string;
  createdAt: string;
};

export type CreatePaymentInput = {
  parcelId: string;
  amount: string;
  currency?: string;
  notes?: string;
};

export type UpdatePaymentStatusInput = {
  status: PaymentStatus;
  gatewayTransactionId?: string;
  notes?: string;
};

export type ListPaymentsQuery = {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
};

export type PaymentListResponse = {
  success: boolean;
  message: string;
  data: { payments: Payment[]; total: number; page: number; limit: number };
};

export type PaymentResponse = {
  success: boolean;
  message: string;
  data: Payment;
};
