"use client";

import { useState } from "react";
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

interface Props {
  shipmentId: string;
  currentAgentId?: string | null; // ← ADDED
  onDone?: () => void; // ← ADDED
}

export function AssignAgentDialog({
  shipmentId,
  currentAgentId,
  onDone,
}: Props) {
  const [open, setOpen] = useState(false);
  const [agentId, setAgentId] = useState(currentAgentId ?? ""); // ← pre-fill if already assigned
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setAgentId(currentAgentId ?? "");
      setError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agentId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await shipmentsApi.assignAgent(shipmentId, { agentId: agentId.trim() });
      handleOpenChange(false);
      onDone?.(); // ← calls router.refresh() from ShipmentActions
    } catch (err: any) {
      setError(err?.message ?? "Failed to assign agent");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Assign Agent</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Assign Delivery Agent</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="agentId">Agent ID</Label>
            <Input
              id="agentId"
              placeholder="e.g. 3f4e1a2b-..."
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md border border-destructive/20">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !agentId.trim()}
              style={{
                backgroundColor: "#fd761a",
                color: "white",
                border: "none",
              }}
            >
              {loading ? "Assigning…" : "Assign"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
