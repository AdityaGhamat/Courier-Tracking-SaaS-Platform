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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ShipmentStatus } from "@/types/shipment.types";

const STATUS_OPTIONS: { label: string; value: ShipmentStatus }[] = [
  { label: "Label Created", value: "label_created" },
  { label: "Picked Up", value: "picked_up" },
  { label: "At Sorting Facility", value: "at_sorting_facility" },
  { label: "In Transit", value: "in_transit" },
  { label: "Out for Delivery", value: "out_for_delivery" },
  { label: "Delivered", value: "delivered" },
  { label: "Failed", value: "failed" },
  { label: "Retry", value: "retry" },
  { label: "Returned", value: "returned" },
  { label: "Exception", value: "exception" },
];

interface Props {
  shipmentId: string;
  currentStatus: ShipmentStatus;
}

export function UpdateStatusDialog({ shipmentId, currentStatus }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ShipmentStatus>(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setStatus(currentStatus);
      setError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await shipmentsApi.updateStatus(shipmentId, { status });
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Update Status</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Shipment Status</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="status">New Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as ShipmentStatus)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || status === currentStatus}
            >
              {loading ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
