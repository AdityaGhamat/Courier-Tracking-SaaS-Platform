import { fetcher } from "@/lib/fetcher";
import type { TrackingResponse } from "../types/tracking.types";

export const trackingService = {
  track: (trackingNumber: string) =>
    fetcher<TrackingResponse>(`/api/tracking/${trackingNumber}`),
};
