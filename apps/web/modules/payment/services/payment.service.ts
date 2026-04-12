import { fetcher } from "@/lib/fetcher";
import type {
  CreatePaymentInput,
  UpdatePaymentStatusInput,
  ListPaymentsQuery,
  PaymentListResponse,
  PaymentResponse,
} from "../types/payment.types";

export const paymentService = {
  // admin
  listPayments: (query: ListPaymentsQuery = {}) => {
    const p = new URLSearchParams();
    if (query.page) p.set("page", String(query.page));
    if (query.limit) p.set("limit", String(query.limit));
    if (query.status) p.set("status", query.status);
    return fetcher<PaymentListResponse>(`/api/payments?${p.toString()}`);
  },

  createPayment: (body: CreatePaymentInput) =>
    fetcher<PaymentResponse>("/api/payments", { method: "POST", body }),

  getPaymentById: (id: string) =>
    fetcher<PaymentResponse>(`/api/payments/${id}`),

  updatePaymentStatus: (id: string, body: UpdatePaymentStatusInput) =>
    fetcher<PaymentResponse>(`/api/payments/${id}/status`, {
      method: "PATCH",
      body,
    }),

  getPaymentsByParcel: (parcelId: string) =>
    fetcher<PaymentListResponse>(`/api/payments/parcel/${parcelId}/history`),

  getActivePaymentByParcel: (parcelId: string) =>
    fetcher<PaymentResponse>(`/api/payments/parcel/${parcelId}`),

  // customer
  getMyPayments: (parcelId: string) =>
    fetcher<PaymentListResponse>(`/api/payments/my/${parcelId}/history`),

  getMyActivePayment: (parcelId: string) =>
    fetcher<PaymentResponse>(`/api/payments/my/${parcelId}`),
};
