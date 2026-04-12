"use client";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../services/analytics.service";

export function useWorkspaceAnalytics() {
  return useQuery({
    queryKey: ["analytics", "workspace"],
    queryFn: analyticsService.getWorkspaceAnalytics,
  });
}

export function useAgentAnalytics() {
  return useQuery({
    queryKey: ["analytics", "agent"],
    queryFn: analyticsService.getAgentAnalytics,
  });
}
