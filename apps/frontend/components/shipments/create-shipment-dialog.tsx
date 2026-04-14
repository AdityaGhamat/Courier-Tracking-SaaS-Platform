"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  User,
  MapPin,
  Mail,
  Phone,
  Weight,
  CalendarDays,
  Warehouse,
} from "lucide-react";
import { shipmentsApi } from "@/lib/api";
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

const EMPTY_FORM: any = {
  recipientName: "",
  recipientAddress: "",
  recipientPhone: "",
  recipientEmail: "",
  weight: "",
  estimatedDelivery: "",
  hubId: "",
};

function FieldGroup({
  icon: Icon,
  label,
  children,
  required,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
        <Icon size={12} className="text-indigo-400" />
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

export function CreateShipmentDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<any>(EMPTY_FORM);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setForm(EMPTY_FORM);
      setError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: any = {
      recipientName: form.recipientName,
      recipientAddress: form.recipientAddress,
      ...(form.recipientPhone && { recipientPhone: form.recipientPhone }),
      ...(form.recipientEmail && { recipientEmail: form.recipientEmail }),
      ...(form.weight && { weight: form.weight }),
      ...(form.estimatedDelivery && {
        estimatedDelivery: new Date(form.estimatedDelivery).toISOString(),
      }),
      ...(form.hubId && { hubId: form.hubId }),
    };

    try {
      await shipmentsApi.create(payload);
      handleOpenChange(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to create shipment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="gap-2 font-semibold"
          style={{
            background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
            color: "white",
            border: "none",
          }}
        >
          <Package size={15} />
          New Shipment
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 overflow-hidden sm:max-w-[540px] gap-0 rounded-xl border-slate-200">
        {/* Dialog header — gradient strip */}
        <div
          className="px-6 py-5 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)" }}
        >
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Package size={18} className="text-indigo-300" />
          </div>
          <div>
            <DialogTitle className="text-white font-bold text-base m-0 p-0 leading-tight">
              Create Shipment
            </DialogTitle>
            <p className="text-indigo-300 text-xs mt-0.5">
              Fill in recipient & package details
            </p>
          </div>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-0">
          <div className="px-6 py-5 flex flex-col gap-4 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Recipient
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldGroup icon={User} label="Full Name" required>
                <Input
                  name="recipientName"
                  placeholder="John Doe"
                  value={form.recipientName}
                  onChange={handleChange}
                  required
                  className="bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20"
                />
              </FieldGroup>
              <FieldGroup icon={Phone} label="Phone">
                <Input
                  name="recipientPhone"
                  placeholder="+91 98765 43210"
                  value={form.recipientPhone}
                  onChange={handleChange}
                  className="bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20"
                />
              </FieldGroup>
            </div>

            <FieldGroup icon={MapPin} label="Delivery Address" required>
              <Input
                name="recipientAddress"
                placeholder="123 Main St, Mumbai, Maharashtra"
                value={form.recipientAddress}
                onChange={handleChange}
                required
                className="bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20"
              />
            </FieldGroup>

            <FieldGroup icon={Mail} label="Email">
              <Input
                name="recipientEmail"
                type="email"
                placeholder="john@example.com"
                value={form.recipientEmail}
                onChange={handleChange}
                className="bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20"
              />
            </FieldGroup>
          </div>

          <div className="px-6 py-5 flex flex-col gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Package Details
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldGroup icon={Weight} label="Weight (kg)">
                <Input
                  name="weight"
                  placeholder="2.5"
                  value={form.weight}
                  onChange={handleChange}
                  className="bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20"
                />
              </FieldGroup>
              <FieldGroup icon={CalendarDays} label="Est. Delivery">
                <Input
                  name="estimatedDelivery"
                  type="datetime-local"
                  value={form.estimatedDelivery}
                  onChange={handleChange}
                  className="bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20"
                />
              </FieldGroup>
            </div>

            <FieldGroup icon={Warehouse} label="Hub ID (optional)">
              <Input
                name="hubId"
                placeholder="UUID of the hub"
                value={form.hubId}
                onChange={handleChange}
                className="bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 font-mono text-sm"
              />
            </FieldGroup>
          </div>

          {error && (
            <div className="mx-6 mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Footer actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="font-semibold gap-2"
              style={{
                background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                color: "white",
                border: "none",
              }}
            >
              <Package size={14} />
              {loading ? "Creating…" : "Create Shipment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
