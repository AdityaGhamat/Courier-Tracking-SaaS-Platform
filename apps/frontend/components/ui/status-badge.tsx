type ShipmentStatus =
  | "label_created"
  | "picked_up"
  | "at_sorting_facility"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "retry"
  | "returned"
  | "exception"
  // legacy aliases kept for safety
  | "pending"
  | "cancelled";

const STATUS_CONFIG: Record<
  ShipmentStatus,
  { label: string; bg: string; color: string }
> = {
  label_created: {
    label: "Label Created",
    bg: "var(--color-surface-offset)",
    color: "var(--color-text-muted)",
  },
  pending: {
    label: "Pending",
    bg: "var(--color-gold-highlight)",
    color: "var(--color-gold)",
  },
  picked_up: {
    label: "Picked Up",
    bg: "var(--color-blue-highlight)",
    color: "var(--color-blue)",
  },
  at_sorting_facility: {
    label: "At Facility",
    bg: "var(--color-gold-highlight)",
    color: "var(--color-gold)",
  },
  in_transit: {
    label: "In Transit",
    bg: "var(--color-orange-highlight)",
    color: "var(--color-orange)",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    bg: "var(--color-primary-highlight)",
    color: "var(--color-primary)",
  },
  delivered: {
    label: "Delivered",
    bg: "var(--color-success-highlight)",
    color: "var(--color-success)",
  },
  failed: {
    label: "Failed",
    bg: "var(--color-error-highlight)",
    color: "var(--color-error)",
  },
  retry: {
    label: "Retry",
    bg: "var(--color-warning-highlight)",
    color: "var(--color-warning)",
  },
  returned: {
    label: "Returned",
    bg: "var(--color-warning-highlight)",
    color: "var(--color-warning)",
  },
  exception: {
    label: "Exception",
    bg: "var(--color-error-highlight)",
    color: "var(--color-error)",
  },
  cancelled: {
    label: "Cancelled",
    bg: "var(--color-error-highlight)",
    color: "var(--color-error)",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as ShipmentStatus] ?? {
    label: status,
    bg: "var(--color-surface-offset)",
    color: "var(--color-text-muted)",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)",
        padding: "2px var(--space-2)",
        borderRadius: "var(--radius-full)",
        fontSize: "var(--text-xs)",
        fontWeight: 600,
        background: config.bg,
        color: config.color,
        whiteSpace: "nowrap",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "currentColor",
          flexShrink: 0,
        }}
      />
      {config.label}
    </span>
  );
}
