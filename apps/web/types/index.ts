// Roles from your backend
export type Role = "admin" | "customer" | "delivery_agent" | "super_admin";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PaginatedResponse<T> = {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  tenantId?: string;
};

export type ShipmentStatus =
  | "label_created"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed";
