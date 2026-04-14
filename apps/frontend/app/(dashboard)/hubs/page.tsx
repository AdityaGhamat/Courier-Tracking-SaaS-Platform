import { serverFetch } from "@/lib/server-api";
import type { Hub } from "@/types";
import { CreateHubDialog } from "@/components/hubs/create-hub-dialog";
import { EditHubDialog } from "@/components/hubs/edit-hub-dialog";

async function getHubs(): Promise<Hub[]> {
  try {
    const res = await serverFetch<{ data: Hub[] }>("hubs");
    return res.data ?? [];
  } catch {
    return [];
  }
}

const WarehouseIcon = ({ size = 18 }: { size?: number }) => (
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

export default async function HubsPage() {
  const hubs = await getHubs();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Hubs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {hubs.length} sorting & distribution center
            {hubs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <CreateHubDialog />
      </div>

      {hubs.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-3 border border-dashed border-slate-200 rounded-2xl text-center bg-slate-50">
          <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400">
            <WarehouseIcon size={26} />
          </div>
          <p className="text-sm font-semibold text-slate-700">No hubs yet</p>
          <p className="text-sm text-slate-400">
            Add your first distribution hub to get started.
          </p>
          <div className="mt-2">
            <CreateHubDialog />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {hubs.map((hub) => (
            <div
              key={hub.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-500">
                  <WarehouseIcon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-slate-800 truncate">
                    {hub.name}
                  </p>
                  <p className="text-xs text-slate-500">{hub.city}</p>
                </div>
              </div>
              {hub.address && (
                <p className="text-xs text-slate-400 leading-relaxed">
                  {hub.address}
                </p>
              )}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">
                  {hub.id}
                </span>
                <EditHubDialog hub={hub} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
