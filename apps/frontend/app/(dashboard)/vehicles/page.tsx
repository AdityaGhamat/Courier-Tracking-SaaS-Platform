import { Car, Truck, Bike, AlertTriangle, Plus } from "lucide-react";
import { serverFetch } from "@/lib/server-api";
import { getSessionUser } from "@/lib/session";
import { CreateVehicleDialog } from "@/components/vehicles/create-vehicle-dialog";
import { EditVehicleDialog } from "@/components/vehicles/edit-vehicle-dialog";
import { VehicleActions } from "@/components/vehicles/vehicle-actions";
import type { Vehicle } from "@/types";

// ── Types ─────────────────────────────────────────────────────────────────────

interface VehicleWithDriver extends Vehicle {
  driver?: { id: string; name: string; email: string } | null;
}

interface MyVehicleResponse {
  data: Vehicle;
}

interface ListVehiclesResponse {
  data: VehicleWithDriver[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const TYPE_META: Record<
  string,
  { bg: string; text: string; border: string; label: string }
> = {
  bike: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    label: "Bike",
  },
  van: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    label: "Van",
  },
  truck: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    label: "Truck",
  },
  car: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    label: "Car",
  },
  auto: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    label: "Auto",
  },
};

const TYPE_ICON: Record<string, React.ElementType> = {
  bike: Bike,
  van: Car,
  truck: Truck,
  car: Car,
  auto: Car,
};

function VehicleTypeBadge({ type }: { type: string }) {
  const meta = TYPE_META[type] ?? {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    label: type,
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border w-fit ${meta.bg} ${meta.text} ${meta.border}`}
    >
      {meta.label}
    </span>
  );
}

// ── Agent view — single read-only card ────────────────────────────────────────

function AgentVehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const meta = TYPE_META[vehicle.type] ?? {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    label: vehicle.type,
  };
  const Icon = TYPE_ICON[vehicle.type] ?? Car;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm max-w-md w-full">
      {/* Header strip */}
      <div
        className={`flex items-center gap-3 px-5 py-4 border-b ${meta.border} ${meta.bg}`}
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${meta.bg} border ${meta.border}`}
        >
          <Icon size={20} className={meta.text} />
        </div>
        <div>
          <p
            className={`text-xs font-bold uppercase tracking-wider ${meta.text}`}
          >
            Your Vehicle
          </p>
          <p className="font-mono font-bold text-base text-foreground tracking-wide">
            {vehicle.licensePlate}
          </p>
        </div>
        <VehicleTypeBadge type={vehicle.type} />
      </div>

      {/* Details */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <Row label="Type" value={vehicle.type} capitalize />
        <Row
          label="Capacity"
          value={vehicle.capacityKg ? `${vehicle.capacityKg} kg` : null}
        />
        <Row
          label="Availability"
          value={
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                vehicle.isAvailable
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-600 border-red-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  vehicle.isAvailable ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {vehicle.isAvailable ? "Available" : "In Use"}
            </span>
          }
        />
        <Row
          label="Registered"
          value={new Date(vehicle.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  capitalize = false,
}: {
  label: string;
  value: React.ReactNode;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
        {label}
      </span>
      <span
        className={`text-sm font-medium text-foreground text-right ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value ?? <span className="text-muted-foreground italic">—</span>}
      </span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function VehiclesPage() {
  const user = await getSessionUser();
  const isAgent = user?.role === "delivery_agent";

  // ── Agent branch ─────────────────────────────────────────────────────────────
  if (isAgent) {
    let vehicle: Vehicle | null = null;
    let fetchError: string | null = null;

    try {
      const res = await serverFetch<MyVehicleResponse>("vehicles/my");
      vehicle = res.data ?? null;
    } catch (err: any) {
      // 404 = no vehicle assigned — not a real error, just show empty state
      if (err?.statusCode !== 404) {
        fetchError = err?.message ?? "Failed to load vehicle";
      }
    }

    return (
      <div className="flex flex-col gap-6 w-full">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <Car size={18} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">My Vehicle</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Vehicle assigned to you by your workspace admin
            </p>
          </div>
        </div>

        {/* Error */}
        {fetchError && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20">
            <AlertTriangle size={15} className="shrink-0" />
            <span>{fetchError}</span>
          </div>
        )}

        {/* Vehicle card or empty state */}
        {!fetchError &&
          (vehicle ? (
            <AgentVehicleCard vehicle={vehicle} />
          ) : (
            <div className="py-16 flex flex-col items-center gap-3 border border-dashed border-border rounded-2xl text-center bg-muted/30">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                <Car size={24} className="text-muted-foreground/40" />
              </div>
              <p className="font-semibold text-foreground">
                No vehicle assigned
              </p>
              <p className="text-sm text-muted-foreground max-w-[260px]">
                Your workspace admin hasn't assigned a vehicle to you yet.
              </p>
            </div>
          ))}
      </div>
    );
  }

  // ── Admin branch ──────────────────────────────────────────────────────────────
  let vehicles: VehicleWithDriver[] = [];
  let fetchError: string | null = null;

  try {
    const res = await serverFetch<ListVehiclesResponse>("vehicles");
    vehicles = res.data ?? [];
  } catch (err: any) {
    fetchError = err?.message ?? "Failed to load vehicles";
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <Truck size={18} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Fleet</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""}{" "}
              registered
            </p>
          </div>
        </div>
        <CreateVehicleDialog />
      </div>

      {/* Error */}
      {fetchError && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20">
          <AlertTriangle size={15} className="shrink-0" />
          <span>{fetchError}</span>
        </div>
      )}

      {/* Empty state */}
      {!fetchError && vehicles.length === 0 && (
        <div className="py-16 flex flex-col items-center gap-3 border border-dashed border-border rounded-2xl text-center bg-muted/30">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <Truck size={24} className="text-muted-foreground/40" />
          </div>
          <p className="font-semibold text-foreground">
            No vehicles registered
          </p>
          <p className="text-sm text-muted-foreground">
            Add vehicles to assign them to delivery agents.
          </p>
          <div className="mt-2">
            <CreateVehicleDialog />
          </div>
        </div>
      )}

      {/* Fleet grid */}
      {!fetchError && vehicles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {vehicles.map((v) => {
            const Icon = TYPE_ICON[v.type] ?? Car;
            return (
              <div
                key={v.id}
                className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
              >
                {/* Top: plate + type + edit */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <Icon
                        size={15}
                        className="text-muted-foreground shrink-0"
                      />
                      <span className="font-mono font-bold text-base text-foreground tabular-nums tracking-wide">
                        {v.licensePlate}
                      </span>
                    </div>
                    <VehicleTypeBadge type={v.type} />
                  </div>
                  <EditVehicleDialog vehicle={v} />
                </div>

                {/* Capacity */}
                {v.capacityKg && (
                  <div className="text-xs text-muted-foreground">
                    Capacity:{" "}
                    <span className="font-semibold text-foreground tabular-nums">
                      {v.capacityKg} kg
                    </span>
                  </div>
                )}

                {/* Assigned agent */}
                <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-muted/50 border border-border">
                  {v.driver ? (
                    <>
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 text-primary-foreground text-[10px] font-bold">
                        {v.driver.name?.[0]?.toUpperCase() ?? "A"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {v.driver.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {v.driver.email}
                        </p>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      No agent assigned
                    </span>
                  )}
                </div>

                {/* Availability dot */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      v.isAvailable ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {v.isAvailable ? "Available" : "In Use"}
                  </span>
                </div>

                {/* Actions */}
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
