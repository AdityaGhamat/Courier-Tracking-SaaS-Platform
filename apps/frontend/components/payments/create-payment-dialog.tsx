"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, CreditCard, Shield } from "lucide-react";
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

const inputCls =
  "bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 text-sm text-slate-900 placeholder:text-slate-400";

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

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setForm({ parcelId: "", amount: "", currency: "INR", notes: "" });
      setError(null);
    }
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

      handleOpenChange(false);
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="gap-2 font-semibold text-white border-none"
          style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
        >
          <PlusCircle size={15} /> New Payment
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 overflow-hidden sm:max-w-[420px] gap-0 rounded-xl border-slate-200 bg-white">
        {/* Header with Indigo Gradient */}
        <div
          className="px-6 py-5 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)" }}
        >
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <CreditCard size={18} className="text-indigo-300" />
          </div>
          <div>
            <DialogTitle className="text-white font-bold text-base leading-tight m-0 p-0">
              Create Payment Record
            </DialogTitle>
            <p className="text-indigo-300 text-xs mt-0.5">
              Attach a manual payment to a shipment parcel
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 flex flex-col gap-4">
            {/* Info banner */}
            <div className="flex items-start gap-2.5 px-3.5 py-2.5 bg-indigo-50 border border-indigo-200 rounded-lg">
              <Shield size={14} className="text-indigo-500 mt-0.5 shrink-0" />
              <p className="text-xs text-indigo-700">
                Payments recorded here are explicitly linked to the specified
                parcel ID.
              </p>
            </div>

            {/* Parcel ID */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Parcel ID <span className="text-red-400">*</span>
              </Label>
              <Input
                placeholder="UUID of the parcel"
                value={form.parcelId}
                onChange={(e) => updateField("parcelId", e.target.value)}
                required
                className={inputCls}
              />
            </div>

            {/* Amount & Currency side-by-side */}
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Amount <span className="text-red-400">*</span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => updateField("amount", e.target.value)}
                  required
                  className={inputCls}
                />
              </div>
              <div className="flex w-24 flex-col gap-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Currency
                </Label>
                <select
                  value={form.currency}
                  onChange={(e) => updateField("currency", e.target.value)}
                  className={`flex h-10 w-full rounded-md border px-3 py-2 focus:outline-none ${inputCls}`}
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
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Notes
              </Label>
              <textarea
                rows={2}
                placeholder="Optional notes..."
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                className={`flex w-full rounded-md border px-3 py-2 resize-none focus:outline-none ${inputCls}`}
              />
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mx-6 mb-3 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="border-slate-200 text-slate-600 bg-white hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !form.parcelId.trim() || !form.amount.trim()}
              className="gap-2 font-semibold text-white border-none disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
            >
              <CreditCard size={14} />
              {loading ? "Creating…" : "Create Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
