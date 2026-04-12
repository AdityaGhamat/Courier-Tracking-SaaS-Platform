"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { superAdminService } from "../services/superAdmin.service";
import type { AssignPlanInput } from "@/modules/subscription/types/subscription.types";

export const superAdminKeys = {
  tenants: () => ["superAdmin", "tenants"] as const,
  tenant: (id: string) => ["superAdmin", "tenants", id] as const,
  tenantSub: (id: string) => ["superAdmin", "tenants", id, "sub"] as const,
};

export function useTenants() {
  return useQuery({
    queryKey: superAdminKeys.tenants(),
    queryFn: superAdminService.listTenants,
  });
}

export function useTenantSubscription(id: string) {
  return useQuery({
    queryKey: superAdminKeys.tenantSub(id),
    queryFn: () => superAdminService.getTenantSubscription(id),
    enabled: !!id,
  });
}

export function useDeleteTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => superAdminService.deleteTenant(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: superAdminKeys.tenants() }),
  });
}

export function useAssignPlanToTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignPlanInput) =>
      superAdminService.assignPlanToTenant(data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: superAdminKeys.tenants() }),
  });
}
