"use client";

import { useState } from "react";
import {
  Route,
  MapPin,
  Loader2,
  ChevronDown,
  ChevronUp,
  Navigation,
  Package,
} from "lucide-react";
import { shipmentsApi } from "@/lib/api";

interface RouteStop {
  shipmentId: string;
  trackingNumber: string;
  recipientName: string;
  recipientAddress: string;
  lat: number;
  lng: number;
  distanceFromHub: number;
  status: string;
}

interface OptimizedRouteResponse {
  data: {
    agentId: string;
    hubLocation: { lat: number; lng: number };
    totalShipments: number;
    optimizedRoute: RouteStop[];
  };
}

interface Props {
  agentId: string;
  hubLat?: number;
  hubLng?: number;
}

export function OptimizedRoutePanel({
  agentId,
  hubLat = 19.076,
  hubLng = 72.8777,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState<RouteStop[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadRoute() {
    if (route) {
      setOpen((o) => !o);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = (await shipmentsApi.getOptimizedRoute(agentId, {
        hubLat,
        hubLng,
      })) as OptimizedRouteResponse;
      setRoute(res?.data?.optimizedRoute ?? []);
      setOpen(true);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load optimized route");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  const statusColors: Record<string, string> = {
    out_for_delivery: "bg-amber-100 text-amber-700 border-amber-200",
    in_transit: "bg-blue-100 text-blue-700 border-blue-200",
    delivered: "bg-green-100 text-green-700 border-green-200",
    created: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <button
        onClick={loadRoute}
        disabled={loading}
        className="w-full flex items-center justify-between gap-3 px-5 py-3.5 border-b border-border bg-primary/5 hover:bg-primary/10 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <Route size={14} className="text-primary shrink-0" />
          <span className="text-sm font-bold text-foreground">
            Optimized Delivery Route
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
            Advanced
          </span>
        </div>
        {loading ? (
          <Loader2 size={15} className="animate-spin text-primary" />
        ) : open ? (
          <ChevronUp size={15} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={15} className="text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="p-5">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 text-sm text-destructive font-medium mb-4">
              {error}
            </div>
          )}
          {route?.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Package size={32} className="text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No pending shipments for this agent.
              </p>
            </div>
          )}
          {route && route.length > 0 && (
            <div className="flex flex-col gap-1">
              {/* Hub origin */}
              <div className="flex items-center gap-3 px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl mb-3">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                  <Navigation size={13} className="text-primary-foreground" />
                </div>
                <div>
                  <p className="text-[11px] text-primary font-bold uppercase tracking-wider">
                    Hub / Start
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {hubLat.toFixed(4)}, {hubLng.toFixed(4)}
                  </p>
                </div>
              </div>
              <div className="ml-[22px] w-0.5 h-4 bg-border" />
              {route.map((stop, idx) => (
                <div key={stop.shipmentId} className="flex items-start gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-7 h-7 rounded-full bg-card border-2 border-primary flex items-center justify-center text-[11px] font-bold text-primary">
                      {idx + 1}
                    </div>
                    {idx < route.length - 1 && (
                      <div className="w-0.5 h-6 bg-border mt-1" />
                    )}
                  </div>
                  <div className="flex-1 bg-card border border-border rounded-xl p-3.5 mb-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate">
                          {stop.recipientName}
                        </p>
                        <div className="flex items-start gap-1.5 mt-1">
                          <MapPin
                            size={11}
                            className="text-muted-foreground mt-0.5 shrink-0"
                          />
                          <p className="text-xs text-muted-foreground break-words">
                            {stop.recipientAddress}
                          </p>
                        </div>
                        <p className="text-[11px] font-mono text-muted-foreground mt-1.5">
                          {stop.trackingNumber}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColors[stop.status] ?? "bg-muted text-muted-foreground border-border"}`}
                        >
                          {stop.status.replace(/_/g, " ")}
                        </span>
                        {stop.distanceFromHub !== undefined && (
                          <span className="text-[10px] text-muted-foreground">
                            {stop.distanceFromHub.toFixed(1)} km from hub
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-muted/50 rounded-lg">
                <Route size={12} className="text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {route.length}
                  </span>{" "}
                  stops optimized by proximity to hub
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
