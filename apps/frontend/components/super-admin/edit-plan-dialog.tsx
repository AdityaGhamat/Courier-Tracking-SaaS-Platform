"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Sparkles } from "lucide-react";
import { superAdminApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SubscriptionPlan } from "@/types/super-admin.types";

const inputCls =
  "bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 text-sm";

export function EditPlanDialog({ plan }: { plan: SubscriptionPlan }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: plan.name,
    description: plan.description ?? "",
    price: plan.price,
    maxShipments: String(plan.maxShipments),
    maxAgents: String(plan.maxAgents),
    isActive: plan.isActive,
  });

  const set = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await superAdminApi.updatePlan(plan.id, {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: form.price.trim(),
        maxShipments: Number(form.maxShipments),
        maxAgents: Number(form.maxAgents),
        isActive: form.isActive,
      });
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to update plan");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete plan "${plan.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await superAdminApi.deletePlan(plan.id);
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete plan");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-100">
          <Pencil size={11} /> Edit
        </button>
      </DialogTrigger>

      <DialogContent className="p-0 overflow-hidden sm:max-w-[440px] gap-0 rounded-xl border-slate-200">
        <div
          className="px-6 py-5 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)" }}
        >
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Sparkles size={18} className="text-indigo-300" />
          </div>
          <div>
            <DialogTitle className="text-white font-bold text-base leading-tight m-0 p-0">
              Edit Plan
            </DialogTitle>
            <p className="text-indigo-300 font-semibold text-xs mt-0.5">
              {plan.name}
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Plan Name
              </Label>
              <Input
                name="name"
                value={form.name}
                onChange={set}
                required
                minLength={2}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Description
              </Label>
              <Input
                name="description"
                value={form.description}
                onChange={set}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Price
              </Label>
              <Input
                name="price"
                value={form.price}
                onChange={set}
                required
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Max Shipments
                </Label>
                <Input
                  name="maxShipments"
                  type="number"
                  min={1}
                  value={form.maxShipments}
                  onChange={set}
                  required
                  className={inputCls}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Max Agents
                </Label>
                <Input
                  name="maxAgents"
                  type="number"
                  min={1}
                  value={form.maxAgents}
                  onChange={set}
                  required
                  className={inputCls}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((p) => ({ ...p, isActive: e.target.checked }))
                }
                className="w-4 h-4 accent-indigo-600"
              />
              <Label
                htmlFor="isActive"
                className="text-sm text-slate-700 cursor-pointer"
              >
                Plan is active (visible to tenants)
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
      </DialogContent>
    </Dialog>
  );
}
