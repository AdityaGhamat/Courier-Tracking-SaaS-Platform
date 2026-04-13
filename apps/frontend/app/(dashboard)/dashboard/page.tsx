import { serverFetch } from "@/lib/server-api";
import Link from "next/link";
import {
  Package,
  Truck,
  CheckCircle2,
  AlertCircle,
  Users,
  Clock,
} from "lucide-react";

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

// KPI card — clean, uses Tailwind for layout, shadow, and borders
function KpiCard({
  label,
  value,
  sub,
  icon,
  accentClass,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  accentClass: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        <span className={`${accentClass} opacity-90`}>{icon}</span>
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-900 leading-none tabular-nums">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        <p className="text-xs text-slate-500 mt-1">{sub}</p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const analytics = await getAnalytics();

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Live snapshot of your logistics operations
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Shipments"
          value={analytics?.shipments.total ?? "—"}
          sub="All time"
          icon={<Package size={20} />}
          accentClass="text-slate-500"
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
          icon={<Truck size={20} />}
          accentClass="text-[#091426]" // Using your primary deep navy
        />
        <KpiCard
          label="Delivered"
          value={analytics?.shipments.delivered ?? "—"}
          sub="Successfully completed"
          icon={<CheckCircle2 size={20} />}
          accentClass="text-green-600"
        />
        <KpiCard
          label="Failed / Returned"
          value={analytics?.shipments.failed ?? "—"}
          sub="Needs attention"
          icon={<AlertCircle size={20} />}
          accentClass="text-red-600"
        />
      </div>

      {/* Agents & customers row */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              label: "Delivery Agents",
              value: analytics.agents,
              icon: <Users size={20} />,
            },
            {
              label: "Customers",
              value: analytics.customers,
              icon: <Users size={20} />,
            },
            {
              label: "Pending",
              value: analytics.shipments.pending,
              icon: <Clock size={20} />,
            },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm"
            >
              <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                {icon}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 tabular-nums">
                  {value.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            {
              label: "New Shipment",
              href: "/shipments",
              icon: <Package size={20} />,
              desc: "Create and dispatch",
            },
            {
              label: "Track a Package",
              href: "/tracking",
              icon: <Truck size={20} />,
              desc: "Live location updates",
            },
            {
              label: "Pending Reviews",
              href: "/shipments?status=failed",
              icon: <Clock size={20} />,
              desc: "Failed & retry queue",
            },
          ].map(({ label, href, icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-4 no-underline transition-all hover:shadow-md hover:bg-slate-50"
            >
              <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                {icon}
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Error state */}
      {!analytics && (
        <div className="p-8 text-center border border-dashed border-slate-300 rounded-xl text-slate-500 bg-white/50">
          <p className="text-sm">
            Could not load analytics. Make sure the backend is running.
          </p>
        </div>
      )}
    </div>
  );
}
