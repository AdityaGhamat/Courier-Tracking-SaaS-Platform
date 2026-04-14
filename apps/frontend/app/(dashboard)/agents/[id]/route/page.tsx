"use client";

import { useState, useEffect, use } from "react";
import { shipmentsApi, agentsApi } from "@/lib/api";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";
import {
  Loader2,
  MapPin,
  Navigation,
  Package,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RouteStop {
  order: number;
  shipmentId: string;
  trackingNumber: string;
  recipientName: string;
  recipientAddress: string;
  recipientPhone?: string;
  status: string;
  coordinates: { lat: number; lng: number };
  distanceFromPreviousStopKm: number;
}

interface OptimizedRouteResult {
  agentId: string;
  totalStops: number;
  totalDistanceKm: number;
  startingPoint: { lat: number; lng: number };
  optimizedRoute: RouteStop[];
}

interface Agent {
  id: string;
  name: string;
  email: string;
}

// ─── Hub presets (common Indian metro hubs) ──────────────────────────────────
const HUB_PRESETS = [
  { label: "Mumbai Central Hub", lat: 18.9388, lng: 72.8354 },
  { label: "Delhi NCR Hub", lat: 28.6139, lng: 77.209 },
  { label: "Bengaluru Hub", lat: 12.9716, lng: 77.5946 },
  { label: "Nagpur Hub", lat: 21.1458, lng: 79.0882 },
  { label: "Pune Hub", lat: 18.5204, lng: 73.8567 },
  { label: "Chennai Hub", lat: 13.0827, lng: 80.2707 },
  { label: "Hyderabad Hub", lat: 17.385, lng: 78.4867 },
  { label: "Custom…", lat: 0, lng: 0 },
];

// ─── Components ───────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-3 shadow-sm">
      <div className="w-9 h-9 rounded-lg bg-[#fd761a]/10 flex items-center justify-center text-[#fd761a] shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-xl font-bold text-slate-900 tabular-nums">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function StopCard({ stop, isFirst }: { stop: RouteStop; isFirst: boolean }) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${stop.coordinates.lat},${stop.coordinates.lng}`;

  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 z-10
          ${isFirst ? "bg-[#fd761a] border-[#fd761a] text-white" : "bg-white border-slate-300 text-slate-600"}`}
        >
          {stop.order}
        </div>
        {/* connector line — rendered for all except last stop by parent */}
        <div className="w-0.5 bg-slate-200 flex-1 mt-1" />
      </div>

      {/* Card */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-slate-800">
                {stop.trackingNumber}
              </span>
              <StatusBadge status={stop.status} />
            </div>
            <p className="font-semibold text-sm text-slate-800 mt-1">
              {stop.recipientName}
            </p>
            {stop.recipientPhone && (
              <p className="text-xs text-slate-500">📞 {stop.recipientPhone}</p>
            )}
            <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
              <MapPin size={11} className="shrink-0 mt-0.5 text-slate-400" />
              {stop.recipientAddress}
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className="text-xs text-slate-400 font-medium">From prev stop</p>
            <p className="text-lg font-bold text-[#fd761a] tabular-nums">
              {stop.distanceFromPreviousStopKm} km
            </p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline no-underline"
            >
              <Navigation size={10} /> Open Map
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AgentRoutePage({ params }: PageProps) {
  const { id: agentId } = use(params);

  const [agent, setAgent] = useState<Agent | null>(null);
  const [result, setResult] = useState<OptimizedRouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Hub coord state
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [hubLat, setHubLat] = useState(HUB_PRESETS[0].lat.toString());
  const [hubLng, setHubLng] = useState(HUB_PRESETS[0].lng.toString());

  // Load agent info for heading
  useEffect(() => {
    agentsApi
      .list()
      .then((res: any) => {
        const list: Agent[] = Array.isArray(res?.data)
          ? res.data
          : (res?.data?.agents ?? []);
        const found = list.find((a) => a.id === agentId);
        if (found) setAgent(found);
      })
      .catch(() => {
        /* non-critical */
      });
  }, [agentId]);

  function handlePresetChange(idx: number) {
    setSelectedPreset(idx);
    const p = HUB_PRESETS[idx];
    if (p.lat !== 0) {
      setHubLat(p.lat.toString());
      setHubLng(p.lng.toString());
    }
  }

  async function handleOptimize(e: React.FormEvent) {
    e.preventDefault();
    const lat = parseFloat(hubLat);
    const lng = parseFloat(hubLng);
    if (isNaN(lat) || isNaN(lng)) {
      setError("Please enter valid latitude and longitude.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res: any = await shipmentsApi.getOptimizedRoute(agentId, {
        hubLat: lat,
        hubLng: lng,
      });
      setResult(res?.data ?? res);
    } catch (err: any) {
      setError(err?.message ?? "Failed to calculate optimized route.");
    } finally {
      setLoading(false);
    }
  }

  const googleMapsRouteUrl = result
    ? (() => {
        const origin = `${result.startingPoint.lat},${result.startingPoint.lng}`;
        const waypoints = result.optimizedRoute
          .slice(0, -1)
          .map((s) => `${s.coordinates.lat},${s.coordinates.lng}`)
          .join("|");
        const destination = `${result.optimizedRoute[result.optimizedRoute.length - 1].coordinates.lat},${result.optimizedRoute[result.optimizedRoute.length - 1].coordinates.lng}`;
        return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ""}&travelmode=driving`;
      })()
    : null;

  return (
    <div className="flex flex-col gap-6 w-full min-w-0">
      {/* Back */}
      <Link
        href="/agents"
        className="text-sm text-slate-500 hover:text-slate-800 no-underline flex items-center gap-1.5 w-fit"
      >
        ← Back to Agents
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Navigation size={20} className="text-[#fd761a]" />
          Route Optimizer
          {agent && (
            <span className="text-base font-medium text-slate-500">
              — {agent.name}
            </span>
          )}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Calculate the most efficient delivery sequence for active shipments
          assigned to this agent.
        </p>
      </div>

      {/* Config Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 mb-4">
          Hub / Starting Point
        </h2>
        <form onSubmit={handleOptimize} className="flex flex-col gap-4">
          {/* Preset picker */}
          <div className="flex flex-wrap gap-2">
            {HUB_PRESETS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handlePresetChange(i)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                  ${
                    selectedPreset === i
                      ? "bg-[#fd761a] text-white border-[#fd761a]"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-[#fd761a] hover:text-[#fd761a]"
                  }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Lat/Lng inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">
                Latitude *
              </label>
              <input
                type="number"
                step="any"
                required
                value={hubLat}
                onChange={(e) => setHubLat(e.target.value)}
                placeholder="e.g. 18.9388"
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#fd761a] focus:ring-2 focus:ring-[#fd761a]/20 tabular-nums"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">
                Longitude *
              </label>
              <input
                type="number"
                step="any"
                required
                value={hubLng}
                onChange={(e) => setHubLng(e.target.value)}
                placeholder="e.g. 72.8354"
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#fd761a] focus:ring-2 focus:ring-[#fd761a]/20 tabular-nums"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="self-start flex items-center gap-2 rounded-lg bg-[#fd761a] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#e56810] disabled:opacity-60 transition-colors"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Navigation size={14} />
            )}
            {loading ? "Optimizing…" : "Calculate Optimized Route"}
          </button>
        </form>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Loader2 size={32} className="animate-spin text-[#fd761a]" />
          <p className="text-sm text-slate-500 font-medium">
            Geocoding addresses and calculating shortest path…
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && result && (
        <div className="flex flex-col gap-5">
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard
              icon={<Package size={16} />}
              label="Total Stops"
              value={result.totalStops.toString()}
              sub="active deliveries"
            />
            <StatCard
              icon={<Navigation size={16} />}
              label="Total Distance"
              value={`${result.totalDistanceKm} km`}
              sub="via nearest-neighbor"
            />
            <StatCard
              icon={<MapPin size={16} />}
              label="Starting Point"
              value={`${result.startingPoint.lat.toFixed(4)}, ${result.startingPoint.lng.toFixed(4)}`}
              sub="hub coordinates"
            />
          </div>

          {/* Open in Google Maps CTA */}
          {googleMapsRouteUrl && (
            <a
              href={googleMapsRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors no-underline"
            >
              <Navigation size={15} />
              Open Full Route in Google Maps
              <ChevronRight size={14} />
            </a>
          )}

          {/* Route stops */}
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-4">
              Delivery Sequence
            </h2>
            <div className="flex flex-col">
              {result.optimizedRoute.map((stop, idx) => (
                <StopCard
                  key={stop.shipmentId}
                  stop={stop}
                  isFirst={idx === 0}
                />
              ))}
              {/* Return to hub indicator */}
              <div className="flex gap-4 items-center">
                <div className="w-8 flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center">
                    <MapPin size={14} className="text-slate-500" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 italic pb-2">
                  Return to hub ({result.startingPoint.lat.toFixed(4)},{" "}
                  {result.startingPoint.lng.toFixed(4)})
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No active deliveries error (handled as error message above) */}
    </div>
  );
}
