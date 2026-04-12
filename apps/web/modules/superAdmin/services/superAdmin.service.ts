import { fetcher } from "@/lib/fetcher";
import type {
  TenantListResponse,
  TenantResponse,
  TenantSubscriptionResponse,
} from "../types/superAdmin.types";
import type { AssignPlanInput } from "@/modules/subscription/types/subscription.types";

export const superAdminService = {
  listTenants: () => fetcher<TenantListResponse>("/api/super-admin/tenants"),

  getTenantById: (id: string) =>
    fetcher<TenantResponse>(`/api/super-admin/tenants/${id}`),

  deleteTenant: (id: string) =>
    fetcher<TenantResponse>(`/api/super-admin/tenants/${id}`, {
      method: "DELETE",
    }),

  getTenantSubscription: (id: string) =>
    fetcher<TenantSubscriptionResponse>(
      `/api/super-admin/tenants/${id}/subscription`,
    ),

  assignPlanToTenant: (body: AssignPlanInput) =>
    fetcher<TenantResponse>("/api/super-admin/subscriptions/assign", {
      method: "POST",
      body,
    }),
};
