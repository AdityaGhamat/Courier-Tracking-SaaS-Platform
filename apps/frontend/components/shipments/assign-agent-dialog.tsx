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

interface Props {
  shipmentId: string;
}

export function AssignAgentDialog({ shipmentId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [agentId, setAgentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await shipmentsApi.assignAgent(shipmentId, { agentId });
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
      <DialogContent style={{ maxWidth: "400px" }}>
        <DialogHeader>
          <DialogTitle>Assign Delivery Agent</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
            }}
          >
            <Label htmlFor="agentId">Agent ID</Label>
            <Input
              id="agentId"
              placeholder="Agent UUID"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              required
            />
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
              }}
            >
              Paste the agent's UUID from the Agents page.
            </p>
          </div>

          {error && (
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-error)",
              }}
            >
              {error}
            </p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "var(--space-3)",
            }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Assigning…" : "Assign"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
