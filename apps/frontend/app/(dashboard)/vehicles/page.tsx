import { serverFetch } from "@/lib/server-api";
import type { Vehicle } from "@/types";
import { Truck } from "lucide-react";

async function getVehicles(): Promise<Vehicle[]> {
  try {
    const res = await serverFetch<{ data: Vehicle[] }>("vehicles");
    return res.data ?? [];
  } catch {
    return [];
  }
}

export default async function VehiclesPage() {
  const vehicles = await getVehicles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            className="font-bold"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-headline-sm)",
              color: "var(--color-on-surface)",
            }}
          >
            Vehicles
          </h1>
          <p
            style={{
              fontSize: "var(--text-body-md)",
              color: "var(--color-on-surface-variant)",
              marginTop: "0.25rem",
            }}
          >
            Fleet management
          </p>
        </div>
        <button
          className="btn-kinetic flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold"
          style={{ fontSize: "var(--text-body-md)" }}
        >
          <Truck size={16} />
          Add Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{
            backgroundColor: "var(--color-surface-low)",
            border: "1px dashed var(--color-outline-variant)",
          }}
        >
          <Truck
            size={36}
            style={{
              color: "var(--color-on-surface-variant)",
              margin: "0 auto 0.75rem",
            }}
          />
          <p
            className="font-semibold"
            style={{
              fontSize: "var(--text-body-md)",
              color: "var(--color-on-surface)",
            }}
          >
            No vehicles registered
          </p>
          <p
            style={{
              fontSize: "var(--text-body-sm)",
              color: "var(--color-on-surface-variant)",
              marginTop: "0.25rem",
            }}
          >
            Add vehicles to assign them to delivery agents
          </p>
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--color-outline-variant)" }}
        >
          <table className="data-table w-full">
            <thead style={{ backgroundColor: "var(--color-surface-low)" }}>
              <tr>
                {["License Plate", "Type", "Assigned Agent", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr
                  key={v.id}
                  style={{
                    borderTop: "1px solid var(--color-outline-variant)",
                  }}
                >
                  <td className="px-4 py-3">
                    <span
                      className="font-mono font-semibold"
                      style={{
                        fontSize: "var(--text-body-md)",
                        color: "var(--color-on-surface)",
                      }}
                    >
                      {v.licensePlate}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 capitalize"
                    style={{
                      fontSize: "var(--text-body-md)",
                      color: "var(--color-on-surface-variant)",
                    }}
                  >
                    {v.type}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      fontSize: "var(--text-body-md)",
                      color: "var(--color-on-surface-variant)",
                    }}
                  >
                    {v.agentId ?? (
                      <span style={{ color: "var(--color-outline-variant)" }}>
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      style={{
                        fontSize: "var(--text-label-md)",
                        color: "var(--color-secondary-container)",
                      }}
                    >
                      Manage
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
