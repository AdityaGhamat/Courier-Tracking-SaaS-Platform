import { serverFetch } from "@/lib/server-api";
import { CreateAgentDialog } from "@/components/agents/create-agent-dialog";

interface Agent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  assignedShipments?: number;
}

async function getAgents(): Promise<Agent[]> {
  try {
    const res = await serverFetch<{ data: Agent[] }>("agents");
    return res.data ?? [];
  } catch {
    return [];
  }
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

export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Delivery Agents
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {agents.length} agent{agents.length !== 1 ? "s" : ""} in your
            workforce
          </p>
        </div>
        <CreateAgentDialog />
      </div>

      {agents.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-4 border border-dashed border-slate-200 rounded-2xl text-center bg-slate-50">
          <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              No agents yet
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Register agents so you can assign deliveries to them.
            </p>
          </div>
          <CreateAgentDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
            >
              <AgentInitial name={agent.name} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-slate-800 truncate">
                  {agent.name}
                </p>
                <p className="text-xs text-slate-500 truncate">{agent.email}</p>
                {agent.phone && (
                  <p className="text-xs text-slate-400 mt-0.5">{agent.phone}</p>
                )}
                {agent.assignedShipments !== undefined && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    {agent.assignedShipments} active deliveries
                  </div>
                )}
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-600 uppercase tracking-wide">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
