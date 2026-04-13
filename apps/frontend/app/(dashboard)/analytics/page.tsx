import { serverFetch } from "@/lib/server-api";
import { getSessionUser } from "@/lib/session";
import { KpiCard } from "@/components/analytics/kpi-card";
import { StatusBreakdown } from "@/components/analytics/status-breakdown";
import { DailyChart } from "@/components/analytics/daily-chart";
import { WeeklyActivityChart } from "@/components/analytics/weekly-activity-chart";
import { TopWorkspaces } from "@/components/analytics/top-workspaces";
import type {
  WorkspaceAnalytics,
  PlatformAnalytics,
  AgentAnalytics,
} from "@/types/analytics.types";

// ── SVG icon helpers ─────────────────────────────────────────────
const s = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Icons = {
  Package: (
    <svg {...s}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  Check: (
    <svg {...s}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Truck: (
    <svg {...s}>
      <rect x="1" y="3" width="15" height="13" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  Delivery: (
    <svg {...s}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  XCircle: (
    <svg {...s}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  BarChart: (
    <svg {...s}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  Agent: (
    <svg {...s}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  Users: (
    <svg {...s}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Building: (
    <svg {...s}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
    </svg>
  ),
  Target: (
    <svg {...s}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
};

// ── Shared error banner ──────────────────────────────────────────
function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: "var(--space-4)",
        borderRadius: "var(--radius-md)",
        background: "var(--color-error-highlight)",
        color: "var(--color-error)",
        fontSize: "var(--text-sm)",
        fontWeight: 500,
        display: "flex",
        gap: "var(--space-2)",
        alignItems: "center",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {message}
    </div>
  );
}

// ── Responsive chart grid ────────────────────────────────────────
const chartGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "var(--space-4)",
};

// ── Admin view ──────────────────────────────────────────────────
async function AdminAnalytics() {
  let data: WorkspaceAnalytics | null = null;
  let error: string | null = null;

  try {
    const res = await serverFetch<{ data: WorkspaceAnalytics }>(
      "analytics/workspace",
    );
    data = res.data;
  } catch (e: any) {
    error = e?.message ?? "Failed to load analytics";
  }

  if (error || !data) return <ErrorBanner message={error ?? "No data"} />;

  const deliveryRate =
    data.shipments.total > 0
      ? ((data.shipments.delivered / data.shipments.total) * 100).toFixed(1)
      : "0.0";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        <KpiCard
          label="Total Shipments"
          value={data.shipments.total}
          icon={Icons.Package}
          accent="var(--color-text)"
        />
        <KpiCard
          label="Delivered"
          value={data.shipments.delivered}
          icon={Icons.Check}
          accent="var(--color-success)"
        />
        <KpiCard
          label="In Transit"
          value={data.shipments.inTransit}
          icon={Icons.Truck}
          accent="var(--color-orange)"
        />
        <KpiCard
          label="Out for Delivery"
          value={data.shipments.outForDelivery}
          icon={Icons.Delivery}
          accent="var(--color-primary)"
        />
        <KpiCard
          label="Failed"
          value={data.shipments.failed}
          icon={Icons.XCircle}
          accent="var(--color-error)"
        />
        <KpiCard
          label="Delivery Rate"
          value={`${deliveryRate}%`}
          icon={Icons.BarChart}
          accent="var(--color-success)"
          sub="of all shipments delivered"
        />
        <KpiCard
          label="Agents"
          value={data.agents}
          icon={Icons.Agent}
          accent="var(--color-blue)"
        />
        <KpiCard
          label="Customers"
          value={data.customers}
          icon={Icons.Users}
          accent="var(--color-purple)"
        />
      </div>

      <div style={chartGridStyle}>
        <DailyChart data={data.dailyShipments} />
        <StatusBreakdown stats={data.shipments} />
      </div>
    </div>
  );
}

// ── Super Admin view ────────────────────────────────────────────
async function SuperAdminAnalytics() {
  let data: PlatformAnalytics | null = null;
  let error: string | null = null;

  try {
    const res = await serverFetch<{ data: PlatformAnalytics }>(
      "analytics/platform",
    );
    data = res.data;
  } catch (e: any) {
    error = e?.message ?? "Failed to load platform analytics";
  }

  if (error || !data) return <ErrorBanner message={error ?? "No data"} />;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        <KpiCard
          label="Total Shipments"
          value={data.shipments.total}
          icon={Icons.Package}
          accent="var(--color-text)"
        />
        <KpiCard
          label="Delivered"
          value={data.shipments.delivered}
          icon={Icons.Check}
          accent="var(--color-success)"
        />
        <KpiCard
          label="In Transit"
          value={data.shipments.inTransit}
          icon={Icons.Truck}
          accent="var(--color-orange)"
        />
        <KpiCard
          label="Failed"
          value={data.shipments.failed}
          icon={Icons.XCircle}
          accent="var(--color-error)"
        />
        <KpiCard
          label="Workspaces"
          value={data.workspaces}
          icon={Icons.Building}
          accent="var(--color-blue)"
        />
        <KpiCard
          label="Total Users"
          value={data.users}
          icon={Icons.Users}
          accent="var(--color-purple)"
        />
      </div>

      <div style={chartGridStyle}>
        <DailyChart
          data={data.dailyShipments}
          title="Platform Shipments (Last 30 Days)"
        />
        <TopWorkspaces data={data.topWorkspaces} />
      </div>
    </div>
  );
}

// ── Agent view ──────────────────────────────────────────────────
async function AgentAnalyticsView() {
  let data: AgentAnalytics | null = null;
  let error: string | null = null;

  try {
    const res = await serverFetch<{ data: AgentAnalytics }>("analytics/agent");
    data = res.data;
  } catch (e: any) {
    error = e?.message ?? "Failed to load agent analytics";
  }

  if (error || !data) return <ErrorBanner message={error ?? "No data"} />;

  const successRate =
    data.stats.total > 0
      ? ((data.stats.delivered / data.stats.total) * 100).toFixed(1)
      : "0.0";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        <KpiCard
          label="Assigned Total"
          value={data.stats.total}
          icon={Icons.Package}
          accent="var(--color-text)"
        />
        <KpiCard
          label="Delivered"
          value={data.stats.delivered}
          icon={Icons.Check}
          accent="var(--color-success)"
        />
        <KpiCard
          label="Out for Delivery"
          value={data.stats.outForDelivery}
          icon={Icons.Delivery}
          accent="var(--color-primary)"
        />
        <KpiCard
          label="In Transit"
          value={data.stats.inTransit}
          icon={Icons.Truck}
          accent="var(--color-orange)"
        />
        <KpiCard
          label="Failed"
          value={data.stats.failed}
          icon={Icons.XCircle}
          accent="var(--color-error)"
        />
        <KpiCard
          label="Success Rate"
          value={`${successRate}%`}
          icon={Icons.Target}
          accent="var(--color-success)"
          sub="of assigned deliveries"
        />
      </div>

      <div style={{ maxWidth: "600px" }}>
        <WeeklyActivityChart data={data.weeklyActivity} />
      </div>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────
export default async function AnalyticsPage() {
  const user = await getSessionUser();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "var(--text-xl)",
            fontWeight: 700,
            color: "var(--color-text)",
          }}
        >
          Analytics
        </h1>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            marginTop: "var(--space-1)",
          }}
        >
          {user?.role === "super_admin"
            ? "Platform-wide overview"
            : user?.role === "delivery_agent"
              ? "Your personal delivery stats"
              : "Workspace performance dashboard"}
        </p>
      </div>

      {user?.role === "super_admin" && <SuperAdminAnalytics />}
      {user?.role === "admin" && <AdminAnalytics />}
      {user?.role === "delivery_agent" && <AgentAnalyticsView />}

      {!["super_admin", "admin", "delivery_agent"].includes(
        user?.role ?? "",
      ) && (
        <div
          style={{
            padding: "var(--space-8)",
            textAlign: "center",
            color: "var(--color-text-muted)",
            fontSize: "var(--text-sm)",
          }}
        >
          Analytics are not available for your role.
        </div>
      )}
    </div>
  );
}
