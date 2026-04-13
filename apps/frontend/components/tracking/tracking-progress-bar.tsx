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
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  failed: {
    label: "Delivery Failed",
    color: "var(--color-error)",
    bg: "var(--color-error-highlight)",
    icon: (
      <svg
        width="20"
        height="20"
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
    color: "var(--color-warning)",
    bg: "var(--color-warning-highlight)",
    icon: (
      <svg
        width="20"
        height="20"
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
    color: "var(--color-warning)",
    bg: "var(--color-warning-highlight)",
    icon: (
      <svg
        width="20"
        height="20"
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
    color: "var(--color-error)",
    bg: "var(--color-error-highlight)",
    icon: (
      <svg
        width="20"
        height="20"
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

interface Props {
  currentStatus: ShipmentStatus;
}

export function TrackingProgressBar({ currentStatus }: Props) {
  const isTerminal = TERMINAL_STATUSES.includes(currentStatus);

  if (isTerminal) {
    const meta = TERMINAL_META[currentStatus] ?? TERMINAL_META.exception;
    return (
      <div
        style={{
          padding: "var(--space-4) var(--space-5)",
          borderRadius: "var(--radius-lg)",
          background: meta.bg,
          border: `1px solid ${meta.color}`,
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
          color: meta.color,
        }}
      >
        <div style={{ flexShrink: 0 }}>{meta.icon}</div>
        <div>
          <p
            style={{
              fontWeight: 700,
              fontSize: "var(--text-base)",
              color: meta.color,
            }}
          >
            {meta.label}
          </p>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-muted)",
              marginTop: "var(--space-1)",
            }}
          >
            Please contact support for further assistance.
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
    <div>
      {/*
        Layout strategy:
        1. Render the connector bar FIRST in DOM, absolutely positioned
           in the middle of the dot row height (14px = half of 28px dot).
        2. Render dots on top with position:relative + z-index:1.
        No negative margins — no mobile breakage.
      */}
      <div style={{ position: "relative" }}>
        {/* Track (background) */}
        <div
          style={{
            position: "absolute",
            top: "13px" /* half of 28px dot height */,
            left: "calc(100% / (2 * 6))" /* center of first dot */,
            right: "calc(100% / (2 * 6))" /* center of last dot */,
            height: "4px",
            background: "var(--color-surface-offset)",
            borderRadius: "var(--radius-full)",
            zIndex: 0,
          }}
        />
        {/* Fill */}
        <div
          style={{
            position: "absolute",
            top: "13px",
            left: "calc(100% / (2 * 6))",
            height: "4px",
            width: `calc((100% - 100% / (2 * 6) * 2) * ${progressPct / 100})`,
            background: "var(--color-primary)",
            borderRadius: "var(--radius-full)",
            zIndex: 0,
            transition: "width 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Dots row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${PROGRESS_STEPS.length}, 1fr)`,
            position: "relative",
            zIndex: 1,
          }}
        >
          {PROGRESS_STEPS.map((step, idx) => {
            const done = idx <= currentIdx;
            const active = idx === currentIdx;
            return (
              <div
                key={step.status}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "var(--space-2)",
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "var(--radius-full)",
                    background: done
                      ? "var(--color-primary)"
                      : "var(--color-bg)",
                    border: done
                      ? "3px solid var(--color-primary)"
                      : "2px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 200ms ease",
                    flexShrink: 0,
                    boxShadow: active
                      ? "0 0 0 4px var(--color-primary-highlight)"
                      : "none",
                  }}
                >
                  {done && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                {/* Label */}
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: active ? 700 : done ? 500 : 400,
                    color: active
                      ? "var(--color-primary)"
                      : done
                        ? "var(--color-text)"
                        : "var(--color-text-faint)",
                    textAlign: "center",
                    lineHeight: 1.2,
                  }}
                >
                  {step.short}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
