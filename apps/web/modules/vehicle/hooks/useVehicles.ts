"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vehicleService } from "../services/vehicle.service";
import type {
  CreateVehicleInput,
  AssignAgentToVehicleInput,
} from "../types/vehicle.types";

export const vehicleKeys = {
  all: ["vehicles"] as const,
  list: () => ["vehicles", "list"] as const,
  my: () => ["vehicles", "my"] as const,
  detail: (id: string) => ["vehicles", id] as const,
};

export function useVehicles() {
  return useQuery({
    queryKey: vehicleKeys.list(),
    queryFn: vehicleService.listVehicles,
  });
}

export function useMyVehicle() {
  return useQuery({
    queryKey: vehicleKeys.my(),
    queryFn: vehicleService.getMyVehicle,
  });
}

export function useCreateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVehicleInput) =>
      vehicleService.createVehicle(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: vehicleKeys.all }),
  });
}

export function useDeleteVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vehicleService.deleteVehicle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: vehicleKeys.all }),
  });
}

export function useAssignAgentToVehicle(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignAgentToVehicleInput) =>
      vehicleService.assignAgent(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: vehicleKeys.all }),
  });
}

export function useUnassignAgent(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => vehicleService.unassignAgent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: vehicleKeys.all }),
  });
}
