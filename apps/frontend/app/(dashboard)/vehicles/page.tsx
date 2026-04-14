import { serverFetch } from "@/lib/server-api";
import type { Vehicle } from "@/types";
import { CreateVehicleDialog } from "@/components/vehicles/create-vehicle-dialog";
import { EditVehicleDialog } from "@/components/vehicles/edit-vehicle-dialog";
import { VehicleActions } from "@/components/vehicles/vehicle-actions";

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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {vehicles.map((v) => {
            const badge = TYPE_BADGE[v.type] ?? {
              bg: "bg-slate-50",
              text: "text-slate-600",
              label: v.type,
            };
            return (
              <div
                key={v.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
              >
                {/* Top: plate + type badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono font-bold text-base text-slate-800 tabular-nums tracking-wide">
                      {v.licensePlate}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize w-fit ${badge.bg} ${badge.text}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <EditVehicleDialog vehicle={v} />
                </div>

                {/* Agent assignment status */}
                <div className="flex items-center gap-2 text-sm">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="shrink-0 text-slate-400"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {v.agentId ? (
                    <span className="font-mono text-xs text-slate-600 truncate">
                      {v.agentId}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      No agent assigned
                    </span>
                  )}
                </div>

                {/* Actions: Assign / Unassign */}
                <VehicleActions
                  vehicleId={v.id}
                  currentAgentId={v.agentId ?? null}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
