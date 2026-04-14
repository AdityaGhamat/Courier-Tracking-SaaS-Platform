"use client";

import { useState, useEffect } from "react";
import { hubsApi, shipmentsApi } from "@/lib/api";
import { Package, Plus, X, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Shipment {
  id: string;
  trackingNumber: string; // backend field is trackingNumber not trackingId
  status: string;
  recipientName?: string;
  hubId?: string | null;
}

// ── Assign Dialog ────────────────────────────────────────────────
function AssignDialog({
  hubId,
  onClose,
  onDone,
}: {
  hubId: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loadingShipments, setLoadingShipments] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    shipmentsApi
      .list()
      .then((res: any) => {
        // listShipments returns: { data: { shipments: [...], page, limit } }
        const all: Shipment[] = res?.data?.shipments ?? res?.data ?? [];
        // Only show shipments not already assigned to any hub
        setShipments(all.filter((s) => !s.hubId));
      })
      .finally(() => setLoadingShipments(false));
  }, []);

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) return;
    setLoading(true);
    setError("");
    try {
      // selectedId is parcels.id (UUID), NOT the tracking number
      await hubsApi.assignShipment(selectedId, hubId);
      onDone();
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Failed to assign shipment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-bold text-slate-900">
            Assign Shipment to Hub
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleAssign} className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">
              Select Shipment *
            </label>

            {loadingShipments ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                <Loader2 size={13} className="animate-spin" />
                Loading shipments...
              </div>
            ) : shipments.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                No unassigned shipments available.
              </p>
            ) : (
              <select
                required
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">-- Pick a shipment --</option>
                {shipments.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.trackingNumber} — {s.recipientName ?? "Unknown"} (
                    {s.status?.replace(/_/g, " ")})
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedId || loadingShipments}
              className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Shipments Drawer ─────────────────────────────────────────────
function ShipmentsDrawer({
  hubId,
  hubName,
  onClose,
}: {
  hubId: string;
  hubName: string;
  onClose: () => void;
}) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssign, setShowAssign] = useState(false);

  function loadShipments() {
    setLoading(true);
    hubsApi
      .getShipments(hubId)
      .then((res: any) => {
        // getHubShipments returns array directly in data (no pagination wrapper)
        const list = Array.isArray(res?.data)
          ? res.data
          : (res?.data?.shipments ?? []);
        setShipments(list);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadShipments();
  }, [hubId]);

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex justify-end bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          // In ShipmentsDrawer — replace the header buttons div:
          <div className="flex items-center gap-2">
            <Link
              href={`/hubs/${hubId}`}
              className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors no-underline"
            >
              <ChevronRight size={11} /> Full View
            </Link>
            <button
              onClick={() => setShowAssign(true)}
              className="flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition-colors"
            >
              <Plus size={11} /> Assign
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>
          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={24} className="animate-spin text-indigo-400" />
              </div>
            ) : shipments.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <Package size={32} className="text-slate-300" />
                <p className="text-sm font-semibold text-slate-500">
                  No shipments at this hub
                </p>
                <p className="text-xs text-slate-400">
                  Assign a shipment to see it here.
                </p>
                <button
                  onClick={() => setShowAssign(true)}
                  className="mt-1 flex items-center gap-1 rounded-lg bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
                >
                  <Plus size={11} /> Assign a Shipment
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {shipments.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 hover:border-indigo-100 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-800 font-mono truncate">
                        {s.trackingNumber}
                      </p>
                      <span className="shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-600 capitalize">
                        {s.status?.replace(/_/g, " ")}
                      </span>
                    </div>
                    {s.recipientName && (
                      <p className="mt-1 text-xs text-slate-500">
                        To: {s.recipientName}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAssign && (
        <AssignDialog
          hubId={hubId}
          onClose={() => setShowAssign(false)}
          onDone={loadShipments}
        />
      )}
    </>
  );
}

// ── Export ───────────────────────────────────────────────────────
export function HubShipmentsButton({
  hubId,
  hubName,
}: {
  hubId: string;
  hubName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-slate-100"
      >
        <Package size={12} /> Shipments <ChevronRight size={11} />
      </button>
      {open && (
        <ShipmentsDrawer
          hubId={hubId}
          hubName={hubName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
