export type Role = "admin" | "customer" | "delivery_agent" | "super_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  workspaceId?: string;
}

export interface AuthResponse {
  user: User;
}

export type ShipmentStatus =
  | "label_created"
  | "picked_up"
  | "at_sorting_facility"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "retry"
  | "returned";

export interface ShipmentEvent {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  note?: string;
  location?: string;
  createdAt: string;
}

export interface Shipment {
  id: string;
  trackingId: string;
  status: ShipmentStatus;
  senderId: string;
  recipientName: string;
  recipientAddress: string;
  recipientPhone?: string;
  agentId?: string;
  hubId?: string;
  workspaceId: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
  events?: ShipmentEvent[];
}

export interface Hub {
  id: string;
  name: string;
  address: string;
  city: string;
  workspaceId: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  type: string;
  agentId?: string;
  workspaceId: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
