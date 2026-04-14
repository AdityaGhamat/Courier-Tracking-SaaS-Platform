import { serverFetch } from "@/lib/server-api";
import type { Vehicle } from "@/types";
import { CreateVehicleDialog } from "@/components/vehicles/create-vehicle-dialog";
import { EditVehicleDialog } from "@/components/vehicles/edit-vehicle-dialog";

async function getVehicles(): Promise<Vehicle[]> {
  try {
    const res = await serverFetch<{ data: Vehicle[] }>("vehicles");
    return res.data ?? [];
  } catch {
    return [];
  }
}

const TYPE_BADGE: Record<string, { bg: string; text: string; label: string }> =
  {
    bike: { bg: "bg-green-50", text: "text-green-700", label: "Bike" },
    van: { bg: "bg-amber-50", text: "text-amber-700", label: "Van" },
    truck: { bg: "bg-blue-50", text: "text-blue-700", label: "Truck" },
    car: { bg: "bg-indigo-50", text: "text-indigo-700", label: "Car" },
    auto: { bg: "bg-orange-50", text: "text-orange-700", label: "Auto" },
  };

export default async function VehiclesPage() {
  const vehicles = await getVehicles();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Vehicles
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fleet of {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""}
          </p>
        </div>
        <CreateVehicleDialog />
      </div>

      {vehicles.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-3 border border-dashed border-slate-200 rounded-2xl text-center bg-slate-50">
          <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
              <rect x="9" y="11" width="14" height="10" rx="2" />
              <circle cx="12" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-700">
            No vehicles registered
          </p>
          <p className="text-sm text-slate-400">
            Add vehicles to assign them to delivery agents.
          </p>
          <div className="mt-2">
            <CreateVehicleDialog />
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {["License Plate", "Type", "Assigned Agent", ""].map((h) => (
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
                {vehicles.map((v) => {
                  const badge = TYPE_BADGE[v.type] ?? {
                    bg: "bg-slate-50",
                    text: "text-slate-600",
                    label: v.type,
                  };
                  return (
                    <tr
                      key={v.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono font-semibold text-sm text-slate-800 tabular-nums">
                          {v.licensePlate}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {v.agentId ? (
                          <span className="text-sm font-mono text-slate-700">
                            {v.agentId}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <EditVehicleDialog vehicle={v} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
