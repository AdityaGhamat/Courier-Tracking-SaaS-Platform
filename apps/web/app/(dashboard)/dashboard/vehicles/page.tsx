"use client";
import { useState } from "react";
import {
  useVehicles,
  useCreateVehicle,
  useDeleteVehicle,
  useMyVehicle,
} from "@/modules/vehicle/hooks/useVehicles";
import type {
  CreateVehicleInput,
  VehicleType,
} from "@/modules/vehicle/types/vehicle.types";
import { useSession } from "@/hooks/useSession";

const VEHICLE_TYPES: VehicleType[] = ["bike", "car", "van", "truck"];
const emptyForm: CreateVehicleInput = {
  type: "bike",
  licensePlate: "",
  capacityKg: "",
};

function AdminVehicles() {
  const { data, isLoading } = useVehicles();
  const { mutate: createVehicle, isPending } = useCreateVehicle();
  const { mutate: deleteVehicle } = useDeleteVehicle();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateVehicleInput>(emptyForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createVehicle(form, {
      onSuccess: () => {
        setShowForm(false);
        setForm(emptyForm);
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          + New Vehicle
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-xl p-6 space-y-4"
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Type</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as VehicleType })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                {VEHICLE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">License Plate</label>
              <input
                required
                value={form.licensePlate}
                onChange={(e) =>
                  setForm({ ...form, licensePlate: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Capacity (kg)</label>
              <input
                value={form.capacityKg ?? ""}
                onChange={(e) =>
                  setForm({ ...form, capacityKg: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create"}
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
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Type", "License Plate", "Capacity", "Available", ""].map(
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
              {(data?.data ?? []).map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 capitalize">{v.type}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {v.licensePlate}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {v.capacityKg ? `${v.capacityKg} kg` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${v.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                    >
                      {v.isAvailable ? "Available" : "In Use"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteVehicle(v.id)}
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

function AgentVehicle() {
  const { data, isLoading } = useMyVehicle();
  const v = data?.data;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Vehicle</h1>
      {isLoading && <p className="text-gray-500 text-sm">Loading...</p>}
      {!isLoading && !v && (
        <p className="text-gray-500 text-sm">No vehicle assigned to you yet.</p>
      )}
      {v && (
        <div className="bg-white border rounded-xl p-6 space-y-3 max-w-sm">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold capitalize">{v.type}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${v.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
            >
              {v.isAvailable ? "Available" : "In Use"}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            License:{" "}
            <span className="font-mono font-medium text-gray-800">
              {v.licensePlate}
            </span>
          </p>
          {v.capacityKg && (
            <p className="text-sm text-gray-500">
              Capacity:{" "}
              <span className="font-medium text-gray-800">
                {v.capacityKg} kg
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function VehiclesPage() {
  const { role } = useSession();
  if (role === "admin") return <AdminVehicles />;
  if (role === "delivery_agent") return <AgentVehicle />;
  return null;
}
