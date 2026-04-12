"use client";
import { useState } from "react";
import {
  usePlans,
  useCreatePlan,
  useDeletePlan,
} from "@/modules/subscription/hooks/useSubscriptions";
import type {
  CreatePlanInput,
  PlanType,
  BillingCycle,
} from "@/modules/subscription/types/subscription.types";

const emptyForm: CreatePlanInput = {
  name: "",
  type: "basic",
  price: "",
  billingCycle: "monthly",
  maxShipments: 100,
  maxAgents: 5,
};

export default function SuperAdminPlansPage() {
  const { data, isLoading } = usePlans();
  const { mutate: createPlan, isPending } = useCreatePlan();
  const { mutate: deletePlan } = useDeletePlan();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreatePlanInput>(emptyForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPlan(form, {
      onSuccess: () => {
        setShowForm(false);
        setForm(emptyForm);
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          + New Plan
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-xl p-6 grid grid-cols-2 gap-4"
        >
          {[
            { key: "name", label: "Plan Name", type: "text" },
            { key: "price", label: "Price (e.g. 49.99)", type: "text" },
          ].map((f) => (
            <div key={f.key} className="space-y-1">
              <label className="text-sm font-medium">{f.label}</label>
              <input
                required
                type={f.type}
                value={(form as any)[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          ))}
          <div className="space-y-1">
            <label className="text-sm font-medium">Type</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as PlanType })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              {(["basic", "pro", "enterprise"] as PlanType[]).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Billing Cycle</label>
            <select
              value={form.billingCycle}
              onChange={(e) =>
                setForm({
                  ...form,
                  billingCycle: e.target.value as BillingCycle,
                })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              {(["monthly", "yearly"] as BillingCycle[]).map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Max Shipments</label>
            <input
              type="number"
              required
              value={form.maxShipments}
              onChange={(e) =>
                setForm({ ...form, maxShipments: Number(e.target.value) })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Max Agents</label>
            <input
              type="number"
              required
              value={form.maxAgents}
              onChange={(e) =>
                setForm({ ...form, maxAgents: Number(e.target.value) })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create Plan"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border px-4 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(data?.data ?? []).map((plan) => (
            <div
              key={plan.id}
              className="bg-white border rounded-xl p-5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">{plan.name}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${plan.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {plan.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-xl font-bold">
                ₹{plan.price}
                <span className="text-sm font-normal text-gray-500">
                  /{plan.billingCycle === "monthly" ? "mo" : "yr"}
                </span>
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {plan.type} · {plan.maxShipments} shipments · {plan.maxAgents}{" "}
                agents
              </p>
              <button
                onClick={() => deletePlan(plan.id)}
                className="text-red-500 hover:underline text-xs pt-1"
              >
                Deactivate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
