"use client";

import { useState } from "react";
import { TrackingProgressBar } from "./tracking-progress-bar";
import { TrackingHistory } from "./tracking-history";
import type { TrackingResult } from "@/types/tracking.types";

export function TrackingSearchForm() {
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
      // Backend wraps in { data: { ... } }
      setResult(json?.data ?? json);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* Search bar */}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "var(--space-3)" }}
      >
        <input
          type="text"
          placeholder="e.g. TRK-A1B2C3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "var(--space-3) var(--space-4)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface)",
            color: "var(--color-text)",
            fontSize: "var(--text-base)",
            outline: "none",
            fontFamily: "monospace",
          }}
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          style={{
            padding: "var(--space-3) var(--space-6)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-primary)",
            color: "white",
            fontWeight: 600,
            fontSize: "var(--text-sm)",
            border: "none",
            cursor: loading ? "wait" : "pointer",
            opacity: loading || !query.trim() ? 0.6 : 1,
            transition: "opacity 150ms ease",
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "Tracking…" : "Track"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "var(--space-4)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-error-highlight)",
            color: "var(--color-error)",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}

      {/* Result card */}
      {result && (
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
          }}
        >
          {/* Header strip */}
          <div
            style={{
              background: "var(--color-primary)",
              padding: "var(--space-5) var(--space-6)",
              color: "white",
            }}
          >
            <p
              style={{
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize: "var(--text-lg)",
                letterSpacing: "0.05em",
              }}
            >
              {result.trackingNumber}
            </p>
            <p
              style={{
                fontSize: "var(--text-sm)",
                opacity: 0.85,
                marginTop: "var(--space-1)",
              }}
            >
              To: <strong>{result.recipient.name}</strong>
            </p>
            <p
              style={{
                fontSize: "var(--text-xs)",
                opacity: 0.7,
                marginTop: "var(--space-1)",
              }}
            >
              {result.recipient.address}
            </p>
          </div>

          {/* Progress */}
          <div
            style={{
              padding: "var(--space-6)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <TrackingProgressBar currentStatus={result.currentStatus} />
          </div>

          {/* Meta row */}
          <div
            style={{
              padding: "var(--space-4) var(--space-6)",
              display: "flex",
              gap: "var(--space-6)",
              flexWrap: "wrap",
              borderBottom: "1px solid var(--color-border)",
              background: "var(--color-surface-offset)",
            }}
          >
            {result.estimatedDelivery && (
              <div>
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Est. Delivery
                </p>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    marginTop: "var(--space-1)",
                  }}
                >
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
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Delivery Agent
                </p>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    marginTop: "var(--space-1)",
                  }}
                >
                  {result.assignedAgent.name}
                </p>
              </div>
            )}
          </div>

          {/* History */}
          <div style={{ padding: "var(--space-6)" }}>
            <p
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                marginBottom: "var(--space-4)",
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Tracking History
            </p>
            <TrackingHistory history={result.history} />
          </div>
        </div>
      )}
    </div>
  );
}
