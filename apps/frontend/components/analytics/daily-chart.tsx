"use client";

import { cn } from "@/lib/utils";
import type { DailyShipment } from "@/types/analytics.types";

interface Props {
  data: DailyShipment[];
  title?: string;
}

function parseLocalDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00");
}

export function DailyChart({
  data,
  title = "Daily Shipments (Last 30 Days)",
}: Props) {
  const filled = (() => {
    const map = new Map(data?.map((d) => [d.date, d.total]));
    const result: DailyShipment[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      result.push({ date: key, total: map.get(key) ?? 0 });
    }
    return result;
  })();

  const max = Math.max(...filled.map((d) => d.total), 1);
  const period = filled.reduce((s, d) => s + d.total, 0);
  const todayKey = new Date().toISOString().slice(0, 10);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">
          No data for this period.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="shrink-0 text-xs tabular-nums text-muted-foreground">
          Total:{" "}
          <span className="font-semibold text-foreground">
            {period.toLocaleString()}
          </span>
        </p>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-[3px]" style={{ height: "120px" }}>
        {/* Y-axis */}
        <div className="flex h-full flex-col justify-between pr-2 shrink-0">
          {[max, Math.round(max / 2), 0].map((v) => (
            <span
              key={v}
              className="text-[10px] tabular-nums text-muted-foreground/60 leading-none"
            >
              {v}
            </span>
          ))}
        </div>

        {/* Bars */}
        <div className="flex flex-1 items-end gap-[2px] h-full">
          {filled.map((day) => {
            const heightPct = max > 0 ? (day.total / max) * 100 : 0;
            const isToday = day.date === todayKey;
            const hasData = day.total > 0;
            return (
              <div
                key={day.date}
                title={`${day.date}: ${day.total} shipments`}
                className={cn(
                  "flex-1 rounded-t-sm transition-all duration-500 cursor-default",
                  isToday
                    ? "bg-indigo-500"
                    : "bg-indigo-200 dark:bg-indigo-900/60",
                )}
                style={{
                  height: hasData ? `${Math.max(heightPct, 4)}%` : "2px",
                  opacity: hasData ? 1 : 0.3,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between pl-7">
        {[
          filled[0],
          filled[Math.floor(filled.length / 2)],
          filled[filled.length - 1],
        ].map((d) => (
          <span key={d.date} className="text-[10px] text-muted-foreground/60">
            {parseLocalDate(d.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        ))}
      </div>
    </div>
  );
}
