"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentStatus } from "@/types/payment.types";

interface Props {
  paymentId: string;
  currentStatus: PaymentStatus;
}

const ALLOWED_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  pending: ["paid", "failed"],
  paid: ["refunded"],
  failed: ["pending"],
  refunded: [],
};

export function UpdateStatusButton({ paymentId, currentStatus }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    status: (ALLOWED_TRANSITIONS[currentStatus] ?? [])[0] ?? currentStatus,
    gatewayTransactionId: "",
    notes: "",
  });

  const allowed = ALLOWED_TRANSITIONS[currentStatus] ?? [];

  if (allowed.length === 0) {
    return <span className="text-xs text-muted-foreground/40">—</span>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/proxy/payments/${paymentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: form.status,
          ...(form.gatewayTransactionId.trim()
            ? { gatewayTransactionId: form.gatewayTransactionId.trim() }
            : {}),
          ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Failed to update status");
      }

      setOpen(false);
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Pencil size={11} />
        Update
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Update Status
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Current:{" "}
                  <span className="font-semibold capitalize text-foreground">
                    {currentStatus}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* New status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  New Status <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      status: e.target.value as PaymentStatus,
                    }))
                  }
                  className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {allowed.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transaction ID */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Gateway Transaction ID
                </label>
                <input
                  type="text"
                  placeholder="Optional"
                  value={form.gatewayTransactionId}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      gatewayTransactionId: e.target.value,
                    }))
                  }
                  className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional notes..."
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  className="resize-none rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground",
                    loading
                      ? "bg-primary/60 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90",
                  )}
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {loading ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
