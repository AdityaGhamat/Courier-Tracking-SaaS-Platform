import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { serverFetch } from "@/lib/server-api";
import { getSessionUser } from "@/lib/session";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Shipment } from "@/types/shipment.types";
import type { Vehicle } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface AgentUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt?: string;
  workspaceId?: string;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-white ${color}`}
      >
        <Icon size={14} />
      </div>
      <p className="text-2xl font-extrabold tabular-nums text-slate-800">
        {value}
      </p>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </p>
    </div>
  );
}

export default async function AgentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const sessionUser = await getSessionUser();

  if (!sessionUser || sessionUser.role !== "admin") notFound();

  // Fetch all agents list and find this one (no single-agent endpoint on backend)
  let agent: AgentUser | null = null;
  try {
    const res = await serverFetch<{ data: AgentUser[] }>("auth/agents");
    agent = (res.data ?? []).find((a) => a.id === id) ?? null;
  } catch {
    agent = null;
  }

  if (!agent) notFound();

  // Fetch shipments assigned to this agent
  let shipments: Shipment[] = [];
  try {
    const res = await serverFetch<{ data: Shipment[] }>(
      `shipments?driverId=${id}&limit=50`,
    );
    shipments = res.data ?? [];
  } catch {
    shipments = [];
  }

  // Fetch vehicles to find agent's vehicle
  let vehicle: Vehicle | null = null;
  try {
    const res = await serverFetch<{ data: Vehicle[] }>("vehicles");
    vehicle = (res.data ?? []).find((v) => v.agentId === id) ?? null;
  } catch {
    vehicle = null;
  }

  const delivered = shipments.filter((s) => s.status === "delivered").length;
  const inTransit = shipments.filter((s) => s.status === "in_transit").length;
  const outForDelivery = shipments.filter(
    (s) => s.status === "out_for_delivery",
  ).length;
  const failed = shipments.filter((s) => s.status === "failed").length;

  const colors = [
    "from-indigo-500 to-violet-500",
    "from-cyan-500 to-blue-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-pink-500",
    "from-amber-500 to-orange-500",
  ];
  const avatarColor = colors[agent.name.charCodeAt(0) % colors.length];

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Back */}
      <Link
        href="/agents"
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors w-fit"
      >
        <ArrowLeft size={15} />
        Back to Agents
      </Link>

      {/* Profile card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-5 items-start">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-2xl bg-linear-to-br ${avatarColor}`}
        >
          {agent.name[0]?.toUpperCase() ?? "A"}
        </div>

        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900">{agent.name}</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-600 uppercase tracking-wide border border-green-100">
              Active
            </span>
          </div>

          <div className="flex flex-col gap-1.5 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Mail size={13} className="shrink-0 text-slate-400" />
              <span>{agent.email}</span>
            </div>
            {agent.phone && (
              <div className="flex items-center gap-2">
                <Phone size={13} className="shrink-0 text-slate-400" />
                <span>{agent.phone}</span>
              </div>
            )}
            {agent.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar size={13} className="shrink-0 text-slate-400" />
                <span>
                  Joined{" "}
                  {new Date(agent.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Vehicle */}
          <div className="flex items-center gap-2 mt-1">
            <Truck size={13} className="shrink-0 text-slate-400" />
            {vehicle ? (
              <span className="text-sm text-slate-700 font-medium">
                <span className="font-mono font-bold text-slate-800">
                  {vehicle.licensePlate}
                </span>{" "}
                <span className="capitalize text-slate-500 text-xs">
                  ({vehicle.type})
                </span>
              </span>
            ) : (
              <span className="text-xs text-slate-400 italic">
                No vehicle assigned
              </span>
            )}
          </div>
        </div>

        {/* Quick action */}
        <Link
          href={`/agents/${id}/route`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fd761a]/10 text-[#fd761a] font-bold text-sm hover:bg-[#fd761a]/20 transition-colors no-underline shrink-0"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          Optimize Route
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Total"
          value={shipments.length}
          icon={Package}
          color="bg-slate-500"
        />
        <StatCard
          label="Delivered"
          value={delivered}
          icon={CheckCircle2}
          color="bg-green-500"
        />
        <StatCard
          label="In Transit"
          value={inTransit + outForDelivery}
          icon={Clock}
          color="bg-orange-500"
        />
        <StatCard
          label="Failed"
          value={failed}
          icon={XCircle}
          color="bg-red-500"
        />
      </div>

      {/* Shipments table */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">
          Assigned Shipments
        </h2>

        {shipments.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-3 border border-dashed border-slate-200 rounded-2xl text-center bg-slate-50">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <Package size={22} className="text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-500">
              No shipments assigned yet
            </p>
            <p className="text-xs text-slate-400">
              Shipments assigned to this agent will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {[
                      "Tracking #",
                      "Recipient",
                      "Status",
                      "Est. Delivery",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shipments.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
                          {s.trackingNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-slate-800 truncate max-w-40">
                          {s.recipientName}
                        </p>
                        <p className="text-xs text-slate-400 truncate max-w-40">
                          {s.recipientAddress}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-4 py-3">
                        {s.estimatedDelivery ? (
                          <span className="text-xs tabular-nums text-slate-600">
                            {new Date(s.estimatedDelivery).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/shipments/${s.id}`}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors no-underline"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
