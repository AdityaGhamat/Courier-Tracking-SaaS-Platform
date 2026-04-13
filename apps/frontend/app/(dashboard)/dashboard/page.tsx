import { serverFetch } from "@/lib/server-api";
import {
  Package,
  Truck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";

// Exact shape returned by analytics.service.ts → getWorkspaceAnalytics()
interface ShipmentStats {
  total: number;
  delivered: number;
  pending: number;
  inTransit: number;
  outForDelivery: number;
  failed: number;
}

interface DailyShipment {
  date: string;
  total: number;
}

interface WorkspaceAnalytics {
  shipments: ShipmentStats;
  agents: number;
  customers: number;
  dailyShipments: DailyShipment[];
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

const statusColors: Record<string, { bg: string; text: string; icon: string }> =
  {
    total: {
      bg: "var(--color-primary-container)",
      text: "var(--color-on-primary)",
      icon: "#8590a6",
    },
    transit: {
      bg: "var(--color-tertiary-container)",
      text: "var(--color-on-tertiary-container)",
      icon: "var(--color-secondary-container)",
    },
    delivered: {
      bg: "var(--color-success-container)",
      text: "var(--color-on-success-container)",
      icon: "var(--color-success)",
    },
    failed: {
      bg: "var(--color-error-container)",
      text: "var(--color-on-error-container)",
      icon: "var(--color-error)",
    },
  };

export default async function DashboardPage() {
  const analytics = await getAnalytics();

  const kpis = [
    {
      label: "Total Shipments",
      value: analytics?.shipments.total ?? "—",
      icon: Package,
      colorKey: "total",
      sub: "All time",
    },
    {
      label: "In Transit",
      // inTransit + outForDelivery = actively moving
      value: analytics
        ? analytics.shipments.inTransit + analytics.shipments.outForDelivery
        : "—",
      icon: Truck,
      colorKey: "transit",
      sub: "Active right now",
    },
    {
      label: "Delivered",
      value: analytics?.shipments.delivered ?? "—",
      icon: CheckCircle2,
      colorKey: "delivered",
      sub: "Successfully completed",
    },
    {
      label: "Failed / Returned",
      value: analytics?.shipments.failed ?? "—",
      icon: AlertCircle,
      colorKey: "failed",
      sub: "Needs attention",
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
          }}
        >
          Overview
        </h1>
        <p
          style={{
            fontSize: "var(--text-body-md)",
            color: "var(--color-on-surface-variant)",
            marginTop: "0.25rem",
          }}
        >
          Live snapshot of your logistics operations
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, colorKey, sub }) => {
          const c = statusColors[colorKey];
          return (
            <div
              key={label}
              className="rounded-xl p-5 flex flex-col gap-4"
              style={{
                backgroundColor: c.bg,
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex items-start justify-between">
                <p
                  className="font-medium"
                  style={{
                    fontSize: "var(--text-label-lg)",
                    color: c.text,
                    opacity: 0.8,
                  }}
                >
                  {label}
                </p>
                <Icon size={18} style={{ color: c.icon, opacity: 0.9 }} />
              </div>
              <div>
                <p
                  className="font-bold"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-headline-md)",
                    color: c.text,
                    lineHeight: 1,
                  }}
                >
                  {typeof value === "number" ? value.toLocaleString() : value}
                </p>
                <p
                  style={{
                    fontSize: "var(--text-label-md)",
                    color: c.text,
                    opacity: 0.55,
                    marginTop: "0.25rem",
                  }}
                >
                  {sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agents & customers summary */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Delivery Agents", value: analytics.agents, icon: Users },
            {
              label: "Customers",
              value: analytics.customers,
              icon: TrendingUp,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl p-5 flex items-center gap-4"
              style={{
                backgroundColor: "var(--color-surface-lowest)",
                border: "1px solid var(--color-outline-variant)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "var(--color-surface-low)" }}
              >
                <Icon size={18} style={{ color: "var(--color-primary)" }} />
              </div>
              <div>
                <p
                  className="font-bold"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-title-lg)",
                    color: "var(--color-on-surface)",
                  }}
                >
                  {value.toLocaleString()}
                </p>
                <p
                  style={{
                    fontSize: "var(--text-label-md)",
                    color: "var(--color-on-surface-variant)",
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
          className="font-semibold mb-4"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-title-lg)",
            color: "var(--color-on-surface)",
          }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: "New Shipment",
              href: "/shipments",
              icon: Package,
              desc: "Create and dispatch",
            },
            {
              label: "Track a Package",
              href: "/tracking",
              icon: TrendingUp,
              desc: "Live location updates",
            },
            {
              label: "Pending Reviews",
              href: "/shipments?status=failed",
              icon: Clock,
              desc: "Failed & retry queue",
            },
          ].map(({ label, href, icon: Icon, desc }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-4 rounded-xl p-4 transition-all hover:shadow-md group"
              style={{
                backgroundColor: "var(--color-surface-lowest)",
                border: "1px solid var(--color-outline-variant)",
                textDecoration: "none",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "var(--color-surface-low)" }}
              >
                <Icon
                  size={18}
                  style={{ color: "var(--color-secondary-container)" }}
                />
              </div>
              <div>
                <p
                  className="font-semibold"
                  style={{
                    fontSize: "var(--text-body-md)",
                    color: "var(--color-on-surface)",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontSize: "var(--text-label-md)",
                    color: "var(--color-on-surface-variant)",
                  }}
                >
                  {desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Empty state if no analytics */}
      {!analytics && (
        <div
          className="rounded-xl p-8 text-center"
          style={{
            backgroundColor: "var(--color-surface-low)",
            border: "1px dashed var(--color-outline-variant)",
          }}
        >
          <AlertCircle
            size={32}
            style={{
              color: "var(--color-on-surface-variant)",
              margin: "0 auto 0.75rem",
            }}
          />
          <p
            style={{
              fontSize: "var(--text-body-md)",
              color: "var(--color-on-surface-variant)",
            }}
          >
            Could not load analytics. Make sure the backend is running.
          </p>
        </div>
      )}
    </div>
  );
}
