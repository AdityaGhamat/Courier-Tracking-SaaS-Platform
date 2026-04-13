import { serverFetch } from "@/lib/server-api";
import type { Vehicle } from "@/types";

async function getVehicles(): Promise<Vehicle[]> {
  try {
    const res = await serverFetch<{ data: Vehicle[] }>("vehicles");
    return res.data ?? [];
  } catch {
    return [];
  }
}

const TruckIcon = ({ size = 36 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
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
);

const VEHICLE_TYPE_COLORS: Record<string, string> = {
  bike: "var(--color-primary)",
  van: "var(--color-warning)",
  truck: "var(--color-blue)",
};

export default async function VehiclesPage() {
  const vehicles = await getVehicles();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-4)",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 700,
              color: "var(--color-text)",
            }}
          >
            Vehicles
          </h1>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-muted)",
              marginTop: "var(--space-1)",
            }}
          >
            Fleet management
          </p>
        </div>
        <button
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-2) var(--space-4)",
            background: "var(--color-primary)",
            color: "var(--color-text-inverse)",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <TruckIcon size={16} />
          Add Vehicle
        </button>
      </div>

      {/* Empty state */}
      {vehicles.length === 0 ? (
        <div
          style={{
            padding: "var(--space-16)",
            textAlign: "center",
            border: "1px dashed var(--color-border)",
            borderRadius: "var(--radius-lg)",
            color: "var(--color-text-faint)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          <TruckIcon size={36} />
          <p
            style={{
              fontWeight: 600,
              color: "var(--color-text)",
              fontSize: "var(--text-sm)",
            }}
          >
            No vehicles registered
          </p>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-muted)",
            }}
          >
            Add vehicles to assign them to delivery agents
          </p>
        </div>
      ) : (
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--color-surface-offset)" }}>
                  {["License Plate", "Type", "Assigned Agent", ""].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "var(--space-3) var(--space-4)",
                        fontSize: "var(--text-xs)",
                        fontWeight: 600,
                        color: "var(--color-text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr
                    key={v.id}
                    style={{ borderTop: "1px solid var(--color-divider)" }}
                  >
                    <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontWeight: 600,
                          fontSize: "var(--text-sm)",
                          color: "var(--color-text)",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {v.licensePlate}
                      </span>
                    </td>
                    <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "var(--space-1) var(--space-3)",
                          borderRadius: "var(--radius-full)",
                          background: "var(--color-surface-offset)",
                          fontSize: "var(--text-xs)",
                          fontWeight: 600,
                          color:
                            VEHICLE_TYPE_COLORS[v.type] ??
                            "var(--color-text-muted)",
                          textTransform: "capitalize",
                        }}
                      >
                        {v.type}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        fontSize: "var(--text-sm)",
                        color: v.agentId
                          ? "var(--color-text)"
                          : "var(--color-text-faint)",
                        fontStyle: v.agentId ? "normal" : "italic",
                      }}
                    >
                      {v.agentId ?? "Unassigned"}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        textAlign: "right",
                      }}
                    >
                      <button
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: 600,
                          color: "var(--color-primary)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "var(--space-1) var(--space-2)",
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
        </div>
      )}
    </div>
  );
}
