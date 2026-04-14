"use client";

import { useState } from "react";
import { MapPin, FileText, Upload, Image as ImageIcon } from "lucide-react";
import { shipmentsApi, uploadApi } from "@/lib/api";
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

const ALL_STATUS_OPTIONS: { label: string; value: ShipmentStatus }[] = [
  { label: "Label Created", value: "label_created" },
  { label: "Picked Up", value: "picked_up" },
  { label: "At Sorting Facility", value: "at_sorting_facility" },
  { label: "In Transit", value: "in_transit" },
  { label: "Out for Delivery", value: "out_for_delivery" },
  { label: "Delivered", value: "delivered" },
  { label: "Failed", value: "failed" },
  { label: "Retry", value: "retry" },
  { label: "Returned", value: "returned" },
];

/** Statuses a delivery_agent is allowed to set */
export const AGENT_ALLOWED_STATUSES: ShipmentStatus[] = [
  "picked_up",
  "out_for_delivery",
  "delivered",
  "failed",
  "retry",
];

interface Props {
  shipmentId: string;
  currentStatus: ShipmentStatus;
  /**
   * When provided, the dropdown is scoped to only these statuses.
   * Omit (or pass undefined) to show the full admin list.
   */
  allowedStatuses?: ShipmentStatus[];
  onDone?: () => void;
}

export function UpdateStatusDialog({
  shipmentId,
  currentStatus,
  allowedStatuses,
  onDone,
}: Props) {
  const statusOptions = allowedStatuses
    ? ALL_STATUS_OPTIONS.filter((o) => allowedStatuses.includes(o.value))
    : ALL_STATUS_OPTIONS;

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ShipmentStatus>(
    statusOptions.find((o) => o.value !== currentStatus)?.value ??
      currentStatus,
  );
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsProof = status === "delivered";

  function resetForm() {
    setStatus(
      statusOptions.find((o) => o.value !== currentStatus)?.value ??
        currentStatus,
    );
    setLocation("");
    setDescription("");
    setProofFile(null);
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) resetForm();
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
    if (needsProof && !proofFile) {
      setError(
        "Proof of delivery image is required before marking as delivered",
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (needsProof && proofFile) {
        await uploadApi.uploadDeliveryProof(shipmentId, proofFile);
      }

      await shipmentsApi.updateStatus(shipmentId, {
        status,
        location: location.trim(),
        description: description.trim(),
      });

      handleOpenChange(false);
      onDone?.();
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

      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Update Shipment Status</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
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
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
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

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
              <FileText size={11} /> Description{" "}
              <span className="text-red-400">*</span>
            </Label>
            <Input
              placeholder={
                needsProof
                  ? "Package handed over to recipient"
                  : "Package arrived at sorting facility"
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className={inputCls}
            />
          </div>

          {/* Proof of delivery — only when status === "delivered" */}
          {needsProof && (
            <div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <Label className="text-xs font-semibold text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
                <Upload size={11} /> Proof of Delivery{" "}
                <span className="text-red-500">*</span>
              </Label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-amber-300 bg-white px-3 py-3 text-sm text-slate-700 hover:border-amber-400 hover:bg-amber-50/40 transition-colors">
                <ImageIcon size={16} className="text-amber-700 shrink-0" />
                <span className="flex-1 truncate">
                  {proofFile ? proofFile.name : "Choose delivery proof image"}
                </span>
                <span className="text-xs font-semibold text-amber-700">
                  Browse
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                />
              </label>

              <p className="text-xs text-amber-700">
                Upload a photo before marking this shipment as delivered.
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          {/* Footer */}
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
              {loading
                ? needsProof
                  ? "Uploading & Saving…"
                  : "Saving…"
                : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
