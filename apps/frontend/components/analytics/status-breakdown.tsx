import { cn } from "@/lib/utils";
import type { ShipmentStats } from "@/types/analytics.types";

interface Props {
  stats: ShipmentStats & { pending?: number; outForDelivery?: number };
}

const BARS: {
  key: keyof (ShipmentStats & { pending?: number; outForDelivery?: number });
  label: string;
  bar: string;
  dot: string;
}[] = [
  {
    key: "delivered",
    label: "Delivered",
    bar: "bg-green-500",
    dot: "bg-green-500",
  },
  {
    key: "inTransit",
    label: "In Transit",
    bar: "bg-orange-400",
    dot: "bg-orange-400",
  },
  {
    key: "outForDelivery",
    label: "Out for Delivery",
    bar: "bg-indigo-500",
    dot: "bg-indigo-500",
  },
  {
    key: "pending",
    label: "Label Created",
    bar: "bg-slate-300 dark:bg-slate-600",
    dot: "bg-slate-400",
  },
  { key: "failed", label: "Failed", bar: "bg-red-500", dot: "bg-red-500" },
];

export function StatusBreakdown({ stats }: Props) {
  const total = stats.total || 1;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm font-semibold text-foreground">Status Breakdown</p>

      {/* Stacked bar */}
      <div className="flex h-2.5 overflow-hidden rounded-full gap-[2px]">
        {BARS.map((bar) => {
          const val = (stats[bar.key] as number) ?? 0;
          const pct = (val / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={bar.key}
              className={cn(
                "h-full rounded-full transition-all duration-500",
                bar.bar,
              )}
              style={{ width: `${pct}%` }}
              title={`${bar.label}: ${val}`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2.5">
        {BARS.map((bar) => {
          const val = (stats[bar.key] as number) ?? 0;
          const pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0.0";
          return (
            <div key={bar.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn("h-2.5 w-2.5 rounded-full shrink-0", bar.dot)}
                />
                <span className="text-sm text-muted-foreground">
                  {bar.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {val.toLocaleString()}
                </span>
                <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
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
