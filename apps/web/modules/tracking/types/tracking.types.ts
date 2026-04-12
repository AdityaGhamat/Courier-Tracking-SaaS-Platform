import type { ShipmentStatus } from "@/types";

export type TrackingEvent = {
  status: ShipmentStatus;
  location: string;
  description: string;
  timestamp: string;
};

export type TrackingResult = {
  trackingNumber: string;
  recipientName: string;
  recipientAddress: string;
  currentStatus: ShipmentStatus;
  estimatedDelivery?: string;
  events: TrackingEvent[];
};

export type TrackingResponse = {
  success: boolean;
  message: string;
  data: TrackingResult;
};
