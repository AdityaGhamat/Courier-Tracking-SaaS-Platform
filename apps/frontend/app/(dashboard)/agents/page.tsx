"use client";

import { useState, useEffect } from "react";
import { agentsApi } from "@/lib/api";
import { CreateAgentDialog } from "@/components/agents/create-agent-dialog";
import { Loader2, Users } from "lucide-react";
import Link from "next/link";

interface Agent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt?: string;
}

function AgentInitial({ name }: { name: string }) {
  const colors = [
    "from-indigo-500 to-violet-500",
    "from-cyan-500 to-blue-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-pink-500",
    "from-amber-500 to-orange-500",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm bg-gradient-to-br ${colors[idx]}`}
    >
      {name?.[0]?.toUpperCase() ?? "A"}
    </div>
  );
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function loadAgents() {
    setLoading(true);
    setError("");
    agentsApi
      .list()
      .then((res: any) => {
        // Response shape: { success, data: Agent[], message }
        const list: Agent[] = Array.isArray(res?.data)
          ? res.data
          : (res?.data?.agents ?? []);
        setAgents(list);
      })
      .catch((err: any) => setError(err?.message ?? "Failed to load agents"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAgents();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Delivery Agents
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading
              ? "Loading..."
              : `${agents.length} agent${agents.length !== 1 ? "s" : ""} in your workforce`}
          </p>
        </div>
        <CreateAgentDialog onCreated={loadAgents} />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-indigo-400" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="py-6 text-center text-sm text-red-500 bg-red-50 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && agents.length === 0 && (
        <div className="py-16 flex flex-col items-center gap-4 border border-dashed border-slate-200 rounded-2xl text-center bg-slate-50">
          <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center">
            <Users size={26} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              No agents yet
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Register agents so you can assign deliveries to them.
            </p>
          </div>
          <CreateAgentDialog onCreated={loadAgents} />
        </div>
      )}

      {/* Agent Cards */}
      {!loading && !error && agents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
            >
              {/* Top row: avatar + info + badge */}
              <div className="flex items-start gap-4">
                <AgentInitial name={agent.name} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-slate-800 truncate">
                    {agent.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {agent.email}
                  </p>
                  {agent.phone && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {agent.phone}
                    </p>
                  )}
                  {agent.createdAt && (
                    <p className="text-xs text-slate-300 mt-1">
                      Joined{" "}
                      {new Date(agent.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
                <span className="shrink-0 inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-600 uppercase tracking-wide">
                  Active
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 border-t border-slate-100 pt-3">
                <Link
                  href={`/agents/${agent.id}/route`}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#fd761a]/10 px-3 py-2 text-xs font-bold text-[#fd761a] hover:bg-[#fd761a]/20 transition-colors no-underline"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                  Optimize Route
                </Link>
                <Link
                  href={`/shipments?agentId=${agent.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors no-underline"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
                  Shipments
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
