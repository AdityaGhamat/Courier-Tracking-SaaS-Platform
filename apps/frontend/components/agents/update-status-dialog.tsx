"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { shipmentsApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Full lifecycle from the doc
const STATUS_OPTIONS = [
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

interface Props {
  shipmentId: string;
  currentStatus: string;
  onDone?: () => void;
}

export function UpdateStatusDialog({
  shipmentId,
  currentStatus,
  onDone,
}: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);
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
    setLoading(true);
    setError(null);
    try {
      await (shipmentsApi.updateStatus(shipmentId, {
        status,
        location: location.trim(),
        description: description.trim(),
      }) as Promise<any>);
      handleOpenChange(false);
      onDone?.();
    } catch (err: any) {
      setError(err?.message ?? "Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 text-xs border-orange-200 text-orange-600 hover:bg-orange-50"
        >
          <RefreshCw size={12} />
          Update Status
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 overflow-hidden sm:max-w-[400px] rounded-xl border-slate-200">
        <div
          className="px-6 py-5 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg,#7c2d12,#c2410c)" }}
        >
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <RefreshCw size={18} className="text-orange-300" />
          </div>
          <div>
            <DialogTitle className="text-white font-bold text-base leading-tight m-0 p-0">
              Update Shipment Status
            </DialogTitle>
            <p className="text-orange-200 text-xs mt-0.5">
              Creates a new tracking event history entry
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 flex flex-col gap-4">
            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                New Status <span className="text-red-400">*</span>
              </Label>
              <select
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Current Location <span className="text-red-400">*</span>
              </Label>
              <Input
                placeholder="e.g. Mumbai Sorting Hub, Maharashtra"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="bg-slate-50 border-slate-200 focus:border-orange-400 focus:ring-orange-400/20 text-sm"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Description <span className="text-red-400">*</span>
              </Label>
              <Input
                placeholder="e.g. Package arrived at sorting facility"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="bg-slate-50 border-slate-200 focus:border-orange-400 focus:ring-orange-400/20 text-sm"
              />
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
              style={{ background: "linear-gradient(135deg,#ea580c,#c2410c)" }}
            >
              <RefreshCw size={14} />
              {loading ? "Updating…" : "Update Status"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
