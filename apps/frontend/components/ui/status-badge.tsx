import { Badge } from "@/components/ui/badge";

type Status =
  | "pending"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "failed";

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className:
      "bg-[var(--color-warning-container)] text-[var(--color-on-warning-container)] border-transparent",
  },
  picked_up: {
    label: "Picked Up",
    className:
      "bg-[var(--color-surface-high)] text-[var(--color-primary)] border-transparent",
  },
  in_transit: {
    label: "In Transit",
    className:
      "bg-[var(--color-tertiary-container)] text-[var(--color-on-tertiary-container)] border-transparent",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    className: "bg-[#e8f5e9] text-[var(--color-success)] border-transparent",
  },
  delivered: {
    label: "Delivered",
    className:
      "bg-[var(--color-success-container)] text-[var(--color-on-success-container)] border-transparent",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-[var(--color-error-container)] text-[var(--color-on-error-container)] border-transparent",
  },
  failed: {
    label: "Failed",
    className:
      "bg-[var(--color-error-container)] text-[var(--color-on-error-container)] border-transparent",
  },
};

export function StatusBadge({ status }: { status: Status | string }) {
  const config = STATUS_CONFIG[status as Status] ?? {
    label: status,
    className:
      "bg-[var(--color-surface-low)] text-[var(--color-on-surface-variant)] border-transparent",
  };

  return (
    <Badge className={config.className}>
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: "currentColor" }}
      />
      {config.label}
    </Badge>
  );
}
