"use client";

import { useState } from "react";
import {
  Search,
  Package,
  MapPin,
  Clock,
  User,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { TrackingProgressBar } from "@/components/tracking/tracking-progress-bar";
import { TrackingHistory } from "@/components/tracking/tracking-history";
import type { TrackingResult } from "@/types/tracking.types";

export default function DashboardTrackingPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(
        `${window.location.origin}/track?q=${result.trackingNumber}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto min-w-0 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Track Shipment
        </h1>
        <p className="text-sm text-slate-500">
          Look up real-time status and history by tracking number.
        </p>
      </div>

      {/* Search bar */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 w-full"
      >
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="e.g. TRK-A1B2C3"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-base font-mono text-slate-900 placeholder:text-slate-400 placeholder:font-sans w-full min-w-0"
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md shrink-0 sm:w-auto w-full ${
            loading || !query.trim()
              ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
              : "bg-[#fd761a] text-white hover:bg-[#ea620c] border border-transparent shadow-[#fd761a]/20 active:scale-[0.98]"
          }`}
        >
          {loading ? "Searching…" : "Track Package"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="px-5 py-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-3 shadow-sm">
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          {error}
        </div>
      )}

      {/* Result card */}
      {result && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 w-full min-w-0">
          {/* Result Header (Kept Dark Indigo Gradient for premium contrast) */}
          <div
            className="px-6 py-6 sm:px-8 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)" }}
          >
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
              <Package
                size={120}
                className="transform translate-x-4 -translate-y-4 text-white"
              />
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex flex-col gap-3 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-white/10 border border-white/20 rounded text-xs font-bold text-indigo-200 uppercase tracking-widest">
                    Tracking ID
                  </span>
                  <p className="font-mono font-bold text-xl sm:text-2xl text-white tracking-wide truncate">
                    {result.trackingNumber}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <User size={14} className="text-indigo-300 shrink-0" />
                    <p className="text-sm text-indigo-200 truncate">
                      Recipient:{" "}
                      <strong className="text-white ml-1">
                        {result.recipient.name}
                      </strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-2 min-w-0">
                    <MapPin
                      size={14}
                      className="text-indigo-400 mt-0.5 shrink-0"
                    />
                    <p className="text-sm text-indigo-300 break-words leading-relaxed">
                      {result.recipient.address}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-semibold text-white transition-colors"
              >
                {copied ? (
                  <CheckCircle2 size={14} className="text-green-400" />
                ) : (
                  <Copy size={14} />
                )}
                {copied ? "Copied Link" : "Copy Link"}
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-6 py-8 sm:px-8 border-b border-slate-100 bg-white w-full overflow-x-auto">
            <div className="min-w-[500px] w-full">
              <TrackingProgressBar currentStatus={result.currentStatus} />
            </div>
          </div>

          {/* Meta row */}
          <div className="px-6 py-5 sm:px-8 flex gap-8 sm:gap-12 flex-wrap bg-slate-50 border-b border-slate-100">
            {result.estimatedDelivery && (
              <div className="flex flex-col gap-1.5">
                <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">
                  Est. Delivery
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {new Date(result.estimatedDelivery).toLocaleDateString(
                    undefined,
                    { weekday: "short", month: "short", day: "numeric" },
                  )}
                </p>
              </div>
            )}
            {result.assignedAgent && (
              <div className="flex flex-col gap-1.5">
                <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">
                  Assigned Agent
                </p>
                <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#fd761a]" />
                  {result.assignedAgent.name}
                </p>
              </div>
            )}
          </div>

          {/* History */}
          <div className="px-6 py-6 sm:px-8 bg-white">
            <div className="flex items-center gap-2.5 mb-6 border-b border-slate-100 pb-4">
              <Clock size={16} className="text-slate-400" />
              <p className="text-sm font-bold text-slate-700 uppercase tracking-widest">
                Detailed Timeline
              </p>
            </div>
            <TrackingHistory history={result.history} />
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !error && !loading && (
        <div className="py-20 flex flex-col items-center justify-center gap-4 border border-dashed border-slate-300 rounded-2xl text-center bg-slate-50">
          <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
            <Package size={28} className="text-slate-400" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base font-semibold text-slate-900">
              Awaiting Tracking Number
            </p>
            <p className="text-sm text-slate-500">Format: TRK-XXXXXX</p>
          </div>
        </div>
      )}
    </div>
  );
}
