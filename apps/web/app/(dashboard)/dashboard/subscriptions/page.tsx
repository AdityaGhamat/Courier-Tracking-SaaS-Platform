"use client";
import {
  useMySubscription,
  usePlans,
} from "@/modules/subscription/hooks/useSubscriptions";
import type { SubscriptionStatus } from "@/modules/subscription/types/subscription.types";

const statusStyles: Record<SubscriptionStatus, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  expired: "bg-red-100 text-red-700",
  cancelled: "bg-yellow-100 text-yellow-700",
};

export default function SubscriptionsPage() {
  const { data: subData, isLoading: subLoading } = useMySubscription();
  const { data: plansData, isLoading: plansLoading } = usePlans();

  const sub = subData?.data;
  const plans = plansData?.data ?? [];

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">My Subscription</h1>
        {subLoading && <p className="text-gray-500 text-sm">Loading...</p>}
        {!subLoading && !sub && (
          <p className="text-gray-500 text-sm">No active subscription found.</p>
        )}
        {sub && (
          <div className="bg-white border rounded-xl p-6 max-w-lg space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-lg">
                {sub.plan?.name ?? "Plan"}
              </p>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[sub.status]}`}
              >
                {sub.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Type:{" "}
              <span className="font-medium text-gray-800 capitalize">
                {sub.plan?.type}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Billing:{" "}
              <span className="font-medium text-gray-800 capitalize">
                {sub.plan?.billingCycle}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Price:{" "}
              <span className="font-medium text-gray-800">
                ₹{sub.plan?.price}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Max Shipments:{" "}
              <span className="font-medium text-gray-800">
                {sub.plan?.maxShipments}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Max Agents:{" "}
              <span className="font-medium text-gray-800">
                {sub.plan?.maxAgents}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Expires:{" "}
              <span className="font-medium text-gray-800">
                {new Date(sub.endDate).toLocaleDateString()}
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold">Available Plans</h2>
        {plansLoading && (
          <p className="text-gray-500 text-sm">Loading plans...</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white border rounded-xl p-5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">{plan.name}</p>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full capitalize">
                  {plan.type}
                </span>
              </div>
              {plan.description && (
                <p className="text-xs text-gray-500">{plan.description}</p>
              )}
              <p className="text-2xl font-bold">
                ₹{plan.price}
                <span className="text-sm font-normal text-gray-500">
                  /{plan.billingCycle === "monthly" ? "mo" : "yr"}
                </span>
              </p>
              <ul className="text-xs text-gray-600 space-y-1 pt-1">
                <li>✓ {plan.maxShipments} shipments</li>
                <li>✓ {plan.maxAgents} agents</li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
