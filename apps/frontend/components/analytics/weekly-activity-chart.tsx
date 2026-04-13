"use client";

import type { WeeklyActivity } from "@/types/analytics.types";

interface Props {
  data: WeeklyActivity[];
}

// Fixes UTC-midnight timezone bug
function parseLocalDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00");
}

export function WeeklyActivityChart({ data }: Props) {
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
          Weekly Activity
        </p>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
          }}
        >
          No activity in the last 7 days.
        </p>
      </div>
    );
  }

  const filled = (() => {
    const map = new Map(data.map((d) => [d.date, d]));
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
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-2)",
        }}
      >
        <p style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>
          Weekly Activity
        </p>
        <div style={{ display: "flex", gap: "var(--space-4)" }}>
          {[
            {
              label: "Delivered",
              color: "var(--color-success)",
              count: totalDelivered,
            },
            {
              label: "Failed",
              color: "var(--color-error)",
              count: totalFailed,
            },
          ].map((l) => (
            <div
              key={l.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-1)",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "2px",
                  background: l.color,
                }}
              />
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                }}
              >
                {l.label}
              </span>
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text)",
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {l.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bars */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-3)",
          alignItems: "flex-end",
          height: "100px",
        }}
      >
        {filled.map((day) => {
          const deliveredH = (day.delivered / max) * 100;
          const failedH = (day.failed / max) * 100;
          // ✅ Fixed: parseLocalDate so Mon/Apr-12 doesn't show as Sun/Apr-11
          const label = parseLocalDate(day.date).toLocaleDateString(undefined, {
            weekday: "short",
          });
          return (
            <div
              key={day.date}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--space-1)",
                height: "100%",
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "2px",
                  width: "100%",
                }}
              >
                <div
                  title={`Delivered: ${day.delivered}`}
                  style={{
                    flex: 1,
                    height: `${Math.max(deliveredH, day.delivered > 0 ? 4 : 0)}%`,
                    background: "var(--color-success)",
                    borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
                    transition: "height 400ms ease",
                  }}
                />
                <div
                  title={`Failed: ${day.failed}`}
                  style={{
                    flex: 1,
                    height: `${Math.max(failedH, day.failed > 0 ? 4 : 0)}%`,
                    background: "var(--color-error)",
                    borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
                    transition: "height 400ms ease",
                    opacity: 0.75,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-faint)",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
