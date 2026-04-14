"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { superAdminApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SubscriptionPlan, Tenant } from "@/types/super-admin.types";

const inputCls =
  "bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 text-sm";

export function AssignPlanDialog({
  tenants,
  plans,
  defaultTenantId,
}: {
  tenants: Tenant[];
  plans: SubscriptionPlan[];
  defaultTenantId?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState(defaultTenantId ?? "");
  const [planId, setPlanId] = useState("");
  const [endDate, setEndDate] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!workspaceId || !planId) {
      setError("Select both a tenant and a plan.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await superAdminApi.assignPlan({
        workspaceId,
        planId,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
      });
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to assign plan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="gap-2 text-sm font-semibold text-white border-none"
          style={{ background: "linear-gradient(135deg,#059669,#047857)" }}
        >
          <Zap size={14} /> Assign Plan
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 overflow-hidden sm:max-w-[440px] gap-0 rounded-xl border-slate-200">
        <div
          className="px-6 py-5 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg,#064e3b,#065f46)" }}
        >
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Zap size={18} className="text-emerald-300" />
          </div>
          <div>
            <DialogTitle className="text-white font-bold text-base leading-tight m-0 p-0">
              Assign Plan to Tenant
            </DialogTitle>
            <p className="text-emerald-300 text-xs mt-0.5">
              Activates or replaces the tenant's subscription
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Tenant <span className="text-red-400">*</span>
              </Label>
              <Select value={workspaceId} onValueChange={setWorkspaceId}>
                <SelectTrigger className={inputCls}>
                  <SelectValue placeholder="Select a tenant workspace" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                      {t.owner?.email ? ` — ${t.owner.email}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Subscription Plan <span className="text-red-400">*</span>
              </Label>
              <Select value={planId} onValueChange={setPlanId}>
                <SelectTrigger className={inputCls}>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans
                    .filter((p) => p.isActive)
                    .map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} — ₹{p.price}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                End Date{" "}
                <span className="text-slate-400 normal-case font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputCls}
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
              onClick={() => setOpen(false)}
              className="border-slate-200 text-slate-600 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="font-semibold text-sm text-white border-none"
              style={{ background: "linear-gradient(135deg,#059669,#047857)" }}
            >
              {loading ? "Assigning…" : "Assign Plan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
