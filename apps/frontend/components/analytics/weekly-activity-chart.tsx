"use client";

import type { WeeklyActivity } from "@/types/analytics.types";

interface Props {
  data: WeeklyActivity[];
}

function parseLocalDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00");
}

export function WeeklyActivityChart({ data }: Props) {
  const filled = (() => {
    const map = new Map(data?.map((d) => [d.date, d]));
    const result: WeeklyActivity[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      result.push(map.get(key) ?? { date: key, delivered: 0, failed: 0 });
    }
    return result;
  })();

  const max = Math.max(...filled.flatMap((d) => [d.delivered, d.failed]), 1);
  const totalDelivered = filled.reduce((s, d) => s + d.delivered, 0);
  const totalFailed = filled.reduce((s, d) => s + d.failed, 0);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm font-semibold text-foreground">Weekly Activity</p>
        <p className="text-sm text-muted-foreground">
          No activity in the last 7 days.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">Weekly Activity</p>
        <div className="flex gap-4">
          {[
            {
              label: "Delivered",
              color: "bg-green-500",
              count: totalDelivered,
            },
            { label: "Failed", color: "bg-red-400", count: totalFailed },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-sm ${l.color}`} />
              <span className="text-xs text-muted-foreground">{l.label}</span>
              <span className="text-xs font-semibold tabular-nums text-foreground">
                {l.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-3" style={{ height: "100px" }}>
        {filled.map((day) => {
          const dH = max > 0 ? (day.delivered / max) * 100 : 0;
          const fH = max > 0 ? (day.failed / max) * 100 : 0;
          const label = parseLocalDate(day.date).toLocaleDateString(undefined, {
            weekday: "short",
          });

          return (
            <div
              key={day.date}
              className="flex flex-1 flex-col items-center gap-1 h-full"
            >
              <div className="flex flex-1 w-full items-end gap-[2px]">
                <div
                  title={`Delivered: ${day.delivered}`}
                  className="flex-1 rounded-t-sm bg-green-500 transition-all duration-500"
                  style={{
                    height: day.delivered > 0 ? `${Math.max(dH, 4)}%` : "2px",
                    opacity: day.delivered > 0 ? 1 : 0.2,
                  }}
                />
                <div
                  title={`Failed: ${day.failed}`}
                  className="flex-1 rounded-t-sm bg-red-400 transition-all duration-500"
                  style={{
                    height: day.failed > 0 ? `${Math.max(fH, 4)}%` : "2px",
                    opacity: day.failed > 0 ? 0.8 : 0.15,
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground/70">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
