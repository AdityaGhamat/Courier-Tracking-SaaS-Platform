"use client";
import {
  useWorkspaceAnalytics,
  useAgentAnalytics,
} from "@/modules/analytics/hooks/useAnalytics";
import { useSession } from "@/hooks/useSession";

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

function AdminAnalytics() {
  const { data, isLoading } = useWorkspaceAnalytics();
  const d = data?.data;

  if (isLoading) return <p className="text-gray-500 text-sm">Loading...</p>;
  if (!d) return <p className="text-gray-500 text-sm">No data available.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Workspace Analytics</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Shipments" value={d.totalShipments} />
        <StatCard label="Delivered" value={d.delivered} />
        <StatCard label="In Transit" value={d.inTransit} />
        <StatCard label="Failed" value={d.failed} />
        <StatCard label="Agents" value={d.totalAgents} />
        <StatCard label="Hubs" value={d.totalHubs} />
        <StatCard label="Vehicles" value={d.totalVehicles} />
      </div>
    </div>
  );
}

function AgentAnalytics() {
  const { data, isLoading } = useAgentAnalytics();
  const d = data?.data;

  if (isLoading) return <p className="text-gray-500 text-sm">Loading...</p>;
  if (!d) return <p className="text-gray-500 text-sm">No data available.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Analytics</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Assigned" value={d.totalAssigned} />
        <StatCard label="Delivered" value={d.delivered} />
        <StatCard label="In Transit" value={d.inTransit} />
        <StatCard label="Failed" value={d.failed} />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { role } = useSession();
  if (role === "admin") return <AdminAnalytics />;
  if (role === "delivery_agent") return <AgentAnalytics />;
  return null;
}
