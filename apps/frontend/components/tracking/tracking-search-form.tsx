"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { TrackingProgressBar } from "./tracking-progress-bar";
import { TrackingHistory } from "./tracking-history";
import type { TrackingResult } from "@/types/tracking.types";

interface Props {
  initialQuery?: string;
}

export function TrackingSearchForm({ initialQuery = "" }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchTracking(trackingNumber: string) {
    const q = trackingNumber.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setResult(null);

    // Sync to URL so the page is shareable
    router.replace(`${pathname}?q=${encodeURIComponent(q)}`, { scroll: false });

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

  // Auto-fetch when a deep-link query is present
  useEffect(() => {
    if (initialQuery) {
      fetchTracking(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchTracking(query);
  }

  function handleClear() {
    setQuery("");
    setResult(null);
    setError(null);
    router.replace(pathname, { scroll: false });
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
        <div style={{ position: "relative", flex: 1 }}>
          <input
            type="text"
            placeholder="e.g. TRK-A1B2C3"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "var(--space-3) var(--space-4)",
              paddingRight: query ? "var(--space-10)" : "var(--space-4)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              color: "var(--color-text)",
              fontSize: "var(--text-base)",
              outline: "none",
              fontFamily: "monospace",
              transition: "border-color 150ms ease, box-shadow 150ms ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--color-primary)";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px var(--color-primary-highlight)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
            autoFocus={!initialQuery}
          />
          {/* Clear button inside input */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              style={{
                position: "absolute",
                right: "var(--space-3)",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-muted)",
                display: "flex",
                alignItems: "center",
                padding: "var(--space-1)",
                borderRadius: "var(--radius-full)",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

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
            transition: "opacity 150ms ease, background 150ms ease",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          {loading ? (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{ animation: "spin 0.8s linear infinite" }}
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Tracking…
            </>
          ) : (
            "Track"
          )}
        </button>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Error */}
      {error && (
        <div
          role="alert"
          style={{
            padding: "var(--space-4)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-error-highlight)",
            color: "var(--color-error)",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            display: "flex",
            gap: "var(--space-2)",
            alignItems: "flex-start",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ flexShrink: 0, marginTop: "1px" }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "var(--color-surface-offset)",
              padding: "var(--space-5) var(--space-6)",
            }}
          >
            <div
              className="skeleton skeleton-heading"
              style={{
                width: "40%",
                height: "1.25em",
                borderRadius: "4px",
                marginBottom: "var(--space-2)",
              }}
            />
            <div
              className="skeleton skeleton-text"
              style={{ width: "60%", height: "0.875em", borderRadius: "4px" }}
            />
          </div>
          <div style={{ padding: "var(--space-6)" }}>
            <div
              className="skeleton"
              style={{
                height: "60px",
                borderRadius: "var(--radius-md)",
                marginBottom: "var(--space-6)",
              }}
            />
            <div
              className="skeleton skeleton-text"
              style={{
                width: "100%",
                height: "1em",
                borderRadius: "4px",
                marginBottom: "var(--space-3)",
              }}
            />
            <div
              className="skeleton skeleton-text"
              style={{
                width: "80%",
                height: "1em",
                borderRadius: "4px",
                marginBottom: "var(--space-3)",
              }}
            />
            <div
              className="skeleton skeleton-text"
              style={{ width: "65%", height: "1em", borderRadius: "4px" }}
            />
          </div>
          <style>{`
            @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
            .skeleton {
              background: linear-gradient(90deg, var(--color-surface-offset) 25%, var(--color-surface-dynamic) 50%, var(--color-surface-offset) 75%);
              background-size: 200% 100%;
              animation: shimmer 1.5s ease-in-out infinite;
            }
          `}</style>
        </div>
      )}

      {/* Result card */}
      {result && !loading && (
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
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {new Date(result.estimatedDelivery).toLocaleDateString(
                    undefined,
                    { weekday: "short", month: "short", day: "numeric" },
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
            {/* Share button */}
            <div style={{ marginLeft: "auto" }}>
              <button
                type="button"
                onClick={() => {
                  const url = `${window.location.origin}/track?q=${encodeURIComponent(result.trackingNumber)}`;
                  navigator.clipboard?.writeText(url);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                  padding: "var(--space-1) var(--space-2)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  background: "transparent",
                  cursor: "pointer",
                }}
                title="Copy tracking link"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                Share
              </button>
            </div>
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
