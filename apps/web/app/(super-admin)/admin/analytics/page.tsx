"use client";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/modules/analytics/services/analytics.service";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

export default function SuperAdminAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics", "platform"],
    queryFn: analyticsService.getPlatformAnalytics,
  });

  const d = data?.data;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Platform Analytics</h1>
      {isLoading && <p className="text-gray-500 text-sm">Loading...</p>}
      {d && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Workspaces" value={d.totalWorkspaces} />
          <StatCard label="Total Shipments" value={d.totalShipments} />
          <StatCard label="Total Users" value={d.totalUsers} />
          <StatCard
            label="Active Subscriptions"
            value={d.activeSubscriptions}
          />
        </div>
      )}
    </div>
  );
}
