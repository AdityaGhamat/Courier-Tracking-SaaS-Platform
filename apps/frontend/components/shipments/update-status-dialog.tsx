"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, FileText } from "lucide-react";
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
  // FIX: add location + description — both required by backend
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setStatus(currentStatus);
      setLocation("");
      setDescription("");
      setError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!location.trim()) {
      setError("Location is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await shipmentsApi.updateStatus(shipmentId, {
        status,
        location: location.trim(),
        description: description.trim(),
      });
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "bg-slate-50 border-slate-200 focus:border-indigo-400 text-sm";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Update Status</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Update Shipment Status</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              New Status <span className="text-red-400">*</span>
            </Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as ShipmentStatus)}
            >
              <SelectTrigger className={inputCls}>
                <SelectValue />
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

          {/* Location — required by backend */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
              <MapPin size={11} /> Current Location{" "}
              <span className="text-red-400">*</span>
            </Label>
            <Input
              placeholder="Mumbai Sorting Hub, Andheri East"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className={inputCls}
            />
          </div>

          {/* Description — required by backend */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
              <FileText size={11} /> Description{" "}
              <span className="text-red-400">*</span>
            </Label>
            <Input
              placeholder="Package arrived at sorting facility"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className={inputCls}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md border border-destructive/20">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-1">
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
              className="font-semibold text-white border-none"
              style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
            >
              {loading ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
