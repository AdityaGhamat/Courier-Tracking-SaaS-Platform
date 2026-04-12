"use client";
import { useState } from "react";
import {
  useTenants,
  useDeleteTenant,
  useAssignPlanToTenant,
  useTenantSubscription,
} from "@/modules/superAdmin/hooks/useSuperAdmin";
import { usePlans } from "@/modules/subscription/hooks/useSubscriptions";
import type { Tenant } from "@/modules/superAdmin/types/superAdmin.types";

function TenantSubscriptionBadge({ tenantId }: { tenantId: string }) {
  const { data } = useTenantSubscription(tenantId);
  const sub = data?.data;
  if (!sub) return <span className="text-xs text-gray-400">No plan</span>;
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-500",
    expired: "bg-red-100 text-red-600",
    cancelled: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colors[sub.status] ?? "bg-gray-100"}`}
    >
      {sub.plan.name} · {sub.status}
    </span>
  );
}

function AssignPlanModal({
  tenant,
  onClose,
}: {
  tenant: Tenant;
  onClose: () => void;
}) {
  const { data: plansData } = usePlans();
  const { mutate: assign, isPending } = useAssignPlanToTenant();
  const [planId, setPlanId] = useState("");
  const [endDate, setEndDate] = useState("");

  const plans = plansData?.data ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    assign(
      {
        workspaceId: tenant.id,
        planId,
        endDate: new Date(endDate).toISOString(),
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4 shadow-xl">
        <h2 className="font-semibold">
          Assign Plan to <span className="text-blue-600">{tenant.name}</span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Plan</label>
            <select
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select plan...</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · ₹{p.price}/
                  {p.billingCycle === "monthly" ? "mo" : "yr"}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">End Date</label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-black text-white py-2 rounded-lg text-sm disabled:opacity-50"
            >
              {isPending ? "Assigning..." : "Assign"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TenantsPage() {
  const { data, isLoading } = useTenants();
  const { mutate: deleteTenant } = useDeleteTenant();
  const [assignTarget, setAssignTarget] = useState<Tenant | null>(null);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tenants</h1>
      {assignTarget && (
        <AssignPlanModal
          tenant={assignTarget}
          onClose={() => setAssignTarget(null)}
        />
      )}
      {isLoading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {[
                  "Name",
                  "Slug",
                  "Subscription",
                  "Status",
                  "Created",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-medium text-gray-600"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {(data?.data ?? []).map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{tenant.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {tenant.slug}
                  </td>
                  <td className="px-4 py-3">
                    <TenantSubscriptionBadge tenantId={tenant.id} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${tenant.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                    >
                      {tenant.isActive ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(tenant.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    <button
                      onClick={() => setAssignTarget(tenant)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Assign Plan
                    </button>
                    <button
                      onClick={() => deleteTenant(tenant.id)}
                      className="text-red-500 hover:underline text-xs"
                    >
                      Delete
                    </button>
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
