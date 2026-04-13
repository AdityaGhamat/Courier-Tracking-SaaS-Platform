import type { ShipmentStats } from "@/types/analytics.types";

interface Props {
  stats: ShipmentStats & { pending?: number; outForDelivery?: number };
}

const BARS: {
  key: keyof (ShipmentStats & { pending?: number; outForDelivery?: number });
  label: string;
  color: string;
}[] = [
  { key: "delivered", label: "Delivered", color: "var(--color-success)" },
  { key: "inTransit", label: "In Transit", color: "var(--color-orange)" },
  {
    key: "outForDelivery",
    label: "Out for Delivery",
    color: "var(--color-primary)",
  },
  { key: "pending", label: "Label Created", color: "var(--color-text-faint)" },
  { key: "failed", label: "Failed", color: "var(--color-error)" },
];

export function StatusBreakdown({ stats }: Props) {
  const total = stats.total || 1; // avoid divide-by-zero

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-5) var(--space-6)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
      }}
    >
      <p
        style={{
          fontSize: "var(--text-sm)",
          fontWeight: 600,
          color: "var(--color-text)",
        }}
      >
        Status Breakdown
      </p>

      {/* Stacked bar */}
      <div
        style={{
          display: "flex",
          height: "10px",
          borderRadius: "var(--radius-full)",
          overflow: "hidden",
          gap: "2px",
        }}
      >
        {BARS.map((bar) => {
          const val = (stats[bar.key] as number) ?? 0;
          const pct = (val / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={bar.key}
              style={{
                height: "100%",
                width: `${pct}%`,
                background: bar.color,
                borderRadius: "var(--radius-full)",
                transition: "width 400ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              title={`${bar.label}: ${val}`}
            />
          );
        })}
      </div>

      {/* Legend rows */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        {BARS.map((bar) => {
          const val = (stats[bar.key] as number) ?? 0;
          const pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0.0";
          return (
            <div
              key={bar.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "var(--radius-full)",
                    background: bar.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {bar.label}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "var(--color-text)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {val.toLocaleString()}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-faint)",
                    width: "40px",
                    textAlign: "right",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
