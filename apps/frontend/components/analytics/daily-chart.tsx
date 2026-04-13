"use client";

import type { DailyShipment } from "@/types/analytics.types";

interface Props {
  data: DailyShipment[];
  title?: string;
}

// Fixes the UTC-midnight timezone bug: "2026-04-13" → local Apr 13, not Apr 12
function parseLocalDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00");
}

export function DailyChart({
  data,
  title = "Daily Shipments (Last 30 Days)",
}: Props) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-5) var(--space-6)",
        }}
      >
        <p
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            marginBottom: "var(--space-4)",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
          }}
        >
          No data for this period.
        </p>
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.total), 1);

  const filled = (() => {
    const map = new Map(data.map((d) => [d.date, d.total]));
    const result: DailyShipment[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      result.push({ date: key, total: map.get(key) ?? 0 });
    }
    return result;
  })();

  const todayKey = new Date().toISOString().slice(0, 10);

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
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
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
          {title}
        </p>
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-faint)",
            flexShrink: 0,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          Total: {data.reduce((s, d) => s + d.total, 0).toLocaleString()}
        </p>
      </div>

      {/* Y-axis + bars */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-2)",
          alignItems: "flex-end",
          height: "120px",
        }}
      >
        {/* Y labels */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            alignItems: "flex-end",
            flexShrink: 0,
          }}
        >
          {[max, Math.round(max / 2), 0].map((v) => (
            <span
              key={v}
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-faint)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {v}
            </span>
          ))}
        </div>

        {/* Bars */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-end",
            gap: "2px",
            height: "100%",
            paddingLeft: "var(--space-2)",
          }}
        >
          {filled.map((day) => {
            const heightPct = max > 0 ? (day.total / max) * 100 : 0;
            const isToday = day.date === todayKey;
            return (
              <div
                key={day.date}
                title={`${day.date}: ${day.total} shipments`}
                style={{
                  flex: 1,
                  height: `${Math.max(heightPct, day.total > 0 ? 4 : 0)}%`,
                  minHeight: day.total > 0 ? "4px" : "0",
                  background: isToday
                    ? "var(--color-primary)"
                    : "var(--color-primary-highlight)",
                  borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
                  transition: "height 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "default",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* X-axis — first, middle, last */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: "28px",
        }}
      >
        {[
          filled[0],
          filled[Math.floor(filled.length / 2)],
          filled[filled.length - 1],
        ].map((d) => (
          <span
            key={d.date}
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-faint)",
            }}
          >
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
