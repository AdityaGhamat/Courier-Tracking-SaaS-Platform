import {
  PackageSearch,
  Warehouse,
  Truck,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import { serverFetch } from "@/lib/server-api";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";

interface AnalyticsOverview {
  totalShipments: number;
  activeShipments: number;
  deliveredToday: number;
  totalHubs: number;
  totalVehicles: number;
  totalAgents: number;
  successRate: number;
  avgDeliveryTime: string;
}

interface RecentShipment {
  id: string;
  trackingId: string;
  status: string;
  origin: string;
  destination: string;
  createdAt: string;
}

async function getAnalytics(): Promise<AnalyticsOverview | null> {
  try {
    const res = await serverFetch<{ data: AnalyticsOverview }>("analytics");
    return res.data;
  } catch {
    return null;
  }
}

async function getRecentShipments(): Promise<RecentShipment[]> {
  try {
    const res = await serverFetch<{ data: { shipments: RecentShipment[] } }>(
      "shipments?limit=5",
    );
    return res.data.shipments ?? [];
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const [analytics, recentShipments] = await Promise.all([
    getAnalytics(),
    getRecentShipments(),
  ]);

  const stats = [
    {
      label: "Total Shipments",
      value: analytics?.totalShipments?.toLocaleString() ?? "—",
      sub: `${analytics?.activeShipments ?? 0} currently active`,
      icon: PackageSearch,
      iconColor: "var(--color-primary)",
      trend: "up" as const,
      trendValue: "12%",
    },
    {
      label: "Delivered Today",
      value: analytics?.deliveredToday?.toLocaleString() ?? "—",
      icon: TrendingUp,
      iconColor: "var(--color-success)",
      trend: "up" as const,
      trendValue: "8%",
    },
    {
      label: "Active Hubs",
      value: analytics?.totalHubs?.toLocaleString() ?? "—",
      icon: Warehouse,
      iconColor: "var(--color-tertiary-container)",
    },
    {
      label: "Vehicles",
      value: analytics?.totalVehicles?.toLocaleString() ?? "—",
      icon: Truck,
      iconColor: "var(--color-secondary)",
    },
    {
      label: "Agents",
      value: analytics?.totalAgents?.toLocaleString() ?? "—",
      icon: Users,
      iconColor: "var(--color-primary-container)",
    },
    {
      label: "Avg Delivery Time",
      value: analytics?.avgDeliveryTime ?? "—",
      icon: Clock,
      sub: `${analytics?.successRate ?? 0}% success rate`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1
          className="font-bold"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-headline-sm)",
            color: "var(--color-on-surface)",
            letterSpacing: "-0.015em",
          }}
        >
          Overview
        </h1>
        <p
          style={{
            fontSize: "var(--text-body-md)",
            color: "var(--color-on-surface-variant)",
            marginTop: "2px",
          }}
        >
          Your logistics operation at a glance
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Recent shipments */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface-lowest)",
          border: "1px solid var(--color-outline-variant)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Table header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--color-outline-variant)" }}
        >
          <h2
            className="font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-title-md)",
              color: "var(--color-on-surface)",
            }}
          >
            Recent Shipments
          </h2>
          <a
            href="/shipments"
            className="font-medium transition-opacity hover:opacity-70"
            style={{
              fontSize: "var(--text-body-sm)",
              color: "var(--color-secondary-container)",
            }}
          >
            View all →
          </a>
        </div>

        {recentShipments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <PackageSearch
              size={36}
              style={{ color: "var(--color-outline-variant)" }}
            />
            <p
              style={{
                fontSize: "var(--text-body-md)",
                color: "var(--color-on-surface-variant)",
              }}
            >
              No shipments yet
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--color-outline-variant)",
                  }}
                >
                  {[
                    "Tracking ID",
                    "Origin",
                    "Destination",
                    "Status",
                    "Date",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-3"
                      style={{
                        fontSize: "var(--text-label-md)",
                        color: "var(--color-on-surface-variant)",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentShipments.map((s, i) => (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom:
                        i < recentShipments.length - 1
                          ? "1px solid var(--color-outline-variant)"
                          : "none",
                    }}
                  >
                    <td className="px-6 py-4">
                      <span
                        className="font-mono font-medium"
                        style={{
                          fontSize: "var(--text-body-md)",
                          color: "var(--color-primary)",
                        }}
                      >
                        {s.trackingId}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4"
                      style={{
                        fontSize: "var(--text-body-md)",
                        color: "var(--color-on-surface)",
                      }}
                    >
                      {s.origin}
                    </td>
                    <td
                      className="px-6 py-4"
                      style={{
                        fontSize: "var(--text-body-md)",
                        color: "var(--color-on-surface)",
                      }}
                    >
                      {s.destination}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={s.status} />
                    </td>
                    <td
                      className="px-6 py-4"
                      style={{
                        fontSize: "var(--text-body-sm)",
                        color: "var(--color-on-surface-variant)",
                      }}
                    >
                      {new Date(s.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
