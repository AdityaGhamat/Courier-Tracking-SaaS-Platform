"use client";

import type { TrackingEvent, ShipmentStatus } from "@/types/shipment.types";

const STATUS_META: Record<
  ShipmentStatus,
  { label: string; icon: string; color: string }
> = {
  label_created: {
    label: "Label Created",
    icon: "🏷️",
    color: "var(--color-text-muted)",
  },
  picked_up: { label: "Picked Up", icon: "📦", color: "var(--color-blue)" },
  at_sorting_facility: {
    label: "At Sorting Facility",
    icon: "🏭",
    color: "var(--color-gold)",
  },
  in_transit: { label: "In Transit", icon: "🚚", color: "var(--color-orange)" },
  out_for_delivery: {
    label: "Out for Delivery",
    icon: "🛵",
    color: "var(--color-primary)",
  },
  delivered: { label: "Delivered", icon: "✅", color: "var(--color-success)" },
  failed: { label: "Failed", icon: "❌", color: "var(--color-error)" },
  retry: { label: "Retry", icon: "🔄", color: "var(--color-warning)" },
  returned: { label: "Returned", icon: "↩️", color: "var(--color-warning)" },
  exception: { label: "Exception", icon: "⚠️", color: "var(--color-error)" },
};

interface Props {
  events: TrackingEvent[];
}

export function ShipmentTimeline({ events }: Props) {
  if (!events || events.length === 0) {
    return (
      <div
        style={{
          padding: "var(--space-8)",
          textAlign: "center",
          color: "var(--color-text-muted)",
          fontSize: "var(--text-sm)",
        }}
      >
        No tracking events yet.
      </div>
    );
  }

  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      {sorted.map((event, idx) => {
        const meta = STATUS_META[event.status] ?? {
          label: event.status,
          icon: "•",
          color: "var(--color-text-muted)",
        };
        const isLast = idx === sorted.length - 1;

        return (
          <div
            key={event.id}
            style={{ display: "flex", gap: "var(--space-4)" }}
          >
            {/* Timeline spine */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexShrink: 0,
                width: "32px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-surface-offset)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  border: `2px solid ${meta.color}`,
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

            {/* Event content */}
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
                  alignItems: "center",
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
                  {meta.label}
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
                    margin: "var(--space-1) 0 0",
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
                    margin: "var(--space-1) 0 0",
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
