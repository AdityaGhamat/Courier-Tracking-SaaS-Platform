"use client";

import type { TrackingEvent, ShipmentStatus } from "@/types/shipment.types";

const StatusIcon = ({ status }: { status: ShipmentStatus }) => {
  const props = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (status) {
    case "label_created":
      return (
        <svg {...props}>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      );
    case "picked_up":
      return (
        <svg {...props}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "at_sorting_facility":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      );
    case "in_transit":
      return (
        <svg {...props}>
          <rect x="1" y="3" width="15" height="13" />
          <path d="M16 8h4l3 3v5h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      );
    case "out_for_delivery":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "delivered":
      return (
        <svg {...props}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case "failed":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    case "retry":
      return (
        <svg {...props}>
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
        </svg>
      );
    case "returned":
      return (
        <svg {...props}>
          <polyline points="9 14 4 9 9 4" />
          <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
        </svg>
      );
    case "exception":
      return (
        <svg {...props}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
  }
};

const STATUS_META: Record<ShipmentStatus, { label: string; color: string }> = {
  label_created: { label: "Label Created", color: "var(--color-text-muted)" },
  picked_up: { label: "Picked Up", color: "var(--color-blue)" },
  at_sorting_facility: {
    label: "At Sorting Facility",
    color: "var(--color-gold)",
  },
  in_transit: { label: "In Transit", color: "var(--color-orange)" },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "var(--color-primary)",
  },
  delivered: { label: "Delivered", color: "var(--color-success)" },
  failed: { label: "Failed", color: "var(--color-error)" },
  retry: { label: "Retry", color: "var(--color-warning)" },
  returned: { label: "Returned", color: "var(--color-warning)" },
  exception: { label: "Exception", color: "var(--color-error)" },
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
    <div style={{ display: "flex", flexDirection: "column" }}>
      {sorted.map((event, idx) => {
        const meta = STATUS_META[event.status] ?? {
          label: event.status,
          color: "var(--color-text-muted)",
        };
        const isLast = idx === sorted.length - 1;

        return (
          <div
            key={event.id}
            style={{ display: "flex", gap: "var(--space-4)" }}
          >
            {/* Spine */}
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
                  border: `2px solid ${meta.color}`,
                  color: meta.color,
                  flexShrink: 0,
                }}
              >
                <StatusIcon status={event.status} />
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
                    fontVariantNumeric: "tabular-nums",
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
                  {event.location}
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
