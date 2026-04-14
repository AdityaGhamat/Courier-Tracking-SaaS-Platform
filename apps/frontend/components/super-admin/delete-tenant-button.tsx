"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle } from "lucide-react";
import { superAdminApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteTenantButton({
  tenantId,
  tenantName,
}: {
  tenantId: string;
  tenantName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      await superAdminApi.deleteTenant(tenantId);
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete tenant");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-100">
          <Trash2 size={11} /> Delete
        </button>
      </DialogTrigger>
      <DialogContent className="p-0 overflow-hidden sm:max-w-[400px] gap-0 rounded-xl border-slate-200">
        <div
          className="px-6 py-5 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg,#7f1d1d,#991b1b)" }}
        >
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} className="text-red-300" />
          </div>
          <div>
            <DialogTitle className="text-white font-bold text-base leading-tight m-0 p-0">
              Delete Tenant
            </DialogTitle>
            <p className="text-red-300 text-xs mt-0.5 truncate max-w-[220px]">
              {tenantName}
            </p>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <p className="text-sm text-slate-700">
            This will permanently delete the tenant workspace and all associated
            data. This action{" "}
            <span className="font-bold text-red-600">cannot be undone</span>.
          </p>
          {error && (
            <div className="px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-slate-200 text-slate-600 text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm border-none"
          >
            {loading ? "Deleting…" : "Yes, Delete Tenant"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
