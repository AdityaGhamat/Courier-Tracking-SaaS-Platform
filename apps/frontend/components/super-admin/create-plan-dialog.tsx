"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles } from "lucide-react";
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

const inputCls =
  "bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 text-sm";

export function CreatePlanDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    maxShipments: "",
    maxAgents: "",
  });

  const set = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await superAdminApi.createPlan({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: form.price.trim(),
        maxShipments: Number(form.maxShipments),
        maxAgents: Number(form.maxAgents),
      });
      setOpen(false);
      setForm({
        name: "",
        description: "",
        price: "",
        maxShipments: "",
        maxAgents: "",
      });
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to create plan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="gap-2 text-sm font-semibold text-white border-none"
          style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
        >
          <Plus size={14} /> New Plan
        </Button>
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
              Create Subscription Plan
            </DialogTitle>
            <p className="text-indigo-300 text-xs mt-0.5">
              Define pricing and limits
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Plan Name <span className="text-red-400">*</span>
              </Label>
              <Input
                name="name"
                value={form.name}
                onChange={set}
                placeholder="e.g. Starter, Pro, Enterprise"
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
                placeholder="Brief description of the plan"
                className={inputCls}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Price <span className="text-red-400">*</span>
              </Label>
              <Input
                name="price"
                value={form.price}
                onChange={set}
                placeholder="e.g. 999.00"
                required
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Max Shipments <span className="text-red-400">*</span>
                </Label>
                <Input
                  name="maxShipments"
                  type="number"
                  min={1}
                  value={form.maxShipments}
                  onChange={set}
                  placeholder="500"
                  required
                  className={inputCls}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Max Agents <span className="text-red-400">*</span>
                </Label>
                <Input
                  name="maxAgents"
                  type="number"
                  min={1}
                  value={form.maxAgents}
                  onChange={set}
                  placeholder="10"
                  required
                  className={inputCls}
                />
              </div>
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
              className="font-semibold text-sm text-white border-none"
              style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
            >
              {loading ? "Creating…" : "Create Plan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
