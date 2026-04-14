"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Warehouse, Trash2 } from "lucide-react";
import { hubsApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Hub } from "@/types";

// Matches backend updateHubSchema = createHubSchema.partial()
// All fields optional: name?, address?, city?, state?, country?, phone?

const inputCls =
  "bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 text-sm";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </Label>
      {children}
    </div>
  );
}

export function EditHubDialog({ hub }: { hub: Hub }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: hub.name ?? "",
    address: (hub as any).address ?? "",
    city: hub.city ?? "",
    state: (hub as any).state ?? "",
    country: (hub as any).country ?? "",
    phone: (hub as any).phone ?? "",
  });

  const set = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Send only non-empty fields (all optional in partial schema)
      const body: Record<string, string> = {};
      if (form.name.trim()) body.name = form.name.trim();
      if (form.address.trim()) body.address = form.address.trim();
      if (form.city.trim()) body.city = form.city.trim();
      if (form.state.trim()) body.state = form.state.trim();
      if (form.country.trim()) body.country = form.country.trim();
      if (form.phone.trim()) body.phone = form.phone.trim();

      await hubsApi.update(hub.id, body);
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to update hub");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete hub "${hub.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await hubsApi.delete(hub.id);
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete hub");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-100">
          <Pencil size={12} /> Manage
        </button>
      </DialogTrigger>

      <DialogContent className="p-0 overflow-hidden sm:max-w-[480px] gap-0 rounded-xl border-slate-200">
        <div
          className="px-6 py-5 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)" }}
        >
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Warehouse size={18} className="text-indigo-300" />
          </div>
          <div>
            <DialogTitle className="text-white font-bold text-base leading-tight m-0 p-0">
              Edit Hub
            </DialogTitle>
            <p className="text-indigo-300 font-mono text-xs mt-0.5">
              {hub.id.slice(0, 20)}…
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Hub Name">
                <Input
                  name="name"
                  value={form.name}
                  onChange={set}
                  minLength={2}
                  maxLength={255}
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Address">
                <Input
                  name="address"
                  value={form.address}
                  onChange={set}
                  minLength={5}
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="City">
              <Input
                name="city"
                value={form.city}
                onChange={set}
                className={inputCls}
              />
            </Field>
            <Field label="State">
              <Input
                name="state"
                value={form.state}
                onChange={set}
                className={inputCls}
              />
            </Field>
            <Field label="Country">
              <Input
                name="country"
                value={form.country}
                onChange={set}
                className={inputCls}
              />
            </Field>
            <Field label="Phone">
              <Input
                name="phone"
                value={form.phone}
                onChange={set}
                className={inputCls}
              />
            </Field>
          </div>

          {error && (
            <div className="mx-6 mb-3 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <Trash2 size={13} />
              {deleting ? "Deleting…" : "Delete Hub"}
            </button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-slate-200 text-slate-600 text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="font-semibold text-sm text-white border-none"
                style={{
                  background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                }}
              >
                {loading ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
