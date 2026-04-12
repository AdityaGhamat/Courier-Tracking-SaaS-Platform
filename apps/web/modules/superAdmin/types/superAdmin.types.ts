import type { SubscriptionStatus } from "@/modules/subscription/types/subscription.types";

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
};

export type TenantSubscription = {
  id: string;
  workspaceId: string;
  status: SubscriptionStatus;
  endDate: string;
  plan: {
    name: string;
    type: string;
    price: string;
    billingCycle: string;
  };
};

export type TenantListResponse = {
  success: boolean;
  message: string;
  data: Tenant[];
};

export type TenantResponse = {
  success: boolean;
  message: string;
  data: Tenant;
};

export type TenantSubscriptionResponse = {
  success: boolean;
  message: string;
  data: TenantSubscription;
};
