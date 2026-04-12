import { fetcher } from "@/lib/fetcher";
import type {
  CreateShipmentInput,
  UpdateShipmentStatusInput,
  AssignAgentInput,
  ListShipmentsQuery,
  ShipmentListResponse,
  ShipmentResponse,
} from "@/types/shipment.types";

export const shipmentService = {
  listShipments: (query: ListShipmentsQuery = {}) => {
    const params = new URLSearchParams();
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    if (query.status) params.set("status", query.status);
    return fetcher<ShipmentListResponse>(`/api/shipments?${params.toString()}`);
  },

  getMyShipments: (query: { page?: number; limit?: number } = {}) => {
    const params = new URLSearchParams();
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    return fetcher<ShipmentListResponse>(
      `/api/shipments/my/shipments?${params.toString()}`,
    );
  },

  getAgentShipments: () =>
    fetcher<ShipmentListResponse>("/api/shipments/agent/assigned"),

  getShipmentById: (id: string) =>
    fetcher<ShipmentResponse>(`/api/shipments/${id}`),

  createShipment: (body: CreateShipmentInput) =>
    fetcher<ShipmentResponse>("/api/shipments", { method: "POST", body }),

  updateStatus: (id: string, body: UpdateShipmentStatusInput) =>
    fetcher<ShipmentResponse>(`/api/shipments/${id}/status`, {
      method: "POST",
      body,
    }),

  assignAgent: (id: string, body: AssignAgentInput) =>
    fetcher<ShipmentResponse>(`/api/shipments/${id}/assign-agent`, {
      method: "POST",
      body,
    }),
};
