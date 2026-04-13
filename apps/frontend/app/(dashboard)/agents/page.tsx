import { serverFetch } from "@/lib/server-api";
import { Users } from "lucide-react";

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

export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="font-bold"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-headline-sm)",
            color: "var(--color-on-surface)",
          }}
        >
          Delivery Agents
        </h1>
        <p
          style={{
            fontSize: "var(--text-body-md)",
            color: "var(--color-on-surface-variant)",
            marginTop: "0.25rem",
          }}
        >
          Manage your delivery workforce
        </p>
      </div>

      {agents.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{
            backgroundColor: "var(--color-surface-low)",
            border: "1px dashed var(--color-outline-variant)",
          }}
        >
          <Users
            size={36}
            style={{
              color: "var(--color-on-surface-variant)",
              margin: "0 auto 0.75rem",
            }}
          />
          <p
            className="font-semibold"
            style={{
              fontSize: "var(--text-body-md)",
              color: "var(--color-on-surface)",
            }}
          >
            No agents yet
          </p>
          <p
            style={{
              fontSize: "var(--text-body-sm)",
              color: "var(--color-on-surface-variant)",
              marginTop: "0.25rem",
            }}
          >
            Register agents via{" "}
            <span
              className="font-mono"
              style={{ color: "var(--color-secondary-container)" }}
            >
              POST /auth/register-agent
            </span>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="rounded-xl p-5 flex items-center gap-4"
              style={{
                backgroundColor: "var(--color-surface-lowest)",
                border: "1px solid var(--color-outline-variant)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-white"
                style={{
                  backgroundColor: "var(--color-secondary-container)",
                  fontSize: "var(--text-label-lg)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {agent.name?.[0]?.toUpperCase() ?? "A"}
              </div>
              <div className="min-w-0">
                <p
                  className="font-semibold truncate"
                  style={{
                    fontSize: "var(--text-body-md)",
                    color: "var(--color-on-surface)",
                  }}
                >
                  {agent.name}
                </p>
                <p
                  className="truncate"
                  style={{
                    fontSize: "var(--text-label-md)",
                    color: "var(--color-on-surface-variant)",
                  }}
                >
                  {agent.email}
                </p>
                {agent.assignedShipments !== undefined && (
                  <p
                    style={{
                      fontSize: "var(--text-label-md)",
                      color: "var(--color-secondary-container)",
                      marginTop: "0.2rem",
                    }}
                  >
                    {agent.assignedShipments} active deliveries
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
