"use client";

import { useState } from "react";
import { hubsApi } from "@/lib/api";
import { Package, Plus, X, Loader2, ChevronRight } from "lucide-react";

interface Shipment {
  id: string;
  trackingId: string;
  status: string;
  recipientName?: string;
}

function AssignDialog({
  hubId,
  onClose,
  onDone,
}: {
  hubId: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const [shipmentId, setShipmentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!shipmentId.trim()) return;
    setLoading(true);
    setError("");
    try {
      await hubsApi.assignShipment(shipmentId.trim(), hubId);
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">
              Shipment ID *
            </label>
            <input
              required
              value={shipmentId}
              onChange={(e) => setShipmentId(e.target.value)}
              placeholder="Paste shipment UUID"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
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
              disabled={loading}
              className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={13} className="animate-spin" />} Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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

  useState(() => {
    hubsApi
      .getShipments(hubId)
      .then((res: any) => {
        setShipments(res?.data ?? res ?? []);
      })
      .finally(() => setLoading(false));
  });

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
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">{hubName}</h2>
              <p className="text-xs text-slate-500">Assigned shipments</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAssign(true)}
                className="flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
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
          </div>

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
                    className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800 font-mono">
                        {s.trackingId}
                      </p>
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-600 capitalize">
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
          onDone={() => {
            setLoading(true);
            hubsApi
              .getShipments(hubId)
              .then((res: any) => {
                setShipments(res?.data ?? res ?? []);
              })
              .finally(() => setLoading(false));
          }}
        />
      )}
    </>
  );
}

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
