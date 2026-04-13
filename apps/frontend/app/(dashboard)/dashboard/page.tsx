import { serverFetch } from "@/lib/server-api";
import Link from "next/link";

interface ShipmentStats {
  total: number;
  delivered: number;
  pending: number;
  inTransit: number;
  outForDelivery: number;
  failed: number;
}

interface WorkspaceAnalytics {
  shipments: ShipmentStats;
  agents: number;
  customers: number;
  dailyShipments: { date: string; total: number }[];
}

async function getAnalytics(): Promise<WorkspaceAnalytics | null> {
  try {
    const res = await serverFetch<{ data: WorkspaceAnalytics }>(
      "analytics/workspace",
    );
    return res.data;
  } catch {
    return null;
  }
}

// Inline SVG icons — no lucide
const PackageIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16.5 9.4 7.55 4.24" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" y1="22" x2="12" y2="12" />
  </svg>
);
const TruckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
    <rect x="9" y="11" width="14" height="10" rx="2" />
    <circle cx="12" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const AlertIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const UsersIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const ClockIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// KPI card — clean, no colored bg, depth via surface + shadow
function KpiCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  accent: string; // a CSS color var for the icon
}) {
  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-5)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 600,
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </p>
        <span style={{ color: accent, opacity: 0.9 }}>{icon}</span>
      </div>
      <div>
        <p
          style={{
            fontSize: "var(--text-2xl)",
            fontWeight: 700,
            color: "var(--color-text)",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-faint)",
            marginTop: "var(--space-1)",
          }}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const analytics = await getAnalytics();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-8)",
      }}
    >
      {/* Header */}
      <div>
        <h1
          style={{
            fontSize: "var(--text-xl)",
            fontWeight: 700,
            color: "var(--color-text)",
          }}
        >
          Overview
        </h1>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            marginTop: "var(--space-1)",
          }}
        >
          Live snapshot of your logistics operations
        </p>
      </div>

      {/* KPI grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        <KpiCard
          label="Total Shipments"
          value={analytics?.shipments.total ?? "—"}
          sub="All time"
          icon={<PackageIcon />}
          accent="var(--color-text-muted)"
        />
        <KpiCard
          label="In Transit"
          value={
            analytics
              ? analytics.shipments.inTransit +
                analytics.shipments.outForDelivery
              : "—"
          }
          sub="Active right now"
          icon={<TruckIcon />}
          accent="var(--color-primary)"
        />
        <KpiCard
          label="Delivered"
          value={analytics?.shipments.delivered ?? "—"}
          sub="Successfully completed"
          icon={<CheckIcon />}
          accent="var(--color-success)"
        />
        <KpiCard
          label="Failed / Returned"
          value={analytics?.shipments.failed ?? "—"}
          sub="Needs attention"
          icon={<AlertIcon />}
          accent="var(--color-error)"
        />
      </div>

      {/* Agents & customers row */}
      {analytics && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          {[
            {
              label: "Delivery Agents",
              value: analytics.agents,
              icon: <UsersIcon />,
            },
            {
              label: "Customers",
              value: analytics.customers,
              icon: <UsersIcon />,
            },
            {
              label: "Pending",
              value: analytics.shipments.pending,
              icon: <ClockIcon />,
            },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-4) var(--space-5)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface-offset)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "var(--color-primary)",
                }}
              >
                {icon}
              </div>
              <div>
                <p
                  style={{
                    fontSize: "var(--text-lg)",
                    fontWeight: 700,
                    color: "var(--color-text)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {value.toLocaleString()}
                </p>
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2
          style={{
            fontSize: "var(--text-base)",
            fontWeight: 600,
            color: "var(--color-text)",
            marginBottom: "var(--space-4)",
          }}
        >
          Quick Actions
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "var(--space-3)",
          }}
        >
          {[
            {
              label: "New Shipment",
              href: "/shipments",
              icon: <PackageIcon />,
              desc: "Create and dispatch",
            },
            {
              label: "Track a Package",
              href: "/tracking",
              icon: <TruckIcon />,
              desc: "Live location updates",
            },
            {
              label: "Pending Reviews",
              href: "/shipments?status=failed",
              icon: <ClockIcon />,
              desc: "Failed & retry queue",
            },
          ].map(({ label, href, icon, desc }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-4)",
                textDecoration: "none",
                transition:
                  "box-shadow var(--transition-interactive), background var(--transition-interactive)",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface-offset)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "var(--color-primary)",
                }}
              >
                {icon}
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text)",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Error state */}
      {!analytics && (
        <div
          style={{
            padding: "var(--space-8)",
            textAlign: "center",
            border: "1px dashed var(--color-border)",
            borderRadius: "var(--radius-lg)",
            color: "var(--color-text-muted)",
          }}
        >
          <p style={{ fontSize: "var(--text-sm)" }}>
            Could not load analytics. Make sure the backend is running.
          </p>
        </div>
      )}
    </div>
  );
}
