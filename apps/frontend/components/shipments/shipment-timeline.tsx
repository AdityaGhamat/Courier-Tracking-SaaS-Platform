"use client";

import type { TrackingEvent, ShipmentStatus } from "@/types/shipment.types";

const StatusIcon = ({ status }: { status: ShipmentStatus }) => {
  const p = {
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
        <svg {...p}>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      );
    case "picked_up":
      return (
        <svg {...p}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "at_sorting_facility":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      );
    case "in_transit":
      return (
        <svg {...p}>
          <rect x="1" y="3" width="15" height="13" />
          <path d="M16 8h4l3 3v5h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      );
    case "out_for_delivery":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "delivered":
      return (
        <svg {...p}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case "failed":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    case "retry":
      return (
        <svg {...p}>
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
        </svg>
      );
    case "returned":
      return (
        <svg {...p}>
          <polyline points="9 14 4 9 9 4" />
          <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
        </svg>
      );
    case "exception":
      return (
        <svg {...p}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
  }
};

// All class strings are static so Tailwind can tree-shake correctly
const STATUS_META: Record<
  ShipmentStatus,
  { label: string; text: string; border: string }
> = {
  label_created: {
    label: "Label Created",
    text: "text-slate-500",
    border: "border-slate-400",
  },
  picked_up: {
    label: "Picked Up",
    text: "text-blue-600",
    border: "border-blue-500",
  },
  at_sorting_facility: {
    label: "At Sorting Facility",
    text: "text-yellow-600",
    border: "border-yellow-500",
  },
  in_transit: {
    label: "In Transit",
    text: "text-orange-600",
    border: "border-orange-500",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    text: "text-indigo-600",
    border: "border-indigo-500",
  },
  delivered: {
    label: "Delivered",
    text: "text-green-600",
    border: "border-green-500",
  },
  failed: { label: "Failed", text: "text-red-600", border: "border-red-500" },
  retry: { label: "Retry", text: "text-amber-600", border: "border-amber-500" },
  returned: {
    label: "Returned",
    text: "text-amber-600",
    border: "border-amber-500",
  },
  exception: {
    label: "Exception",
    text: "text-red-600",
    border: "border-red-500",
  },
};

interface Props {
  events: TrackingEvent[];
}

export function ShipmentTimeline({ events }: Props) {
  if (!events || events.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        No tracking events yet.
      </div>
    );
  }

  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div className="flex flex-col">
      {sorted.map((event, idx) => {
        const meta = STATUS_META[event.status] ?? {
          label: event.status,
          text: "text-slate-500",
          border: "border-slate-400",
        };
        const isLast = idx === sorted.length - 1;

        return (
          <div key={event.id} className="flex gap-4">
            {/* Spine */}
            <div className="flex flex-col items-center shrink-0 w-8">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 bg-slate-50 ${meta.text} ${meta.border}`}
              >
                <StatusIcon status={event.status} />
              </div>
              {!isLast && (
                <div className="w-0.5 grow min-h-[2rem] bg-slate-200 my-1" />
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 pt-1 ${isLast ? "pb-0" : "pb-6"}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-semibold text-sm ${meta.text}`}>
                  {meta.label}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
              {event.location && (
                <p className="text-sm text-muted-foreground mt-1">
                  {event.location}
                </p>
              )}
              {event.description && (
                <p className="text-sm text-foreground mt-1">
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
