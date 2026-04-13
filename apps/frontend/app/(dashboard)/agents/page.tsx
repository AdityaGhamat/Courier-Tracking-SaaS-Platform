import { serverFetch } from "@/lib/server-api";

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

function AgentAvatar({ name }: { name: string }) {
  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "var(--radius-full)",
        background: "var(--color-primary-highlight)",
        color: "var(--color-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: "var(--text-sm)",
        flexShrink: 0,
      }}
    >
      {name?.[0]?.toUpperCase() ?? "A"}
    </div>
  );
}

const UsersIcon = (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* Header */}
      <div>
        <h1
          style={{
            fontSize: "var(--text-xl)",
            fontWeight: 700,
            color: "var(--color-text)",
          }}
        >
          Delivery Agents
        </h1>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            marginTop: "var(--space-1)",
          }}
        >
          Manage your delivery workforce
        </p>
      </div>

      {/* Empty state */}
      {agents.length === 0 ? (
        <div
          style={{
            padding: "var(--space-16)",
            textAlign: "center",
            border: "1px dashed var(--color-border)",
            borderRadius: "var(--radius-lg)",
            color: "var(--color-text-faint)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          {UsersIcon}
          <p
            style={{
              fontWeight: 600,
              color: "var(--color-text)",
              fontSize: "var(--text-sm)",
            }}
          >
            No agents yet
          </p>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-muted)",
            }}
          >
            Register agents via{" "}
            <code
              style={{
                fontFamily: "monospace",
                fontSize: "var(--text-xs)",
                background: "var(--color-surface-offset)",
                padding: "2px 6px",
                borderRadius: "var(--radius-sm)",
                color: "var(--color-primary)",
              }}
            >
              POST /auth/register-agent
            </code>
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          {agents.map((agent) => (
            <div
              key={agent.id}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-5)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <AgentAvatar name={agent.name} />
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {agent.name}
                </p>
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {agent.email}
                </p>
                {agent.phone && (
                  <p
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-faint)",
                      marginTop: "var(--space-1)",
                    }}
                  >
                    {agent.phone}
                  </p>
                )}
                {agent.assignedShipments !== undefined && (
                  <p
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-primary)",
                      fontWeight: 600,
                      marginTop: "var(--space-1)",
                      fontVariantNumeric: "tabular-nums",
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
