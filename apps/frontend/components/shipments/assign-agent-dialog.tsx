"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export function AssignAgentDialog({ shipmentId }: { shipmentId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [agentId, setAgentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agentId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await shipmentsApi.assignAgent(shipmentId, { agentId: agentId.trim() });
      setOpen(false);
      setAgentId("");
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to assign agent");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
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
              }} // FORCED ORANGE
            >
              {loading ? "Assigning…" : "Assign"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
