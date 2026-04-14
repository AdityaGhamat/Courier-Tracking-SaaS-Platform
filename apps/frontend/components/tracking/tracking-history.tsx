"use client";

import type { TrackingHistoryEvent } from "@/types/tracking.types";
import type { ShipmentStatus } from "@/types/shipment.types";

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
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <line x1="12" y1="12" x2="12" y2="16" />
          <line x1="10" y1="14" x2="14" y2="14" />
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
    case "exception":
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
    default:
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
  }
};

const EVENT_META: Record<ShipmentStatus, string> = {
  label_created: "text-slate-500 border-slate-200 bg-slate-50",
  picked_up: "text-indigo-600 border-indigo-200 bg-indigo-50",
  at_sorting_facility: "text-yellow-600 border-yellow-200 bg-yellow-50",
  in_transit: "text-orange-500 border-orange-200 bg-orange-50",
  out_for_delivery: "text-[#fd761a] border-[#fd761a]/30 bg-[#fd761a]/10",
  delivered: "text-green-600 border-green-200 bg-green-50",
  failed: "text-red-600 border-red-200 bg-red-50",
  retry: "text-yellow-600 border-yellow-200 bg-yellow-50",
  returned: "text-yellow-600 border-yellow-200 bg-yellow-50",
  exception: "text-red-600 border-red-200 bg-red-50",
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

export function TrackingHistory({
  history,
}: {
  history: TrackingHistoryEvent[];
}) {
  if (!history || history.length === 0) {
    return (
      <p className="text-sm text-slate-500 py-4 italic">
        No tracking events recorded yet.
      </p>
    );
  }

  const sorted = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div className="flex flex-col w-full">
      {sorted.map((event, idx) => {
        const metaClass =
          EVENT_META[event.status] ??
          "text-slate-500 border-slate-200 bg-slate-50";
        const isLast = idx === sorted.length - 1;

        return (
          <div
            key={`${event.status}-${event.timestamp}`}
            className="flex gap-5 w-full"
          >
            {/* Spine Container */}
            <div className="flex flex-col items-center w-8 shrink-0">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 shadow-sm ${metaClass}`}
              >
                <StatusIcon status={event.status} />
              </div>
              {!isLast && (
                <div className="w-0.5 grow min-h-[32px] bg-slate-200 my-2 rounded-full" />
              )}
            </div>

            {/* Content Container */}
            <div className={`flex-1 min-w-0 pt-1 ${isLast ? "pb-2" : "pb-8"}`}>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 flex-wrap mb-1.5">
                <span
                  className={`font-bold text-[15px] ${metaClass.split(" ")[0]}`}
                >
                  {STATUS_LABELS[event.status] ?? event.status}
                </span>
                <span className="text-[13px] text-slate-500 font-medium tabular-nums">
                  {new Date(event.timestamp).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              {event.location && (
                <p className="text-sm text-slate-500 flex items-start gap-1.5 mt-2">
                  <svg
                    className="w-4 h-4 text-slate-400 mt-0.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                    />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="break-words leading-snug">
                    {event.location}
                  </span>
                </p>
              )}

              {event.description && (
                <p className="text-sm text-slate-700 mt-2 font-medium break-words leading-relaxed border-l-2 border-slate-200 pl-3">
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
