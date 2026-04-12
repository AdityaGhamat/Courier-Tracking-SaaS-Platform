import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type Trend = "up" | "down" | "neutral";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: Trend;
  trendValue?: string;
  icon: React.ElementType;
  iconColor?: string;
}

export function StatCard({
  label,
  value,
  sub,
  trend,
  trendValue,
  icon: Icon,
  iconColor,
}: StatCardProps) {
  const trendColor =
    trend === "up"
      ? "var(--color-success)"
      : trend === "down"
        ? "var(--color-error)"
        : "var(--color-on-surface-variant)";

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{
        backgroundColor: "var(--color-surface-lowest)",
        boxShadow: "var(--shadow-card)",
        border: "1px solid var(--color-outline-variant)",
      }}
    >
      <div className="flex items-start justify-between">
        <p
          className="uppercase tracking-wider font-medium"
          style={{
            fontSize: "var(--text-label-md)",
            color: "var(--color-on-surface-variant)",
          }}
        >
          {label}
        </p>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: iconColor ?? "var(--color-surface-low)" }}
        >
          <Icon
            size={18}
            style={{
              color: iconColor ? "white" : "var(--color-on-surface-variant)",
            }}
          />
        </div>
      </div>

      <div>
        <p
          className="font-bold tabular-nums"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-headline-md)",
            color: "var(--color-on-surface)",
            letterSpacing: "-0.02em",
          }}
        >
          {value}
        </p>
        {sub && (
          <p
            className="mt-0.5"
            style={{
              fontSize: "var(--text-body-sm)",
              color: "var(--color-on-surface-variant)",
            }}
          >
            {sub}
          </p>
        )}
      </div>

      {trend && trendValue && (
        <div className="flex items-center gap-1.5">
          <TrendIcon size={14} style={{ color: trendColor }} />
          <span
            className="font-medium"
            style={{ fontSize: "var(--text-label-md)", color: trendColor }}
          >
            {trendValue}
          </span>
          <span
            style={{
              fontSize: "var(--text-label-md)",
              color: "var(--color-on-surface-variant)",
            }}
          >
            vs last month
          </span>
        </div>
      )}
    </div>
  );
}
