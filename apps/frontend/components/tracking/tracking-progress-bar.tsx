"use client";

import type { ShipmentStatus } from "@/types/shipment.types";

const PROGRESS_STEPS: {
  status: ShipmentStatus;
  label: string;
  short: string;
}[] = [
  { status: "label_created", label: "Label Created", short: "Label" },
  { status: "picked_up", label: "Picked Up", short: "Pickup" },
  {
    status: "at_sorting_facility",
    label: "At Sorting Facility",
    short: "Sorting",
  },
  { status: "in_transit", label: "In Transit", short: "Transit" },
  { status: "out_for_delivery", label: "Out for Delivery", short: "Out" },
  { status: "delivered", label: "Delivered", short: "Done" },
];

const TERMINAL_STATUSES: ShipmentStatus[] = [
  "failed",
  "returned",
  "retry",
  "exception",
];

const TERMINAL_META: Record<
  string,
  {
    label: string;
    colorClass: string;
    bgClass: string;
    borderClass: string;
    icon: React.ReactNode;
  }
> = {
  failed: {
    label: "Delivery Failed",
    colorClass: "text-red-600",
    bgClass: "bg-red-50",
    borderClass: "border-red-200",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
  returned: {
    label: "Returned to Sender",
    colorClass: "text-yellow-600",
    bgClass: "bg-yellow-50",
    borderClass: "border-yellow-200",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 14 4 9 9 4" />
        <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
      </svg>
    ),
  },
  retry: {
    label: "Retry Scheduled",
    colorClass: "text-yellow-600",
    bgClass: "bg-yellow-50",
    borderClass: "border-yellow-200",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
      </svg>
    ),
  },
  exception: {
    label: "Shipment Exception",
    colorClass: "text-red-600",
    bgClass: "bg-red-50",
    borderClass: "border-red-200",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
};

export function TrackingProgressBar({
  currentStatus,
}: {
  currentStatus: ShipmentStatus;
}) {
  const isTerminal = TERMINAL_STATUSES.includes(currentStatus);

  if (isTerminal) {
    const meta = TERMINAL_META[currentStatus] ?? TERMINAL_META.exception;
    return (
      <div
        className={`p-5 rounded-xl border flex items-center gap-4 shadow-sm ${meta.bgClass} ${meta.borderClass}`}
      >
        <div className={`shrink-0 ${meta.colorClass}`}>{meta.icon}</div>
        <div className="flex flex-col gap-1">
          <p className={`font-bold text-base ${meta.colorClass}`}>
            {meta.label}
          </p>
          <p className="text-sm text-slate-600">
            Please contact support or check history for details.
          </p>
        </div>
      </div>
    );
  }

  const currentIdx = PROGRESS_STEPS.findIndex(
    (s) => s.status === currentStatus,
  );
  const progressPct =
    currentIdx < 0 ? 0 : (currentIdx / (PROGRESS_STEPS.length - 1)) * 100;

  return (
    <div className="relative w-full pt-2 pb-4">
      {/* Track Base */}
      <div className="absolute top-6 left-[8.33%] right-[8.33%] h-1.5 bg-slate-200 rounded-full z-0" />

      {/* Track Fill */}
      <div
        className="absolute top-6 left-[8.33%] h-1.5 bg-[#fd761a] rounded-full z-0 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(253,118,26,0.3)]"
        style={{ width: `calc((100% - 16.66%) * ${progressPct / 100})` }}
      />

      {/* Dots Row */}
      <div className="grid grid-cols-6 relative z-10 w-full">
        {PROGRESS_STEPS.map((step, idx) => {
          const done = idx <= currentIdx;
          const active = idx === currentIdx;

          return (
            <div key={step.status} className="flex flex-col items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                  done
                    ? "bg-[#fd761a] border-2 border-[#fd761a] shadow-sm"
                    : "bg-white border-2 border-slate-300"
                } ${active ? "ring-4 ring-[#fd761a]/20 shadow-[0_0_15px_rgba(253,118,26,0.3)] scale-110" : ""}`}
              >
                {done && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span
                className={`text-[11px] sm:text-xs text-center leading-tight transition-colors ${
                  active
                    ? "font-bold text-[#fd761a]"
                    : done
                      ? "font-semibold text-slate-800"
                      : "font-medium text-slate-400"
                }`}
              >
                {step.short}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
