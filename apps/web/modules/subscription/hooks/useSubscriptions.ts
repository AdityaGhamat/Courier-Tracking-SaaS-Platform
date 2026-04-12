"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionService } from "../services/subscription.service";
import type {
  CreatePlanInput,
  AssignPlanInput,
} from "../types/subscription.types";

export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  plans: () => ["subscriptions", "plans"] as const,
  my: () => ["subscriptions", "my"] as const,
  allSubs: () => ["subscriptions", "all"] as const,
};

export function usePlans() {
  return useQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: subscriptionService.listPlans,
  });
}

export function useMySubscription() {
  return useQuery({
    queryKey: subscriptionKeys.my(),
    queryFn: subscriptionService.getMySubscription,
  });
}

export function useAllSubscriptions() {
  return useQuery({
    queryKey: subscriptionKeys.allSubs(),
    queryFn: subscriptionService.listAllSubscriptions,
  });
}

export function useCreatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePlanInput) => subscriptionService.createPlan(data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: subscriptionKeys.plans() }),
  });
}

export function useAssignPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignPlanInput) => subscriptionService.assignPlan(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: subscriptionKeys.all }),
  });
}

export function useDeletePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionService.deletePlan(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: subscriptionKeys.plans() }),
  });
}
