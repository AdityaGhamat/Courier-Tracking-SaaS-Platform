"use client";

import { useState, useEffect } from "react";
import { shipmentsApi, agentsApi } from "@/lib/api"; // ← add agentsApi
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Agent {
  id: string;
  name: string;
  email: string;
}

interface Props {
  shipmentId: string;
  currentAgentId?: string | null;
  onDone?: () => void;
}

export function AssignAgentDialog({
  shipmentId,
  currentAgentId,
  onDone,
}: Props) {
  const [open, setOpen] = useState(false);
  const [agentId, setAgentId] = useState(currentAgentId ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [fetchingAgents, setFetchingAgents] = useState(false);

  useEffect(() => {
    if (open) fetchAgents();
  }, [open]);

  async function fetchAgents() {
    setFetchingAgents(true);
    setError(null);
    try {
      // agentsApi.list() calls GET /api/proxy/auth/agents → /api/v1/auth/agents
      const res = (await agentsApi.list()) as any;
      // Backend returns the array directly as `data` (no nested `users` key)
      const list: Agent[] = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : [];
      setAgents(list);
    } catch (err: any) {
      setError(err?.message ?? "Could not load agents list.");
    } finally {
      setFetchingAgents(false);
    }
  }

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
      onDone?.();
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
            <Label htmlFor="agentId">Select Agent</Label>
            <Select
              value={agentId}
              onValueChange={setAgentId}
              disabled={fetchingAgents}
            >
              <SelectTrigger id="agentId" className="w-full">
                <SelectValue
                  placeholder={
                    fetchingAgents
                      ? "Loading agents..."
                      : "Select a delivery agent"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {!fetchingAgents && agents.length === 0 ? (
                  <SelectItem value="__empty__" disabled>
                    No agents found
                  </SelectItem>
                ) : (
                  agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {agent.email}
                      </span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
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
              disabled={loading || !agentId.trim() || fetchingAgents}
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
