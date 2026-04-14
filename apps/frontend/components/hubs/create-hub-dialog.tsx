"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Warehouse, MapPin, Building2, Phone, Globe } from "lucide-react";
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

// Matches backend createHubSchema exactly:
// name (min2,max255), address (min5), city (min2,max100),
// state? , country (min2,max100), phone?
interface CreateHubForm {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
}

const EMPTY: CreateHubForm = {
  name: "",
  address: "",
  city: "",
  state: "",
  country: "",
  phone: "",
};

const inputCls =
  "bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 text-sm";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      {children}
    </div>
  );
}

export function CreateHubDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateHubForm>(EMPTY);

  const set = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setForm(EMPTY);
      setError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await hubsApi.create({
        name: form.name,
        address: form.address,
        city: form.city,
        country: form.country,
        ...(form.state.trim() && { state: form.state }),
        ...(form.phone.trim() && { phone: form.phone }),
      });
      handleOpenChange(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to create hub");
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
          <Warehouse size={15} /> Add Hub
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 overflow-hidden sm:max-w-[500px] gap-0 rounded-xl border-slate-200">
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)" }}
        >
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Warehouse size={18} className="text-indigo-300" />
          </div>
          <div>
            <DialogTitle className="text-white font-bold text-base leading-tight m-0 p-0">
              Add Hub
            </DialogTitle>
            <p className="text-indigo-300 text-xs mt-0.5">
              Create a new sorting / distribution center
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Hub Name" required>
                <Input
                  name="name"
                  placeholder="Mumbai Central Hub"
                  value={form.name}
                  onChange={set}
                  required
                  minLength={2}
                  maxLength={255}
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Full Address" required>
                <Input
                  name="address"
                  placeholder="123 Logistics Park, Andheri East"
                  value={form.address}
                  onChange={set}
                  required
                  minLength={5}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="City" required>
              <Input
                name="city"
                placeholder="Mumbai"
                value={form.city}
                onChange={set}
                required
                minLength={2}
                maxLength={100}
                className={inputCls}
              />
            </Field>

            <Field label="State">
              <Input
                name="state"
                placeholder="Maharashtra"
                value={form.state}
                onChange={set}
                className={inputCls}
              />
            </Field>

            <Field label="Country" required>
              <Input
                name="country"
                placeholder="India"
                value={form.country}
                onChange={set}
                required
                minLength={2}
                maxLength={100}
                className={inputCls}
              />
            </Field>

            <Field label="Phone">
              <Input
                name="phone"
                placeholder="+91 98765 43210"
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
              style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
            >
              <Warehouse size={14} />
              {loading ? "Creating…" : "Create Hub"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
