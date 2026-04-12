"use client";
import { useQuery } from "@tanstack/react-query";
import { qrCodeService } from "../services/qrcode.service";

export function useQRCode(shipmentId: string) {
  return useQuery({
    queryKey: ["qrcode", shipmentId],
    queryFn: () => qrCodeService.getQRCode(shipmentId),
    enabled: !!shipmentId,
    staleTime: 1000 * 60 * 10, // QR doesn't change, cache 10 min
  });
}
