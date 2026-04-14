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
  parcelId: string;
  status: ShipmentStatus;
  agentId?: string;
  location?: string;
  description?: string;
  timestamp: string;
}

export interface ShipmentAgent {
  id: string;
  name: string;
  email: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  status: ShipmentStatus;
  senderId: string;
  recipientName: string;
  recipientAddress: string;
  recipientPhone?: string;
  recipientEmail?: string;
  weight?: number;
  driverId?: string;
  driver?: ShipmentAgent;
  sender?: ShipmentAgent;
  hubId?: string;
  workspaceId: string;
  estimatedDelivery?: string;
  deliveryProofUrl?: string;
  createdAt: string;
  updatedAt: string;
  events?: ShipmentEvent[];
}
