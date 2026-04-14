import Link from "next/link";
import { serverFetch } from "@/lib/server-api";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Hub } from "@/types";
import type { Shipment } from "@/types/shipment.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HubDetailResponse {
  data: Hub;
}

interface HubShipmentsResponse {
  data: Shipment[] | { shipments: Shipment[] };
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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HubDetailPage({ params }: PageProps) {
  const { id } = await params;

  let hub: Hub | null = null;
  let shipments: Shipment[] = [];
  let hubError: string | null = null;
  let shipmentsError: string | null = null;

  // Fetch hub details
  try {
    const res = await serverFetch<HubDetailResponse>(`hubs/${id}`);
    hub = res.data;
  } catch (err: any) {
    hubError = err?.message ?? "Failed to load hub";
  }

  // Fetch shipments in this hub
  try {
    const res = await serverFetch<HubShipmentsResponse>(`hubs/${id}/shipments`);
    shipments = Array.isArray(res.data)
      ? res.data
      : ((res.data as { shipments: Shipment[] }).shipments ?? []);
  } catch (err: any) {
    shipmentsError = err?.message ?? "Failed to load shipments";
  }

  if (hubError) {
    return (
      <div className="flex flex-col gap-4">
        <Link
          href="/hubs"
          className="text-sm text-slate-500 hover:text-slate-800 no-underline flex items-center gap-1"
        >
          ← Back to Hubs
        </Link>
        <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive">
          ⚠ {hubError}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full min-w-0">
      {/* Back link */}
      <Link
        href="/hubs"
        className="text-sm text-slate-500 hover:text-slate-800 no-underline flex items-center gap-1.5 w-fit"
      >
        ← Back to Hubs
      </Link>

      {/* Hub header card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-start gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-500">
          <WarehouseIcon size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-slate-900">{hub?.name}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {[hub?.city, hub?.state, hub?.country].filter(Boolean).join(", ")}
          </p>
          {hub?.address && (
            <p className="text-xs text-slate-400 mt-1">{hub.address}</p>
          )}
          {hub?.phone && (
            <p className="text-xs text-slate-400 mt-0.5">📞 {hub.phone}</p>
          )}
        </div>

        {/* Stats */}
        <div className="shrink-0 text-right">
          <p className="text-2xl font-bold text-indigo-600 tabular-nums">
            {shipments.length}
          </p>
          <p className="text-xs text-slate-400">
            shipment{shipments.length !== 1 ? "s" : ""} assigned
          </p>
        </div>
      </div>

      {/* Shipments section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">
            Shipments at this Hub
          </h2>
          {shipments.length > 0 && (
            <span className="text-xs text-slate-400 tabular-nums">
              {shipments.length} total
            </span>
          )}
        </div>

        {/* Shipments error */}
        {shipmentsError && (
          <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive">
            ⚠ {shipmentsError}
          </div>
        )}

        {/* Shipments table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          {shipments.length === 0 && !shipmentsError ? (
            <div className="py-16 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-700">
                No shipments at this hub
              </p>
              <p className="text-xs text-slate-400">
                Assign shipments to this hub from the Hubs page.
              </p>
              <Link
                href="/hubs"
                className="mt-1 text-xs font-semibold text-indigo-600 no-underline hover:underline"
              >
                ← Go to Hubs
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full min-w-[700px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking #</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <span className="font-mono text-sm font-semibold text-slate-800">
                          {s.trackingNumber}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-sm">{s.recipientName}</p>
                        {s.recipientPhone && (
                          <p className="text-xs text-muted-foreground">
                            {s.recipientPhone}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground max-w-[180px] block overflow-hidden text-ellipsis whitespace-nowrap">
                          {s.recipientAddress}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={s.status} />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground tabular-nums">
                          {s.weight ? `${s.weight} kg` : "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground tabular-nums">
                          {new Date(s.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/shipments/${s.id}`}
                          className="text-sm text-[#fd761a] no-underline font-medium hover:underline"
                        >
                          View →
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Status breakdown */}
      {shipments.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(
            [
              {
                label: "In Transit",
                value: "in_transit",
                color: "bg-blue-50 text-blue-700 border-blue-100",
              },
              {
                label: "Out for Delivery",
                value: "out_for_delivery",
                color: "bg-amber-50 text-amber-700 border-amber-100",
              },
              {
                label: "Delivered",
                value: "delivered",
                color: "bg-green-50 text-green-700 border-green-100",
              },
              {
                label: "Failed",
                value: "failed",
                color: "bg-red-50 text-red-700 border-red-100",
              },
            ] as const
          ).map(({ label, value, color }) => {
            const count = shipments.filter((s) => s.status === value).length;
            return (
              <div
                key={value}
                className={`rounded-xl border p-4 flex flex-col gap-1 ${color}`}
              >
                <p className="text-2xl font-bold tabular-nums">{count}</p>
                <p className="text-xs font-semibold">{label}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
