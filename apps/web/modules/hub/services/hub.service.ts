import { fetcher } from "@/lib/fetcher";
import type {
  CreateHubInput,
  UpdateHubInput,
  HubListResponse,
  HubResponse,
} from "../types/hub.types";

export const hubService = {
  listHubs: () => fetcher<HubListResponse>("/api/hubs"),

  getHubById: (id: string) => fetcher<HubResponse>(`/api/hubs/${id}`),

  createHub: (body: CreateHubInput) =>
    fetcher<HubResponse>("/api/hubs", { method: "POST", body }),

  updateHub: (id: string, body: UpdateHubInput) =>
    fetcher<HubResponse>(`/api/hubs/${id}`, { method: "PATCH", body }),

  deleteHub: (id: string) =>
    fetcher<HubResponse>(`/api/hubs/${id}`, { method: "DELETE" }),

  assignShipmentToHub: (shipmentId: string, hubId: string) =>
    fetcher<HubResponse>(`/api/hubs/shipments/${shipmentId}/assign`, {
      method: "POST",
      body: { hubId },
    }),

  getHubShipments: (id: string) =>
    fetcher<HubListResponse>(`/api/hubs/${id}/shipments`),
};
