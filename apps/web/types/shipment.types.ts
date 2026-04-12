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

export type Shipment = {
  id: string;
  trackingNumber: string;
  recipientName: string;
  recipientAddress: string;
  recipientPhone?: string;
  recipientEmail?: string;
  weight?: string;
  estimatedDelivery?: string;
  hubId?: string;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateShipmentInput = {
  recipientName: string;
  recipientAddress: string;
  recipientPhone?: string;
  recipientEmail?: string;
  weight?: string;
  estimatedDelivery?: string;
  hubId?: string;
};

export type UpdateShipmentStatusInput = {
  status: ShipmentStatus;
  location: string;
  description: string;
};

export type AssignAgentInput = {
  agentId: string;
};

export type ListShipmentsQuery = {
  page?: number;
  limit?: number;
  status?: ShipmentStatus;
};

export type ShipmentListResponse = {
  success: boolean;
  message: string;
  data: {
    shipments: Shipment[];
    total: number;
    page: number;
    limit: number;
  };
};

export type ShipmentResponse = {
  success: boolean;
  message: string;
  data: Shipment;
};
