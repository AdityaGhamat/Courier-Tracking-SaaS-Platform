// apps/web/app/(dashboard)/analytics/page.tsx
import { cookies } from "next/headers";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:3005";

async function serverFetch(path: string, cookieHeader: string) {
  const res = await fetch(`${BACKEND}/api/v1/${path}`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

function StatCard({
  label,
  value,
  color = "text-[var(--color-text)]",
}: {
  label: string;
  value: number | string;
  color?: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex flex-col gap-1">
      <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
        {label}
      </span>
      <span className={`text-2xl font-semibold tabular-nums ${color}`}>
        {value ?? "—"}
      </span>
    </div>
  );
}

export default async function AnalyticsPage() {
  const cookieStore = await cookies();
  const sessionKey = cookieStore.get("session_key")?.value;
  const refreshKey = cookieStore.get("refresh_key")?.value;
  const cookieHeader = [
    sessionKey ? `session_key=${sessionKey}` : "",
    refreshKey ? `refresh_key=${refreshKey}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  // Fetch user first to determine role
  const meData = await serverFetch("auth/me", cookieHeader);
  const role = meData?.user?.role;

  let data: any = null;
  let analyticsType: "workspace" | "platform" | "agent" | null = null;

  if (role === "admin") {
    data = await serverFetch("analytics/workspace", cookieHeader);
    analyticsType = "workspace";
  } else if (role === "super_admin") {
    data = await serverFetch("analytics/platform", cookieHeader);
    analyticsType = "platform";
  } else if (role === "delivery_agent") {
    data = await serverFetch("analytics/agent", cookieHeader);
    analyticsType = "agent";
  }

  if (!data) {
    return (
      <div className="p-8 text-[var(--color-text-muted)]">
        Could not load analytics. Please try again.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[var(--content-wide)] mx-auto">
      <div>
        <h1 className="text-xl font-semibold text-[var(--color-text)]">
          Analytics
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {analyticsType === "workspace" &&
            "Your workspace performance overview"}
          {analyticsType === "platform" && "Platform-wide metrics"}
          {analyticsType === "agent" && "Your personal delivery stats"}
        </p>
      </div>

      {/* ── ADMIN: Workspace Analytics ─────────────────── */}
      {analyticsType === "workspace" && (
        <>
          <section>
            <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              Shipments
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <StatCard label="Total" value={data.shipments?.total} />
              <StatCard
                label="Delivered"
                value={data.shipments?.delivered}
                color="text-[var(--color-success)]"
              />
              <StatCard
                label="In Transit"
                value={data.shipments?.inTransit}
                color="text-[var(--color-blue)]"
              />
              <StatCard
                label="Out for Delivery"
                value={data.shipments?.outForDelivery}
                color="text-[var(--color-orange)]"
              />
              <StatCard
                label="Pending"
                value={data.shipments?.pending}
                color="text-[var(--color-gold)]"
              />
              <StatCard
                label="Failed"
                value={data.shipments?.failed}
                color="text-[var(--color-error)]"
              />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              Team
            </h2>
            <div className="grid grid-cols-2 gap-3 max-w-xs">
              <StatCard label="Agents" value={data.agents} />
              <StatCard label="Customers" value={data.customers} />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              Daily Shipments — Last 30 Days
            </h2>
            <DailyChart data={data.dailyShipments} />
          </section>
        </>
      )}

      {/* ── SUPER ADMIN: Platform Analytics ────────────── */}
      {analyticsType === "platform" && (
        <>
          <section>
            <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              Platform Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Total Shipments" value={data.shipments?.total} />
              <StatCard
                label="Delivered"
                value={data.shipments?.delivered}
                color="text-[var(--color-success)]"
              />
              <StatCard label="Workspaces" value={data.workspaces} />
              <StatCard label="Total Users" value={data.users} />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              Top Workspaces by Shipments
            </h2>
            <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[var(--color-surface-offset)] text-[var(--color-text-muted)]">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium">#</th>
                    <th className="text-left px-4 py-2 font-medium">
                      Workspace
                    </th>
                    <th className="text-right px-4 py-2 font-medium">
                      Shipments
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-divider)]">
                  {data.topWorkspaces?.map((w: any, i: number) => (
                    <tr
                      key={w.workspaceId}
                      className="bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] transition-colors"
                    >
                      <td className="px-4 py-3 text-[var(--color-text-faint)] tabular-nums">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {w.workspaceName ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {w.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              Daily Shipments — Last 30 Days
            </h2>
            <DailyChart data={data.dailyShipments} />
          </section>
        </>
      )}

      {/* ── AGENT: Personal Analytics ──────────────────── */}
      {analyticsType === "agent" && (
        <>
          <section>
            <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              Your Deliveries
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <StatCard label="Total Assigned" value={data.stats?.total} />
              <StatCard
                label="Delivered"
                value={data.stats?.delivered}
                color="text-[var(--color-success)]"
              />
              <StatCard
                label="In Transit"
                value={data.stats?.inTransit}
                color="text-[var(--color-blue)]"
              />
              <StatCard
                label="Out for Delivery"
                value={data.stats?.outForDelivery}
                color="text-[var(--color-orange)]"
              />
              <StatCard
                label="Failed"
                value={data.stats?.failed}
                color="text-[var(--color-error)]"
              />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              Weekly Activity — Last 7 Days
            </h2>
            <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[var(--color-surface-offset)] text-[var(--color-text-muted)]">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium">Date</th>
                    <th className="text-right px-4 py-2 font-medium text-[var(--color-success)]">
                      Delivered
                    </th>
                    <th className="text-right px-4 py-2 font-medium text-[var(--color-error)]">
                      Failed
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-divider)]">
                  {data.weeklyActivity?.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-6 text-center text-[var(--color-text-muted)]"
                      >
                        No activity this week
                      </td>
                    </tr>
                  )}
                  {data.weeklyActivity?.map((row: any) => (
                    <tr
                      key={row.date}
                      className="bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] transition-colors"
                    >
                      <td className="px-4 py-3">{row.date}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-[var(--color-success)]">
                        {row.delivered}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-[var(--color-error)]">
                        {row.failed}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

// ── Simple CSS bar chart — no library needed ───────────────
function DailyChart({ data }: { data: { date: string; total: number }[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center text-sm text-[var(--color-text-muted)]">
        No data for this period
      </div>
    );
  }

  const max = Math.max(...data.map((d) => Number(d.total)), 1);

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-end gap-1 h-32 overflow-x-auto">
        {data.map((d) => {
          const height = Math.max((Number(d.total) / max) * 100, 4);
          const shortDate = d.date?.slice(5); // MM-DD
          return (
            <div
              key={d.date}
              className="flex flex-col items-center gap-1 flex-1 min-w-[20px] group"
            >
              <span className="text-[10px] text-[var(--color-text-faint)] opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                {d.total}
              </span>
              <div
                style={{ height: `${height}%` }}
                className="w-full rounded-sm bg-[var(--color-primary)] opacity-80 hover:opacity-100 transition-opacity"
                title={`${d.date}: ${d.total} shipments`}
              />
              <span className="text-[9px] text-[var(--color-text-faint)] rotate-45 origin-left hidden md:block">
                {shortDate}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
