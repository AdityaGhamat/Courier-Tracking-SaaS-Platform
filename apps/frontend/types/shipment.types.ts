export type ShipmentStatus =
  | "label_created"
  | "picked_up"
  | "at_sorting_facility"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "retry"
  | "returned"
  | "exception";

export interface TrackingEvent {
  id: string;
  parcelId: string;
  status: ShipmentStatus;
  location: string;
  description: string;
  agentId: string | null;
  timestamp: string;
}

export interface ShipmentUser {
  id: string;
  name: string;
  email: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  workspaceId: string;
  senderId: string;
  driverId: string | null;
  recipientName: string;
  recipientAddress: string;
  recipientPhone: string | null;
  recipientEmail: string | null;
  weight: string | null;
  status: ShipmentStatus;
  estimatedDelivery: string | null;
  deliveryProofUrl: string | null;
  hubId: string | null;
  createdAt: string;
  updatedAt: string;
  sender?: ShipmentUser;
  driver?: ShipmentUser | null;
  events?: TrackingEvent[];
}

export interface ListShipmentsQuery {
  page?: number;
  limit?: number;
  status?: ShipmentStatus;
}

export interface CreateShipmentInput {
  recipientName: string;
  recipientAddress: string;
  recipientPhone?: string;
  recipientEmail?: string;
  weight?: string;
  estimatedDelivery?: string;
  hubId?: string;
}

export interface UpdateShipmentStatusInput {
  status: ShipmentStatus;
  location: string;
  description: string;
}

export interface AssignAgentInput {
  agentId: string;
}
