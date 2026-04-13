interface KpiCardProps {
  label: string;
  value: number | string;
  sub?: string;
  accent?: string;
  icon?: string;
}

export function KpiCard({ label, value, sub, accent, icon }: KpiCardProps) {
  const color = accent ?? "var(--color-primary)";

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-5) var(--space-6)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: 600,
          }}
        >
          {label}
        </p>
        {icon && <span style={{ fontSize: "1.25rem" }}>{icon}</span>}
      </div>

      <p
        style={{
          fontSize: "var(--text-2xl)",
          fontWeight: 800,
          color,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>

      {sub && (
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-faint)",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
