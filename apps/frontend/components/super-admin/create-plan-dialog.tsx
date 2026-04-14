"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
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
        <Button size="sm" variant="default" className="gap-2">
          <Plus size={14} /> New Plan
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Create Subscription Plan</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <Label>Plan Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={set}
              required
              minLength={2}
              placeholder="e.g. Starter"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Input
              name="description"
              value={form.description}
              onChange={set}
              placeholder="Brief description"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Price (₹)</Label>
            <Input
              name="price"
              value={form.price}
              onChange={set}
              required
              placeholder="999.00"
            />
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
                placeholder="500"
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
                placeholder="10"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md border border-destructive/20">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create Plan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
