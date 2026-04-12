import { fetcher } from "@/lib/fetcher";
import type {
  CreatePlanInput,
  AssignPlanInput,
  UpdateSubscriptionInput,
  PlanListResponse,
  SubscriptionResponse,
  SubscriptionListResponse,
} from "../types/subscription.types";

export const subscriptionService = {
  // all roles
  listPlans: () => fetcher<PlanListResponse>("/api/subscriptions/plans"),

  // admin
  getMySubscription: () =>
    fetcher<SubscriptionResponse>("/api/subscriptions/my"),

  // super_admin — via /api/super-admin/*
  listAllSubscriptions: () =>
    fetcher<SubscriptionListResponse>("/api/super-admin/plans"),

  createPlan: (body: CreatePlanInput) =>
    fetcher<SubscriptionResponse>("/api/super-admin/plans", {
      method: "POST",
      body,
    }),

  assignPlan: (body: AssignPlanInput) =>
    fetcher<SubscriptionResponse>("/api/super-admin/subscriptions/assign", {
      method: "POST",
      body,
    }),

  updateSubscriptionStatus: (id: string, body: UpdateSubscriptionInput) =>
    fetcher<SubscriptionResponse>(`/api/subscriptions/${id}/status`, {
      method: "PATCH",
      body,
    }),

  deletePlan: (id: string) =>
    fetcher<SubscriptionResponse>(`/api/super-admin/plans/${id}`, {
      method: "DELETE",
    }),
};
