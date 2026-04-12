import { fetcher } from "@/lib/fetcher";
import type {
  CreateVehicleInput,
  UpdateVehicleInput,
  AssignAgentToVehicleInput,
  VehicleListResponse,
  VehicleResponse,
} from "../types/vehicle.types";

export const vehicleService = {
  listVehicles: () => fetcher<VehicleListResponse>("/api/vehicles"),

  getMyVehicle: () => fetcher<VehicleResponse>("/api/vehicles/my/vehicle"),

  getVehicleById: (id: string) =>
    fetcher<VehicleResponse>(`/api/vehicles/${id}`),

  createVehicle: (body: CreateVehicleInput) =>
    fetcher<VehicleResponse>("/api/vehicles", { method: "POST", body }),

  updateVehicle: (id: string, body: UpdateVehicleInput) =>
    fetcher<VehicleResponse>(`/api/vehicles/${id}`, { method: "PATCH", body }),

  deleteVehicle: (id: string) =>
    fetcher<VehicleResponse>(`/api/vehicles/${id}`, { method: "DELETE" }),

  assignAgent: (id: string, body: AssignAgentToVehicleInput) =>
    fetcher<VehicleResponse>(`/api/vehicles/${id}/assign-agent`, {
      method: "POST",
      body,
    }),

  unassignAgent: (id: string) =>
    fetcher<VehicleResponse>(`/api/vehicles/${id}/unassign-agent`, {
      method: "DELETE",
    }),
};
