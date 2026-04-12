"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hubService } from "../services/hub.service";
import type { CreateHubInput, UpdateHubInput } from "../types/hub.types";

export const hubKeys = {
  all: ["hubs"] as const,
  list: () => ["hubs", "list"] as const,
  detail: (id: string) => ["hubs", id] as const,
};

export function useHubs() {
  return useQuery({ queryKey: hubKeys.list(), queryFn: hubService.listHubs });
}

export function useHubById(id: string) {
  return useQuery({
    queryKey: hubKeys.detail(id),
    queryFn: () => hubService.getHubById(id),
    enabled: !!id,
  });
}

export function useCreateHub() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateHubInput) => hubService.createHub(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: hubKeys.all }),
  });
}

export function useUpdateHub(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateHubInput) => hubService.updateHub(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: hubKeys.all }),
  });
}

export function useDeleteHub() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => hubService.deleteHub(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: hubKeys.all }),
  });
}
