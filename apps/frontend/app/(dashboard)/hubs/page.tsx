import { serverFetch } from "@/lib/server-api";
import type { Hub } from "@/types";
import { Warehouse, MapPin } from "lucide-react";

async function getHubs(): Promise<Hub[]> {
  try {
    const res = await serverFetch<{ data: Hub[] }>("hubs");
    return res.data ?? [];
  } catch {
    return [];
  }
}

export default async function HubsPage() {
  const hubs = await getHubs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            className="font-bold"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-headline-sm)",
              color: "var(--color-on-surface)",
            }}
          >
            Hubs
          </h1>
          <p
            style={{
              fontSize: "var(--text-body-md)",
              color: "var(--color-on-surface-variant)",
              marginTop: "0.25rem",
            }}
          >
            Sorting and distribution centers
          </p>
        </div>
        <button
          className="btn-kinetic flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold"
          style={{ fontSize: "var(--text-body-md)" }}
        >
          <Warehouse size={16} />
          Add Hub
        </button>
      </div>

      {hubs.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{
            backgroundColor: "var(--color-surface-low)",
            border: "1px dashed var(--color-outline-variant)",
          }}
        >
          <Warehouse
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
            No hubs yet
          </p>
          <p
            style={{
              fontSize: "var(--text-body-sm)",
              color: "var(--color-on-surface-variant)",
              marginTop: "0.25rem",
            }}
          >
            Add your first distribution hub to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {hubs.map((hub) => (
            <div
              key={hub.id}
              className="rounded-xl p-5 space-y-3"
              style={{
                backgroundColor: "var(--color-surface-lowest)",
                border: "1px solid var(--color-outline-variant)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "var(--color-primary-container)" }}
                >
                  <Warehouse
                    size={18}
                    style={{ color: "var(--color-secondary-container)" }}
                  />
                </div>
                <div className="min-w-0">
                  <p
                    className="font-semibold truncate"
                    style={{
                      fontSize: "var(--text-title-md)",
                      color: "var(--color-on-surface)",
                    }}
                  >
                    {hub.name}
                  </p>
                  <p
                    style={{
                      fontSize: "var(--text-label-md)",
                      color: "var(--color-on-surface-variant)",
                    }}
                  >
                    {hub.city}
                  </p>
                </div>
              </div>
              <div
                className="flex items-start gap-2"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                <MapPin size={14} className="shrink-0 mt-0.5" />
                <p style={{ fontSize: "var(--text-body-sm)" }}>{hub.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
