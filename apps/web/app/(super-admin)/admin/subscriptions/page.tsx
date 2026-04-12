"use client";
import { useAllSubscriptions } from "@/modules/subscription/hooks/useSubscriptions";
import type { SubscriptionStatus } from "@/modules/subscription/types/subscription.types";

const statusStyles: Record<SubscriptionStatus, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-500",
  expired: "bg-red-100 text-red-600",
  cancelled: "bg-yellow-100 text-yellow-700",
};

export default function SuperAdminSubscriptionsPage() {
  const { data, isLoading } = useAllSubscriptions();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">All Subscriptions</h1>
      {isLoading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Workspace ID", "Plan", "Type", "Status", "Expires"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 font-medium text-gray-600"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {(data?.data ?? []).map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {sub.workspaceId}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {sub.plan?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-500">
                    {sub.plan?.type ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[sub.status]}`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(sub.endDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
