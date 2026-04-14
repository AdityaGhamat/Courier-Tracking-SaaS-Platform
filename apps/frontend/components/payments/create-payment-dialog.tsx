"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function CreatePaymentDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    parcelId: "",
    amount: "",
    currency: "INR",
    notes: "",
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.parcelId.trim() || !form.amount.trim()) {
      setError("Parcel ID and Amount are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/proxy/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelId: form.parcelId.trim(),
          amount: form.amount.trim(),
          currency: form.currency || "INR",
          ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Failed to create payment");
      }

      setOpen(false);
      setForm({ parcelId: "", amount: "", currency: "INR", notes: "" });
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
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
      >
        <PlusCircle size={15} />
        New Payment
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
            {/* Header */}
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Create Payment Record
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Attach a payment to a shipment parcel
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
              {/* Parcel ID */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Parcel ID <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  placeholder="UUID of the parcel"
                  value={form.parcelId}
                  onChange={(e) => updateField("parcelId", e.target.value)}
                  className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Amount + Currency */}
              <div className="flex gap-3">
                <div className="flex flex-1 flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Amount <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => updateField("amount", e.target.value)}
                    className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex w-24 flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Currency
                  </label>
                  <select
                    value={form.currency}
                    onChange={(e) => updateField("currency", e.target.value)}
                    className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
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
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="resize-none rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                  {error}
                </p>
              )}

              {/* Actions */}
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
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors",
                    loading
                      ? "bg-primary/60 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90",
                  )}
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {loading ? "Creating…" : "Create Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
