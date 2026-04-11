export type JobName =
  | "send.shipment_created"
  | "send.status_updated"
  | "send.out_for_delivery"
  | "send.delivered"
  | "send.delivery_failed"
  | "send.agent_assigned";

export interface ShipmentCreatedPayload {
  recipientEmail: string;
  recipientName: string;
  trackingNumber: string;
  senderName: string;
}

export interface StatusUpdatedPayload {
  recipientEmail: string;
  recipientName: string;
  trackingNumber: string;
  status: string;
  location?: string;
  description?: string;
  timestamp: Date;
}

export interface OutForDeliveryPayload {
  recipientEmail: string;
  recipientName: string;
  trackingNumber: string;
  agentName: string;
  estimatedDelivery?: Date;
}

export interface DeliveredPayload {
  recipientEmail: string;
  recipientName: string;
  trackingNumber: string;
  timestamp: Date;
}

export interface DeliveryFailedPayload {
  recipientEmail: string;
  recipientName: string;
  trackingNumber: string;
  reason: string;
  timestamp: Date;
}

export interface AgentAssignedPayload {
  recipientEmail: string;
  recipientName: string;
  trackingNumber: string;
  agentName: string;
}

export type JobPayloadMap = {
  "send.shipment_created": ShipmentCreatedPayload;
  "send.status_updated": StatusUpdatedPayload;
  "send.out_for_delivery": OutForDeliveryPayload;
  "send.delivered": DeliveredPayload;
  "send.delivery_failed": DeliveryFailedPayload;
  "send.agent_assigned": AgentAssignedPayload;
};
