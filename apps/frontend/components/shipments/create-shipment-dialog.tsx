"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { shipmentsApi } from "@/lib/api";
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
import type { CreateShipmentInput } from "@/types/shipment.types";

const EMPTY_FORM: CreateShipmentInput = {
  recipientName: "",
  recipientAddress: "",
  recipientPhone: "",
  recipientEmail: "",
  weight: "",
  estimatedDelivery: "",
  hubId: "",
};

export function CreateShipmentDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateShipmentInput>(EMPTY_FORM);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: CreateShipmentInput = {
      recipientName: form.recipientName,
      recipientAddress: form.recipientAddress,
      ...(form.recipientPhone && { recipientPhone: form.recipientPhone }),
      ...(form.recipientEmail && { recipientEmail: form.recipientEmail }),
      ...(form.weight && { weight: form.weight }),
      ...(form.estimatedDelivery && {
        estimatedDelivery: new Date(form.estimatedDelivery).toISOString(),
      }),
      ...(form.hubId && { hubId: form.hubId }),
    };

    try {
      await shipmentsApi.create(payload);
      setOpen(false);
      setForm(EMPTY_FORM);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to create shipment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#fd761a] hover:bg-[#ea620c] text-white border-transparent">
          + New Shipment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Create Shipment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="recipientName">Recipient Name *</Label>
              <Input
                id="recipientName"
                name="recipientName"
                placeholder="John Doe"
                value={form.recipientName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="recipientPhone">Phone</Label>
              <Input
                id="recipientPhone"
                name="recipientPhone"
                placeholder="+91 9876543210"
                value={form.recipientPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="recipientAddress">Delivery Address *</Label>
            <Input
              id="recipientAddress"
              name="recipientAddress"
              placeholder="123 Main St, Mumbai, Maharashtra"
              value={form.recipientAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="recipientEmail">Recipient Email</Label>
            <Input
              id="recipientEmail"
              name="recipientEmail"
              type="email"
              placeholder="john@example.com"
              value={form.recipientEmail}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                placeholder="2.5"
                value={form.weight}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="estimatedDelivery">Est. Delivery</Label>
              <Input
                id="estimatedDelivery"
                name="estimatedDelivery"
                type="datetime-local"
                value={form.estimatedDelivery}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="hubId">Hub ID (optional)</Label>
            <Input
              id="hubId"
              name="hubId"
              placeholder="UUID of the hub"
              value={form.hubId}
              onChange={handleChange}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#fd761a] hover:bg-[#ea620c] text-white border-transparent"
            >
              {loading ? "Creating…" : "Create Shipment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
