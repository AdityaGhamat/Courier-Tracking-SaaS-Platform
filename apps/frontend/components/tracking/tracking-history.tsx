"use client";

import type { TrackingHistoryEvent } from "@/types/tracking.types";
import type { ShipmentStatus } from "@/types/shipment.types";

const EVENT_META: Record<ShipmentStatus, { icon: string; color: string }> = {
  label_created: { icon: "🏷️", color: "var(--color-text-muted)" },
  picked_up: { icon: "📦", color: "var(--color-blue)" },
  at_sorting_facility: { icon: "🏭", color: "var(--color-gold)" },
  in_transit: { icon: "🚚", color: "var(--color-orange)" },
  out_for_delivery: { icon: "🛵", color: "var(--color-primary)" },
  delivered: { icon: "✅", color: "var(--color-success)" },
  failed: { icon: "❌", color: "var(--color-error)" },
  retry: { icon: "🔄", color: "var(--color-warning)" },
  returned: { icon: "↩️", color: "var(--color-warning)" },
  exception: { icon: "⚠️", color: "var(--color-error)" },
};

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  label_created: "Label Created",
  picked_up: "Picked Up",
  at_sorting_facility: "At Sorting Facility",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  failed: "Failed",
  retry: "Retry Scheduled",
  returned: "Returned",
  exception: "Exception",
};

interface Props {
  history: TrackingHistoryEvent[];
}

export function TrackingHistory({ history }: Props) {
  if (!history || history.length === 0) {
    return (
      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-text-muted)",
          padding: "var(--space-4) 0",
        }}
      >
        No tracking events yet.
      </p>
    );
  }

  // Already sorted desc from backend, but ensure it
  const sorted = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {sorted.map((event, idx) => {
        const meta = EVENT_META[event.status] ?? {
          icon: "•",
          color: "var(--color-text-muted)",
        };
        const isLast = idx === sorted.length - 1;

        return (
          <div
            key={`${event.status}-${event.timestamp}`}
            style={{ display: "flex", gap: "var(--space-4)" }}
          >
            {/* Spine */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "32px",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-surface-offset)",
                  border: `2px solid ${meta.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  flexShrink: 0,
                }}
              >
                {meta.icon}
              </div>
              {!isLast && (
                <div
                  style={{
                    width: "2px",
                    flexGrow: 1,
                    minHeight: "var(--space-8)",
                    background: "var(--color-divider)",
                    margin: "var(--space-1) 0",
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div
              style={{
                paddingBottom: isLast ? "0" : "var(--space-6)",
                paddingTop: "var(--space-1)",
                flex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "var(--space-2)",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "var(--text-sm)",
                    color: meta.color,
                  }}
                >
                  {STATUS_LABELS[event.status] ?? event.status}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-faint)",
                  }}
                >
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
              {event.location && (
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-muted)",
                    marginTop: "var(--space-1)",
                  }}
                >
                  📍 {event.location}
                </p>
              )}
              {event.description && (
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text)",
                    marginTop: "var(--space-1)",
                  }}
                >
                  {event.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
