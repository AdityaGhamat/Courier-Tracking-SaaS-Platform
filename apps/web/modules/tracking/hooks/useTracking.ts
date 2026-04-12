"use client";
import { useQuery } from "@tanstack/react-query";
import { trackingService } from "../services/tracking.service";

export function useTracking(trackingNumber: string) {
  return useQuery({
    queryKey: ["tracking", trackingNumber],
    queryFn: () => trackingService.track(trackingNumber),
    enabled: !!trackingNumber,
    retry: false,
  });
}
