"use client";

import { useState, useEffect } from "react";
import { UserCheck } from "lucide-react";
import { shipmentsApi, agentsApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
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
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState(currentAgentId ?? "");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAgentId) return;
    setLoading(true);
    setError(null);
    try {
      await (shipmentsApi.assignAgent(shipmentId, {
        agentId: selectedAgentId,
      }) as Promise<any>);
      setOpen(false);
      onDone?.();
    } catch (err: any) {
      setError(err?.message ?? "Failed to assign agent");
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
          className="gap-1.5 text-xs border-indigo-200 text-indigo-600 hover:bg-indigo-50"
        >
          <UserCheck size={13} />
          Assign Agent
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 overflow-hidden sm:max-w-[380px] rounded-xl border-slate-200">
        <div
          className="px-6 py-5 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)" }}
        >
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <UserCheck size={18} className="text-indigo-300" />
          </div>
          <div>
            <DialogTitle className="text-white font-bold text-base leading-tight m-0 p-0">
              Assign Delivery Agent
            </DialogTitle>
            <p className="text-indigo-300 text-xs mt-0.5">
              Select an agent for this shipment
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 flex flex-col gap-3">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Delivery Agent <span className="text-red-400">*</span>
            </Label>
            {fetching ? (
              <p className="text-sm text-slate-400">Loading agents…</p>
            ) : agents.length === 0 ? (
              <p className="text-sm text-red-400">
                No agents registered yet. Add agents first.
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
            <div className="mx-6 mb-3 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-200 text-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || fetching || agents.length === 0}
              className="gap-2 font-semibold text-white border-none"
              style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
            >
              <UserCheck size={14} />
              {loading ? "Assigning…" : "Assign"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
