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

// ------------------------------------------------------------------
// Admin view
// ------------------------------------------------------------------
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

  if (error || !data) {
    return <ErrorBanner message={error ?? "No data"} />;
  }

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
      {/* KPIs */}
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
          icon="📦"
          accent="var(--color-text)"
        />
        <KpiCard
          label="Delivered"
          value={data.shipments.delivered}
          icon="✅"
          accent="var(--color-success)"
        />
        <KpiCard
          label="In Transit"
          value={data.shipments.inTransit}
          icon="🚚"
          accent="var(--color-orange)"
        />
        <KpiCard
          label="Out for Delivery"
          value={data.shipments.outForDelivery}
          icon="🛵"
          accent="var(--color-primary)"
        />
        <KpiCard
          label="Failed"
          value={data.shipments.failed}
          icon="❌"
          accent="var(--color-error)"
        />
        <KpiCard
          label="Delivery Rate"
          value={`${deliveryRate}%`}
          icon="📊"
          accent="var(--color-success)"
          sub="of all shipments delivered"
        />
        <KpiCard
          label="Agents"
          value={data.agents}
          icon="🚴"
          accent="var(--color-blue)"
        />
        <KpiCard
          label="Customers"
          value={data.customers}
          icon="👤"
          accent="var(--color-purple)"
        />
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-4)",
        }}
      >
        <DailyChart data={data.dailyShipments} />
        <StatusBreakdown stats={data.shipments} />
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Super Admin view
// ------------------------------------------------------------------
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

  if (error || !data) {
    return <ErrorBanner message={error ?? "No data"} />;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* KPIs */}
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
          icon="📦"
          accent="var(--color-text)"
        />
        <KpiCard
          label="Delivered"
          value={data.shipments.delivered}
          icon="✅"
          accent="var(--color-success)"
        />
        <KpiCard
          label="In Transit"
          value={data.shipments.inTransit}
          icon="🚚"
          accent="var(--color-orange)"
        />
        <KpiCard
          label="Failed"
          value={data.shipments.failed}
          icon="❌"
          accent="var(--color-error)"
        />
        <KpiCard
          label="Workspaces"
          value={data.workspaces}
          icon="🏢"
          accent="var(--color-blue)"
        />
        <KpiCard
          label="Total Users"
          value={data.users}
          icon="👥"
          accent="var(--color-purple)"
        />
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-4)",
        }}
      >
        <DailyChart
          data={data.dailyShipments}
          title="Platform Shipments (Last 30 Days)"
        />
        <TopWorkspaces data={data.topWorkspaces} />
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Agent view
// ------------------------------------------------------------------
async function AgentAnalyticsView() {
  let data: AgentAnalytics | null = null;
  let error: string | null = null;

  try {
    const res = await serverFetch<{ data: AgentAnalytics }>("analytics/agent");
    data = res.data;
  } catch (e: any) {
    error = e?.message ?? "Failed to load agent analytics";
  }

  if (error || !data) {
    return <ErrorBanner message={error ?? "No data"} />;
  }

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
      {/* KPIs */}
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
          icon="📦"
          accent="var(--color-text)"
        />
        <KpiCard
          label="Delivered"
          value={data.stats.delivered}
          icon="✅"
          accent="var(--color-success)"
        />
        <KpiCard
          label="Out for Delivery"
          value={data.stats.outForDelivery}
          icon="🛵"
          accent="var(--color-primary)"
        />
        <KpiCard
          label="In Transit"
          value={data.stats.inTransit}
          icon="🚚"
          accent="var(--color-orange)"
        />
        <KpiCard
          label="Failed"
          value={data.stats.failed}
          icon="❌"
          accent="var(--color-error)"
        />
        <KpiCard
          label="Success Rate"
          value={`${successRate}%`}
          icon="🎯"
          accent="var(--color-success)"
          sub="of assigned deliveries"
        />
      </div>

      {/* Weekly chart */}
      <div style={{ maxWidth: "600px" }}>
        <WeeklyActivityChart data={data.weeklyActivity} />
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Shared error banner
// ------------------------------------------------------------------
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
      }}
    >
      {message}
    </div>
  );
}

// ------------------------------------------------------------------
// Main page — role switch
// ------------------------------------------------------------------
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
