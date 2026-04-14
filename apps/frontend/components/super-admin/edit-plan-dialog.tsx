"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { superAdminApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SubscriptionPlan } from "@/types/super-admin.types";

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
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20">
          <Pencil size={11} /> Edit
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Edit Plan: {plan.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <Label>Plan Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={set}
              required
              minLength={2}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Input name="description" value={form.description} onChange={set} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Price (₹)</Label>
            <Input name="price" value={form.price} onChange={set} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label>Max Shipments</Label>
              <Input
                name="maxShipments"
                type="number"
                min={1}
                value={form.maxShipments}
                onChange={set}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Max Agents</Label>
              <Input
                name="maxAgents"
                type="number"
                min={1}
                value={form.maxAgents}
                onChange={set}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg border border-border mt-2">
            <input
              type="checkbox"
              id={`isActive-${plan.id}`}
              checked={form.isActive}
              onChange={(e) =>
                setForm((p) => ({ ...p, isActive: e.target.checked }))
              }
              className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-primary"
            />
            <Label
              htmlFor={`isActive-${plan.id}`}
              className="text-sm cursor-pointer"
            >
              Plan is active (visible to tenants)
            </Label>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md border border-destructive/20">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between mt-4 border-t border-border pt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
            >
              <Trash2 size={13} /> {deleting ? "Deleting…" : "Delete"}
            </button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
