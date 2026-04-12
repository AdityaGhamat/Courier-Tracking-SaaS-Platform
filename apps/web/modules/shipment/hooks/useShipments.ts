"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shipmentService } from "../services/shipment.service";
import type {
  CreateShipmentInput,
  UpdateShipmentStatusInput,
  AssignAgentInput,
  ListShipmentsQuery,
} from "@/types/shipment.types";

// Keys
export const shipmentKeys = {
  all: ["shipments"] as const,
  list: (query: ListShipmentsQuery) => ["shipments", "list", query] as const,
  myList: (query: object) => ["shipments", "my", query] as const,
  agentList: () => ["shipments", "agent"] as const,
  detail: (id: string) => ["shipments", id] as const,
};

// admin
export function useShipments(query: ListShipmentsQuery = {}) {
  return useQuery({
    queryKey: shipmentKeys.list(query),
    queryFn: () => shipmentService.listShipments(query),
  });
}

// customer
export function useMyShipments(query: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: shipmentKeys.myList(query),
    queryFn: () => shipmentService.getMyShipments(query),
  });
}

// delivery_agent
export function useAgentShipments() {
  return useQuery({
    queryKey: shipmentKeys.agentList(),
    queryFn: () => shipmentService.getAgentShipments(),
  });
}

// admin + agent
export function useShipmentById(id: string) {
  return useQuery({
    queryKey: shipmentKeys.detail(id),
    queryFn: () => shipmentService.getShipmentById(id),
    enabled: !!id,
  });
}

// admin + customer
export function useCreateShipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateShipmentInput) =>
      shipmentService.createShipment(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: shipmentKeys.all }),
  });
}

// admin + agent
export function useUpdateShipmentStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateShipmentStatusInput) =>
      shipmentService.updateStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: shipmentKeys.all });
      qc.invalidateQueries({ queryKey: shipmentKeys.detail(id) });
    },
  });
}

// admin
export function useAssignAgent(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignAgentInput) =>
      shipmentService.assignAgent(id, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: shipmentKeys.detail(id) }),
  });
}
