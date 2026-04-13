import { serverFetch } from "@/lib/server-api";
import type { Hub } from "@/types";

async function getHubs(): Promise<Hub[]> {
  try {
    const res = await serverFetch<{ data: Hub[] }>("hubs");
    return res.data ?? [];
  } catch {
    return [];
  }
}

const WarehouseIcon = ({ size = 36 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9.5 12 4l9 5.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const PinIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0, marginTop: "2px" }}
  >
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default async function HubsPage() {
  const hubs = await getHubs();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-4)",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 700,
              color: "var(--color-text)",
            }}
          >
            Hubs
          </h1>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-muted)",
              marginTop: "var(--space-1)",
            }}
          >
            Sorting and distribution centers
          </p>
        </div>
        <button
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-2) var(--space-4)",
            background: "var(--color-primary)",
            color: "var(--color-text-inverse)",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background var(--transition-interactive)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "var(--color-primary-hover)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "var(--color-primary)")
          }
        >
          <WarehouseIcon size={16} />
          Add Hub
        </button>
      </div>

      {/* Empty state */}
      {hubs.length === 0 ? (
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
          <WarehouseIcon size={36} />
          <p
            style={{
              fontWeight: 600,
              color: "var(--color-text)",
              fontSize: "var(--text-sm)",
            }}
          >
            No hubs yet
          </p>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-muted)",
            }}
          >
            Add your first distribution hub to get started.
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
          {hubs.map((hub) => (
            <div
              key={hub.id}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-5)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {/* Hub name + city */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--space-3)",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--color-primary-highlight)",
                    color: "var(--color-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <WarehouseIcon size={18} />
                </div>
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
                    {hub.name}
                  </p>
                  <p
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {hub.city}
                  </p>
                </div>
              </div>

              {/* Address */}
              {hub.address && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "var(--space-2)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {PinIcon}
                  <p style={{ fontSize: "var(--text-sm)" }}>{hub.address}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
