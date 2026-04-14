export interface TenantOwner {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  owner?: TenantOwner;
  staff?: { id: string; name: string; email: string; role: string }[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string | null;
  price: string;
  maxShipments: number;
  maxAgents: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TenantSubscription {
  id: string;
  workspaceId: string;
  planId: string;
  status: "active" | "cancelled" | "expired";
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
  plan?: SubscriptionPlan;
}
