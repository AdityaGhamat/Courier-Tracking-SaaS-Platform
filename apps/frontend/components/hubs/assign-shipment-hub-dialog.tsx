"use client";

import { useState, useEffect } from "react";
import { PackagePlus } from "lucide-react";
import { hubsApi, shipmentsApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Shipment {
  id: string;
  trackingNumber: string;
  recipientName: string;
}

interface Props {
  hubId: string;
  hubName: string;
  onDone?: () => void;
}

export function AssignShipmentHubDialog({ hubId, hubName, onDone }: Props) {
  const [open, setOpen] = useState(false);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipmentId, setSelectedShipmentId] = useState("");
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setFetching(true);
    (shipmentsApi.list({ page: 1, limit: 50 }) as Promise<any>)
      .then((res: any) => {
        const list: Shipment[] = res?.data?.shipments ?? res?.data ?? [];
        setShipments(list);
      })
      .catch(() => setShipments([]))
      .finally(() => setFetching(false));
  }, [open]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setSelectedShipmentId("");
      setError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedShipmentId) return;
    setLoading(true);
    setError(null);
    try {
      await (hubsApi.assignShipment(selectedShipmentId, hubId) as Promise<any>);
      handleOpenChange(false);
      onDone?.();
    } catch (err: any) {
      setError(err?.message ?? "Failed to assign shipment");
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
          className="gap-1.5 text-xs border-emerald-200 text-emerald-600 hover:bg-emerald-50"
        >
          <PackagePlus size={13} />
          Assign Shipment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Assign Shipment to {hubName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Select Shipment <span className="text-red-400">*</span>
            </Label>
            {fetching ? (
              <p className="text-sm text-slate-400">Loading shipments…</p>
            ) : shipments.length === 0 ? (
              <p className="text-sm text-red-400">No shipments found.</p>
            ) : (
              <select
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                value={selectedShipmentId}
                onChange={(e) => setSelectedShipmentId(e.target.value)}
                required
              >
                <option value="">— Select shipment —</option>
                {shipments.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.trackingNumber} — {s.recipientName}
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md border border-destructive/20">
              {error}
            </p>
          )}

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
              disabled={loading || fetching || !selectedShipmentId}
              style={{
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
              }}
            >
              {loading ? "Assigning…" : "Assign"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
