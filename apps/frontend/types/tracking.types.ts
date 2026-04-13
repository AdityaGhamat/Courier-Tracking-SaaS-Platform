import type { ShipmentStatus } from "./shipment.types";

export interface TrackingHistoryEvent {
  status: ShipmentStatus;
  location: string | null;
  description: string | null;
  timestamp: string;
}

export interface TrackingResult {
  trackingNumber: string;
  currentStatus: ShipmentStatus;
  estimatedDelivery: string | null;
  recipient: {
    name: string;
    address: string;
  };
  assignedAgent: { name: string } | null;
  history: TrackingHistoryEvent[];
}
