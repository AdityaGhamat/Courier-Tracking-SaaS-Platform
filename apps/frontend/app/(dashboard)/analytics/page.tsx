import { serverFetch } from "@/lib/server-api";
import { getSessionUser } from "@/lib/session";
import { KpiCard } from "@/components/analytics/kpi-card";
import { StatusBreakdown } from "@/components/analytics/status-breakdown";
import { DailyChart } from "@/components/analytics/daily-chart";
import { WeeklyActivityChart } from "@/components/analytics/weekly-activity-chart";
import { TopWorkspaces } from "@/components/analytics/top-workspaces";
import {
  Package,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
  TrendingUp,
  UserRound,
  Users,
  Building2,
  Target,
  AlertCircle,
} from "lucide-react";
import type {
  WorkspaceAnalytics,
  PlatformAnalytics,
  AgentAnalytics,
} from "@/types/analytics.types";

// ── Error banner ─────────────────────────────────────────────────
function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
      <AlertCircle size={16} className="shrink-0" />
      {message}
    </div>
  );
}

// ── Admin view ───────────────────────────────────────────────────
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
    <div className="flex flex-col gap-6">
      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Shipments"
          value={data.shipments.total}
          icon={Package}
          variant="default"
        />
        <KpiCard
          label="Delivered"
          value={data.shipments.delivered}
          icon={CheckCircle2}
          variant="success"
        />
        <KpiCard
          label="In Transit"
          value={data.shipments.inTransit}
          icon={Truck}
          variant="warning"
        />
        <KpiCard
          label="Out for Delivery"
          value={data.shipments.outForDelivery}
          icon={Clock}
          variant="primary"
        />
        <KpiCard
          label="Failed"
          value={data.shipments.failed}
          icon={XCircle}
          variant="danger"
        />
        <KpiCard
          label="Delivery Rate"
          value={`${deliveryRate}%`}
          icon={TrendingUp}
          variant="success"
          sub="of all shipments delivered"
        />
        <KpiCard
          label="Agents"
          value={data.agents}
          icon={UserRound}
          variant="blue"
        />
        <KpiCard
          label="Customers"
          value={data.customers}
          icon={Users}
          variant="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DailyChart data={data.dailyShipments} />
        <StatusBreakdown stats={data.shipments} />
      </div>
    </div>
  );
}

// ── Super Admin view ─────────────────────────────────────────────
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
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          label="Total Shipments"
          value={data.shipments.total}
          icon={Package}
          variant="default"
        />
        <KpiCard
          label="Delivered"
          value={data.shipments.delivered}
          icon={CheckCircle2}
          variant="success"
        />
        <KpiCard
          label="In Transit"
          value={data.shipments.inTransit}
          icon={Truck}
          variant="warning"
        />
        <KpiCard
          label="Failed"
          value={data.shipments.failed}
          icon={XCircle}
          variant="danger"
        />
        <KpiCard
          label="Workspaces"
          value={data.workspaces}
          icon={Building2}
          variant="blue"
        />
        <KpiCard
          label="Total Users"
          value={data.users}
          icon={Users}
          variant="purple"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DailyChart
          data={data.dailyShipments}
          title="Platform Shipments (Last 30 Days)"
        />
        <TopWorkspaces data={data.topWorkspaces} />
      </div>
    </div>
  );
}

// ── Agent view ───────────────────────────────────────────────────
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
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          label="Assigned Total"
          value={data.stats.total}
          icon={Package}
          variant="default"
        />
        <KpiCard
          label="Delivered"
          value={data.stats.delivered}
          icon={CheckCircle2}
          variant="success"
        />
        <KpiCard
          label="Out for Delivery"
          value={data.stats.outForDelivery}
          icon={Clock}
          variant="primary"
        />
        <KpiCard
          label="In Transit"
          value={data.stats.inTransit}
          icon={Truck}
          variant="warning"
        />
        <KpiCard
          label="Failed"
          value={data.stats.failed}
          icon={XCircle}
          variant="danger"
        />
        <KpiCard
          label="Success Rate"
          value={`${successRate}%`}
          icon={Target}
          variant="success"
          sub="of assigned deliveries"
        />
      </div>

      <div className="max-w-xl">
        <WeeklyActivityChart data={data.weeklyActivity} />
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────
export default async function AnalyticsPage() {
  const user = await getSessionUser();

  const subtitle =
    user?.role === "super_admin"
      ? "Platform-wide overview"
      : user?.role === "delivery_agent"
        ? "Your personal delivery stats"
        : "Workspace performance dashboard";

  const hasAnalytics = ["super_admin", "admin", "delivery_agent"].includes(
    user?.role ?? "",
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        {user?.role && (
          <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border">
            {user.role.replace("_", " ")}
          </span>
        )}
      </div>

      {user?.role === "super_admin" && <SuperAdminAnalytics />}
      {user?.role === "admin" && <AdminAnalytics />}
      {user?.role === "delivery_agent" && <AgentAnalyticsView />}

      {!hasAnalytics && (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Analytics are not available for your role.
        </div>
      )}
    </div>
  );
}
