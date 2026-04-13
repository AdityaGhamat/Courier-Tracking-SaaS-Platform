import type { TopWorkspace } from "@/types/analytics.types";

interface Props {
  data: TopWorkspace[];
}

export function TopWorkspaces({ data }: Props) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map((w) => w.total), 1);

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
        Top Workspaces by Volume
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        {data.map((w, idx) => {
          const pct = (w.total / max) * 100;
          return (
            <div key={w.workspaceId}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "var(--space-1)",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                  }}
                >
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "var(--radius-full)",
                      background:
                        idx === 0
                          ? "var(--color-gold)"
                          : "var(--color-surface-offset)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "var(--text-xs)",
                      fontWeight: 700,
                      flexShrink: 0,
                      color: idx === 0 ? "white" : "var(--color-text-muted)",
                    }}
                  >
                    {idx + 1}
                  </span>
                  {w.workspaceName ?? w.workspaceId.slice(0, 8)}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {w.total.toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  height: "6px",
                  background: "var(--color-surface-offset)",
                  borderRadius: "var(--radius-full)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    background:
                      idx === 0 ? "var(--color-gold)" : "var(--color-primary)",
                    borderRadius: "var(--radius-full)",
                    transition: "width 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
