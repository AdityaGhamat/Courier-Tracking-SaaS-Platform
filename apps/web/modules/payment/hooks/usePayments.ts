"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "../services/payment.service";
import type {
  CreatePaymentInput,
  UpdatePaymentStatusInput,
  ListPaymentsQuery,
} from "../types/payment.types";

export const paymentKeys = {
  all: ["payments"] as const,
  list: (q: ListPaymentsQuery) => ["payments", "list", q] as const,
  detail: (id: string) => ["payments", id] as const,
  parcel: (parcelId: string) => ["payments", "parcel", parcelId] as const,
};

export function usePayments(query: ListPaymentsQuery = {}) {
  return useQuery({
    queryKey: paymentKeys.list(query),
    queryFn: () => paymentService.listPayments(query),
  });
}

export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePaymentInput) =>
      paymentService.createPayment(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: paymentKeys.all }),
  });
}

export function useUpdatePaymentStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePaymentStatusInput) =>
      paymentService.updatePaymentStatus(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: paymentKeys.all }),
  });
}

export function usePaymentsByParcel(parcelId: string) {
  return useQuery({
    queryKey: paymentKeys.parcel(parcelId),
    queryFn: () => paymentService.getPaymentsByParcel(parcelId),
    enabled: !!parcelId,
  });
}

export function useMyPayments(parcelId: string) {
  return useQuery({
    queryKey: ["payments", "my", parcelId],
    queryFn: () => paymentService.getMyPayments(parcelId),
    enabled: !!parcelId,
  });
}
