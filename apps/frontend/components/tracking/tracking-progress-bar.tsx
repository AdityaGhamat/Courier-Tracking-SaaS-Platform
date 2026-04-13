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
  { label: string; color: string; bg: string }
> = {
  failed: {
    label: "Delivery Failed",
    color: "var(--color-error)",
    bg: "var(--color-error-highlight)",
  },
  returned: {
    label: "Returned",
    color: "var(--color-warning)",
    bg: "var(--color-warning-highlight)",
  },
  retry: {
    label: "Retry Scheduled",
    color: "var(--color-warning)",
    bg: "var(--color-warning-highlight)",
  },
  exception: {
    label: "Exception",
    color: "var(--color-error)",
    bg: "var(--color-error-highlight)",
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
          padding: "var(--space-4) var(--space-6)",
          borderRadius: "var(--radius-lg)",
          background: meta.bg,
          border: `1px solid ${meta.color}`,
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>
          {currentStatus === "returned" ? "↩️" : "⚠️"}
        </span>
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

  return (
    <div>
      {/* Step labels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${PROGRESS_STEPS.length}, 1fr)`,
          gap: "var(--space-1)",
          marginBottom: "var(--space-3)",
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
                    : "var(--color-surface-offset)",
                  border: active
                    ? "3px solid var(--color-primary)"
                    : done
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

      {/* Progress bar connector */}
      <div
        style={{
          position: "relative",
          height: "4px",
          background: "var(--color-surface-offset)",
          borderRadius: "var(--radius-full)",
          margin: "-48px var(--space-6) 0",
          zIndex: 0,
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: "var(--radius-full)",
            background: "var(--color-primary)",
            width: `${currentIdx < 0 ? 0 : (currentIdx / (PROGRESS_STEPS.length - 1)) * 100}%`,
            transition: "width 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
    </div>
  );
}
