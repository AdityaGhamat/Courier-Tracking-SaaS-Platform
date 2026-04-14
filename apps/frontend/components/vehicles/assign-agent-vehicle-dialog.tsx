"use client";

import { useState, useEffect } from "react";
import { UserCheck } from "lucide-react";
import { vehiclesApi, agentsApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Agent {
  id: string;
  name: string;
  email: string;
}

interface Props {
  vehicleId: string;
  currentAgentId?: string | null;
  onDone?: () => void;
}

export function AssignAgentVehicleDialog({
  vehicleId,
  currentAgentId,
  onDone,
}: Props) {
  const [open, setOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState(currentAgentId ?? "");
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setFetching(true);
    (agentsApi.list() as Promise<any>)
      .then((res: any) => {
        const list: Agent[] = Array.isArray(res?.data)
          ? res.data
          : (res?.data?.agents ?? []);
        setAgents(list);
      })
      .catch(() => setAgents([]))
      .finally(() => setFetching(false));
  }, [open]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setSelectedAgentId(currentAgentId ?? "");
      setError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAgentId) return;
    setLoading(true);
    setError(null);
    try {
      await (vehiclesApi.assignAgent(vehicleId, {
        agentId: selectedAgentId,
      }) as Promise<any>);
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
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 text-xs border-indigo-200 text-indigo-600 hover:bg-indigo-50"
        >
          <UserCheck size={13} />
          {currentAgentId ? "Reassign Agent" : "Assign Agent"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>Assign Agent to Vehicle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Select Agent <span className="text-red-400">*</span>
            </Label>
            {fetching ? (
              <p className="text-sm text-slate-400">Loading agents…</p>
            ) : agents.length === 0 ? (
              <p className="text-sm text-red-400">
                No agents found. Register agents first.
              </p>
            ) : (
              <select
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                required
              >
                <option value="">— Select agent —</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.email})
                  </option>
                ))}
              </select>
            )}
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
              disabled={loading || fetching || !selectedAgentId}
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
