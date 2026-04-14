export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface PaymentParcel {
  id: string;
  trackingNumber: string;
  recipientName: string;
  status: string;
}

export interface Payment {
  id: string;
  parcelId: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  notes?: string | null;
  gatewayTransactionId?: string | null;
  createdAt: string;
  updatedAt: string;
  parcel: PaymentParcel;
}

export interface ListPaymentsResponse {
  payments: Payment[];
  page: number;
  limit: number;
}

export interface CreatePaymentInput {
  parcelId: string;
  amount: string;
  currency?: string;
  notes?: string;
}

export interface UpdatePaymentStatusInput {
  status: PaymentStatus;
  gatewayTransactionId?: string;
  notes?: string;
}
