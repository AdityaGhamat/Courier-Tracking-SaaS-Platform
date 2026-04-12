"use client";
import { useState } from "react";
import {
  useHubs,
  useCreateHub,
  useDeleteHub,
} from "@/modules/hub/hooks/useHubs";
import type { CreateHubInput } from "@/modules/hub/types/hub.types";

const emptyForm: CreateHubInput = {
  name: "",
  address: "",
  city: "",
  state: "",
  country: "",
  phone: "",
};

export default function HubsPage() {
  const { data, isLoading } = useHubs();
  const { mutate: createHub, isPending: creating } = useCreateHub();
  const { mutate: deleteHub } = useDeleteHub();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateHubInput>(emptyForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createHub(form, {
      onSuccess: () => {
        setShowForm(false);
        setForm(emptyForm);
      },
    });
  };

  const fields = [
    { key: "name", label: "Hub Name", required: true },
    { key: "address", label: "Address", required: true },
    { key: "city", label: "City", required: true },
    { key: "state", label: "State", required: false },
    { key: "country", label: "Country", required: true },
    { key: "phone", label: "Phone", required: false },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hubs</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          + New Hub
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-xl p-6 grid grid-cols-2 gap-4"
        >
          {fields.map((f) => (
            <div key={f.key} className="space-y-1">
              <label className="text-sm font-medium">{f.label}</label>
              <input
                required={f.required}
                value={form[f.key] ?? ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          ))}
          <div className="col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={creating}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Hub"}
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
                {["Name", "City", "Country", "Phone", "Status", ""].map((h) => (
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
              {(data?.data ?? []).map((hub) => (
                <tr key={hub.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{hub.name}</td>
                  <td className="px-4 py-3 text-gray-500">{hub.city}</td>
                  <td className="px-4 py-3 text-gray-500">{hub.country}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {hub.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${hub.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {hub.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteHub(hub.id)}
                      className="text-red-500 hover:underline text-xs"
                    >
                      Deactivate
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
