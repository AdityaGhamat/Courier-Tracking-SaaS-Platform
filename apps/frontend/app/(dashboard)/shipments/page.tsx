import Link from "next/link";
import { serverFetch } from "@/lib/server-api";
import { CreateShipmentDialog } from "@/components/shipments/create-shipment-dialog";
import { ShipmentActions } from "@/components/shipments/shipment-actions";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Shipment } from "@/types/shipment.types";

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Label Created", value: "label_created" },
  { label: "Picked Up", value: "picked_up" },
  { label: "At Sorting Facility", value: "at_sorting_facility" },
  { label: "In Transit", value: "in_transit" },
  { label: "Out for Delivery", value: "out_for_delivery" },
  { label: "Delivered", value: "delivered" },
  { label: "Failed", value: "failed" },
  { label: "Returned", value: "returned" },
];

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

interface ListResponse {
  data: {
    shipments: Shipment[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export default async function ShipmentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const status = params.status ?? "";

  let result: ListResponse["data"] | null = null;
  let fetchError: string | null = null;

  try {
    const res = await serverFetch<ListResponse>(
      `shipments?page=${page}&limit=15${status ? `&status=${status}` : ""}`,
    );
    result = res.data;
  } catch (err: any) {
    fetchError = err?.message ?? "Failed to load shipments";
  }

  const shipments = result?.shipments ?? [];
  const totalPages = result?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-6 w-full min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 w-full">
        <div>
          <h1 className="text-xl font-bold text-foreground">Shipments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {result?.total ?? 0} total shipments
          </p>
        </div>
        <CreateShipmentDialog />
      </div>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap w-full">
        {STATUS_OPTIONS.map((opt) => {
          const isActive = status === opt.value;
          const href = `/shipments?page=1${opt.value ? `&status=${opt.value}` : ""}`;
          return (
            <Link
              key={opt.value}
              href={href}
              className={[
                "px-3 py-1 rounded-full text-sm border transition-all duration-150 no-underline",
                isActive
                  ? "font-semibold bg-[#fd761a] text-white border-[#fd761a]"
                  : "font-normal bg-muted text-muted-foreground border-border hover:bg-accent",
              ].join(" ")}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>

      {/* Error banner */}
      {fetchError && (
        <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive w-full">
          ⚠ {fetchError}
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-lg border border-border w-full overflow-hidden flex flex-col">
        {shipments.length === 0 && !fetchError ? (
          <div className="p-16 text-center text-muted-foreground w-full">
            <div className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="12" />
              </svg>
            </div>
            <p className="font-semibold text-foreground">No shipments yet</p>
            <p className="text-sm mt-2">
              Create your first shipment to get started.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table className="w-full min-w-[900px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking #</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>View</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <span className="font-mono text-sm font-semibold">
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
                        {new Date(s.createdAt).toLocaleDateString()}
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
                    <TableCell>
                      {/* ← NEW: assign agent + update status buttons */}
                      <ShipmentActions
                        shipmentId={s.id}
                        currentStatus={s.status}
                        currentAgentId={(s as any).agentId ?? null}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 w-full">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/shipments?page=${p}${status ? `&status=${status}` : ""}`}
              className={[
                "w-9 h-9 flex items-center justify-center rounded-md text-sm border border-border tabular-nums no-underline transition-colors",
                p === page
                  ? "font-bold bg-[#fd761a] text-white border-[#fd761a]"
                  : "font-normal bg-muted text-foreground hover:bg-accent",
              ].join(" ")}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
