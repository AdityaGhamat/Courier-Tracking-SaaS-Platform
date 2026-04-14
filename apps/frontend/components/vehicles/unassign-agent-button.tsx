"use client";

import { useState } from "react";
import { UserX } from "lucide-react";
import { vehiclesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  vehicleId: string;
  agentName?: string;
  onDone?: () => void;
}

export function UnassignAgentButton({ vehicleId, agentName, onDone }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUnassign() {
    setLoading(true);
    setError(null);
    try {
      await (vehiclesApi.unassignAgent(vehicleId) as Promise<any>);
      setOpen(false);
      onDone?.();
    } catch (err: any) {
      setError(err?.message ?? "Failed to unassign agent");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 text-xs border-red-200 text-red-500 hover:bg-red-50"
        >
          <UserX size={13} />
          Unassign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>Unassign Agent</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <p className="text-sm text-slate-600">
            Are you sure you want to unassign{" "}
            {agentName ? (
              <span className="font-semibold text-slate-800">{agentName}</span>
            ) : (
              "this agent"
            )}{" "}
            from the vehicle?
          </p>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md border border-destructive/20">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUnassign}
              disabled={loading}
              className="gap-2 text-white border-none"
              style={{ backgroundColor: "#ef4444" }}
            >
              <UserX size={14} />
              {loading ? "Removing…" : "Unassign"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
