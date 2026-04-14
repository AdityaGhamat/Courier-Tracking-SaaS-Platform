"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Truck, Trash2, UserCheck, UserX } from "lucide-react";
import { vehiclesApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Vehicle } from "@/types";

// Backend updateVehicleSchema: type?, licensePlate?, capacityKg?, isAvailable?
// Backend assignAgentToVehicle: { agentId: uuid } → PATCH /vehicles/:id/assign-agent
// Backend unassignAgent: DELETE /vehicles/:id/unassign-agent

const VEHICLE_TYPES = ["bike", "car", "van", "truck"] as const;
type VehicleType = (typeof VEHICLE_TYPES)[number];

const inputCls =
  "bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 text-sm";

// We need to extend vehiclesApi with the assign endpoints
// Add these to apps/frontend/lib/api.ts (see note at bottom)
function assignAgentApi(vehicleId: string, agentId: string) {
  return fetch(`/api/proxy/vehicles/${vehicleId}/assign-agent`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agentId }),
  }).then(async (r) => {
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error((d as any)?.message ?? "Failed to assign agent");
    return d;
  });
}

function unassignAgentApi(vehicleId: string) {
  return fetch(`/api/proxy/vehicles/${vehicleId}/unassign-agent`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  }).then(async (r) => {
    const d = await r.json().catch(() => ({}));
    if (!r.ok)
      throw new Error((d as any)?.message ?? "Failed to unassign agent");
    return d;
  });
}

export function EditVehicleDialog({ vehicle }: { vehicle: Vehicle }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"edit" | "assign">("edit");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    licensePlate: vehicle.licensePlate ?? "",
    type: (vehicle.type ?? "van") as VehicleType,
    capacityKg: (vehicle as any).capacityKg ?? "",
    isAvailable: (vehicle as any).isAvailable ?? true,
  });
  const [agentId, setAgentId] = useState("");

  const set = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body: Record<string, string | boolean> = {};
      if (form.licensePlate.trim())
        body.licensePlate = form.licensePlate.toUpperCase();
      if (form.type) body.type = form.type;
      if (form.capacityKg.trim()) body.capacityKg = form.capacityKg.trim();
      body.isAvailable = form.isAvailable;

      await vehiclesApi.update(vehicle.id, body);
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to update vehicle");
    } finally {
      setLoading(false);
    }
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!agentId.trim()) {
      setError("Agent ID is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await assignAgentApi(vehicle.id, agentId.trim());
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to assign agent");
    } finally {
      setLoading(false);
    }
  }

  async function handleUnassign() {
    if (!confirm("Unassign current agent from this vehicle?")) return;
    setLoading(true);
    setError(null);
    try {
      await unassignAgentApi(vehicle.id);
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to unassign agent");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        `Delete vehicle "${vehicle.licensePlate}"? This cannot be undone.`,
      )
    )
      return;
    setDeleting(true);
    try {
      await vehiclesApi.delete(vehicle.id);
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete vehicle");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-100">
          <Pencil size={12} /> Manage
        </button>
      </DialogTrigger>

      <DialogContent className="p-0 overflow-hidden sm:max-w-[440px] gap-0 rounded-xl border-slate-200">
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)" }}
        >
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Truck size={18} className="text-indigo-300" />
          </div>
          <div>
            <DialogTitle className="text-white font-bold text-base leading-tight m-0 p-0">
              Manage Vehicle
            </DialogTitle>
            <p className="text-indigo-300 font-mono text-xs mt-0.5">
              {vehicle.licensePlate}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-white">
          {(["edit", "assign"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTab(t);
                setError(null);
              }}
              className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
                tab === t
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t === "edit" ? "Edit Details" : "Assign Agent"}
            </button>
          ))}
        </div>

        {/* Edit tab */}
        {tab === "edit" && (
          <form onSubmit={handleUpdate}>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  License Plate
                </Label>
                <Input
                  name="licensePlate"
                  value={form.licensePlate}
                  onChange={set}
                  minLength={2}
                  maxLength={20}
                  className={`${inputCls} font-mono uppercase`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Vehicle Type
                </Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, type: v as VehicleType }))
                  }
                >
                  <SelectTrigger className={inputCls}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VEHICLE_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="capitalize">
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Capacity (kg)
                </Label>
                <Input
                  name="capacityKg"
                  value={form.capacityKg}
                  onChange={set}
                  placeholder="500"
                  className={inputCls}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={form.isAvailable}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isAvailable: e.target.checked }))
                  }
                  className="w-4 h-4 accent-indigo-600"
                />
                <Label
                  htmlFor="isAvailable"
                  className="text-sm text-slate-700 cursor-pointer"
                >
                  Available for assignment
                </Label>
              </div>
            </div>

            {error && (
              <div className="mx-6 mb-3 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <Trash2 size={13} /> {deleting ? "Deleting…" : "Delete"}
              </button>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="border-slate-200 text-slate-600 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="font-semibold text-sm text-white border-none"
                  style={{
                    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                  }}
                >
                  {loading ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Assign tab */}
        {tab === "assign" && (
          <form onSubmit={handleAssign}>
            <div className="px-6 py-5 flex flex-col gap-4">
              {vehicle.agentId && (
                <div className="flex items-center justify-between px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <p className="text-xs font-semibold text-green-700">
                      Currently Assigned
                    </p>
                    <p className="text-xs font-mono text-green-600 mt-0.5">
                      {vehicle.agentId}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUnassign}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 bg-white border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <UserX size={12} /> Unassign
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Agent ID <span className="text-red-400">*</span>
                </Label>
                <Input
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  required
                  className={`${inputCls} font-mono`}
                />
                <p className="text-xs text-slate-400">
                  Must be a valid agent UUID
                </p>
              </div>
            </div>

            {error && (
              <div className="mx-6 mb-3 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-slate-200 text-slate-600 text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="gap-2 font-semibold text-sm text-white border-none"
                style={{
                  background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                }}
              >
                <UserCheck size={14} />
                {loading ? "Assigning…" : "Assign Agent"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
