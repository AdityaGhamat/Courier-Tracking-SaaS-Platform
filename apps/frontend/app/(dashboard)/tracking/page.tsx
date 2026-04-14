"use client";

import { useState } from "react";
import { Search, Package, MapPin, Clock, User } from "lucide-react";
import { TrackingProgressBar } from "@/components/tracking/tracking-progress-bar";
import { TrackingHistory } from "@/components/tracking/tracking-history";
import type { TrackingResult } from "@/types/tracking.types";

export default function DashboardTrackingPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/proxy/track/${encodeURIComponent(q)}`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message ?? "Shipment not found");
      setResult(json?.data ?? json);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1
          className="text-xl font-bold text-slate-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Track Shipment
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Look up any shipment by tracking number
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-400 transition-all">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="e.g. TRK-A1B2C3"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm font-mono text-slate-800 placeholder:text-slate-400 placeholder:font-sans"
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-opacity disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
        >
          {loading ? "Searching…" : "Track"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Result card */}
      {result && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Result header */}
          <div
            className="px-6 py-5"
            style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)" }}
          >
            <p className="font-mono font-bold text-lg text-white tracking-wide">
              {result.trackingNumber}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <User size={12} className="text-indigo-300" />
              <p className="text-sm text-indigo-200">
                To:{" "}
                <strong className="text-white">{result.recipient.name}</strong>
              </p>
            </div>
            <div className="flex items-start gap-1.5 mt-1">
              <MapPin size={11} className="text-indigo-400 mt-0.5 shrink-0" />
              <p className="text-xs text-indigo-300">
                {result.recipient.address}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-6 py-5 border-b border-slate-100">
            <TrackingProgressBar currentStatus={result.currentStatus} />
          </div>

          {/* Meta row */}
          <div className="px-6 py-4 flex gap-8 flex-wrap bg-slate-50 border-b border-slate-100">
            {result.estimatedDelivery && (
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  Est. Delivery
                </p>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {new Date(result.estimatedDelivery).toLocaleDateString(
                    undefined,
                    {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
            )}
            {result.assignedAgent && (
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  Assigned Agent
                </p>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {result.assignedAgent.name}
                </p>
              </div>
            )}
          </div>

          {/* History */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={13} className="text-indigo-400" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Tracking History
              </p>
            </div>
            <TrackingHistory history={result.history} />
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !error && !loading && (
        <div className="py-16 flex flex-col items-center gap-3 border border-dashed border-slate-200 rounded-2xl text-center bg-slate-50">
          <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center">
            <Package size={24} className="text-indigo-400" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            Enter a tracking number above
          </p>
          <p className="text-xs text-slate-400">Format: TRK-XXXXXX</p>
        </div>
      )}
    </div>
  );
}
