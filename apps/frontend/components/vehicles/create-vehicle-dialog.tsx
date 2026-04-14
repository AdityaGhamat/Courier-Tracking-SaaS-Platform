"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, Hash, Weight } from "lucide-react";
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

// Matches backend createVehicleSchema EXACTLY:
// type: enum["bike","car","van","truck"]
// licensePlate: string min2 max20
// capacityKg?: string (optional)
// NOTE: agentId is NOT part of create — use assign endpoint separately

const VEHICLE_TYPES = ["bike", "car", "van", "truck"] as const;
type VehicleType = (typeof VEHICLE_TYPES)[number];

interface CreateVehicleForm {
  licensePlate: string;
  type: VehicleType;
  capacityKg: string;
}

const EMPTY: CreateVehicleForm = {
  licensePlate: "",
  type: "van",
  capacityKg: "",
};

const inputCls =
  "bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 text-sm";

export function CreateVehicleDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateVehicleForm>(EMPTY);

  const set = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setForm(EMPTY);
      setError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await vehiclesApi.create({
        licensePlate: form.licensePlate.toUpperCase(),
        type: form.type,
        ...(form.capacityKg.trim() && { capacityKg: form.capacityKg.trim() }),
      });
      handleOpenChange(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to register vehicle");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="gap-2 font-semibold text-white border-none"
          style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
        >
          <Truck size={15} /> Add Vehicle
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 overflow-hidden sm:max-w-[420px] gap-0 rounded-xl border-slate-200">
        <div
          className="px-6 py-5 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)" }}
        >
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Truck size={18} className="text-indigo-300" />
          </div>
          <div>
            <DialogTitle className="text-white font-bold text-base leading-tight m-0 p-0">
              Register Vehicle
            </DialogTitle>
            <p className="text-indigo-300 text-xs mt-0.5">
              Add a vehicle to your fleet
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                License Plate <span className="text-red-400">*</span>
              </Label>
              <Input
                name="licensePlate"
                placeholder="MH01AB1234"
                value={form.licensePlate}
                onChange={set}
                required
                minLength={2}
                maxLength={20}
                className={`${inputCls} font-mono uppercase`}
              />
              <p className="text-xs text-slate-400">2–20 characters</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Vehicle Type <span className="text-red-400">*</span>
              </Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, type: v as VehicleType }))
                }
              >
                <SelectTrigger className={inputCls}>
                  <SelectValue placeholder="Select type" />
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
                Capacity (kg) — optional
              </Label>
              <Input
                name="capacityKg"
                placeholder="500"
                value={form.capacityKg}
                onChange={set}
                className={inputCls}
              />
              <p className="text-xs text-slate-400">
                To assign an agent, use the <strong>Manage</strong> button after
                creation
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
              onClick={() => handleOpenChange(false)}
              className="border-slate-200 text-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="gap-2 font-semibold text-white border-none"
              style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
            >
              <Truck size={14} />
              {loading ? "Registering…" : "Register Vehicle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
