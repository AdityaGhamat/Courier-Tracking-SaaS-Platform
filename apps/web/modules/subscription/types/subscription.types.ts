export type PlanType = "basic" | "pro" | "enterprise";
export type BillingCycle = "monthly" | "yearly";
export type SubscriptionStatus =
  | "active"
  | "inactive"
  | "expired"
  | "cancelled";

export type Plan = {
  id: string;
  name: string;
  description?: string;
  type: PlanType;
  price: string;
  billingCycle: BillingCycle;
  maxShipments: number;
  maxAgents: number;
  isActive: boolean;
};

export type Subscription = {
  id: string;
  workspaceId: string;
  planId: string;
  plan?: Plan;
  status: SubscriptionStatus;
  endDate: string;
  createdAt: string;
};

export type CreatePlanInput = {
  name: string;
  description?: string;
  type: PlanType;
  price: string;
  billingCycle: BillingCycle;
  maxShipments: number;
  maxAgents: number;
};

export type AssignPlanInput = {
  workspaceId: string;
  planId: string;
  endDate: string;
};

export type UpdateSubscriptionInput = {
  status: SubscriptionStatus;
};

export type PlanListResponse = {
  success: boolean;
  message: string;
  data: Plan[];
};

export type SubscriptionResponse = {
  success: boolean;
  message: string;
  data: Subscription;
};

export type SubscriptionListResponse = {
  success: boolean;
  message: string;
  data: Subscription[];
};
