"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { superAdminApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors border border-destructive/20">
          <Trash2 size={11} /> Delete
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Delete Tenant</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-bold text-foreground">{tenantName}</span>?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <p className="text-sm text-muted-foreground">
            This will permanently delete the tenant workspace and all associated
            data. This action{" "}
            <span className="font-bold text-destructive">cannot be undone</span>
            .
          </p>
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md border border-destructive/20">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting…" : "Yes, Delete Tenant"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
