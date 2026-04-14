import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { serverFetch } from "@/lib/server-api";
import { getSessionUser } from "@/lib/session";
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

const STATUS_OPTIONS = [
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

// Agent assigned endpoint returns flat array: { data: Shipment[] }
interface AgentAssignedResponse {
  data: Shipment[];
}

/** Smart pagination: first, last, current ±1, with ellipsis */
function buildPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  ) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export default async function ShipmentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const status = params.status ?? "";
  const user = await getSessionUser();

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isAgent = user?.role === "delivery_agent";

  // ── Agent branch ─────────────────────────────────────────────────────────────
  if (isAgent) {
    let shipments: Shipment[] = [];
    let fetchError: string | null = null;

    try {
      const res = await serverFetch<AgentAssignedResponse>(
        "shipments/agent/assigned",
      );
      shipments = Array.isArray(res.data) ? res.data : [];
    } catch (err: any) {
      fetchError = err?.message ?? "Failed to load assigned shipments";
    }

    // Client-side status filter (backend returns flat array, no pagination)
    const filtered = status
      ? shipments.filter((s) => s.status === status)
      : shipments;

    return (
      <div className="flex flex-col gap-6 w-full min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <PackageSearch size={18} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              My Assigned Shipments
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {filtered.length} shipment{filtered.length !== 1 ? "s" : ""}{" "}
              assigned to you
            </p>
          </div>
        </div>

        {/* Status filters */}
        <div className="flex gap-2 flex-wrap w-full">
          {STATUS_OPTIONS.map((opt) => {
            const isActive = status === opt.value;
            const href = `/shipments?page=1${
              opt.value ? `&status=${opt.value}` : ""
            }`;
            return (
              <Link
                key={opt.value}
                href={href}
                className={[
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all no-underline",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted text-muted-foreground border-border hover:bg-accent hover:text-foreground",
                ].join(" ")}
              >
                {opt.label}
              </Link>
            );
          })}
        </div>

        {/* Error */}
        {fetchError && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20">
            <span className="text-base">⚠</span>
            <span>{fetchError}</span>
          </div>
        )}

        {/* Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm w-full overflow-hidden">
          {filtered.length === 0 && !fetchError ? (
            <div className="py-20 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                <PackageSearch size={24} className="text-muted-foreground/40" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  No shipments assigned
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {status
                    ? `No assigned shipments with status "${status}".`
                    : "You have no shipments assigned yet."}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table className="w-full min-w-[700px]">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-[11px] uppercase tracking-wider font-bold w-[160px]">
                      Tracking #
                    </TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-bold">
                      Recipient
                    </TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-bold">
                      Address
                    </TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-bold">
                      Status
                    </TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-bold w-[110px]">
                      Created
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow
                      key={s.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell>
                        <Link
                          href={`/shipments/${s.id}`}
                          className="font-mono text-sm font-semibold text-primary hover:underline no-underline"
                        >
                          {s.trackingNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-sm text-foreground">
                          {s.recipientName}
                        </p>
                        {s.recipientPhone && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {s.recipientPhone}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground max-w-[200px] block truncate">
                          {s.recipientAddress}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={s.status} />
                      </TableCell>
                      <TableCell>
                        <span className="text-xs tabular-nums text-muted-foreground whitespace-nowrap">
                          {new Date(s.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Admin / Customer branch ───────────────────────────────────────────────────
  let result: ListResponse["data"] | null = null;
  let fetchError: string | null = null;

  try {
    const endpoint =
      user?.role === "customer"
        ? `shipments/my/shipments?page=${page}&limit=15${
            status ? `&status=${status}` : ""
          }`
        : `shipments?page=${page}&limit=15${status ? `&status=${status}` : ""}`;

    const res = await serverFetch<ListResponse>(endpoint);
    result = res.data;
  } catch (err: any) {
    fetchError = err?.message ?? "Failed to load shipments";
  }

  const shipments = result?.shipments ?? [];
  const totalPages = result?.totalPages ?? 1;
  const pageRange = buildPageRange(page, totalPages);

  return (
    <div className="flex flex-col gap-6 w-full min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <PackageSearch size={18} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Shipments</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {result?.total ?? 0} total · page {page} of {totalPages}
            </p>
          </div>
        </div>
        {isAdmin && <CreateShipmentDialog />}
      </div>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap w-full">
        {STATUS_OPTIONS.map((opt) => {
          const isActive = status === opt.value;
          const href = `/shipments?page=1${
            opt.value ? `&status=${opt.value}` : ""
          }`;
          return (
            <Link
              key={opt.value}
              href={href}
              className={[
                "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all no-underline",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-muted text-muted-foreground border-border hover:bg-accent hover:text-foreground",
              ].join(" ")}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>

      {/* Error */}
      {fetchError && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20">
          <span className="text-base">⚠</span>
          <span>{fetchError}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm w-full overflow-hidden">
        {shipments.length === 0 && !fetchError ? (
          <div className="py-20 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
              <PackageSearch size={24} className="text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold text-foreground">No shipments yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                {status
                  ? `No shipments with status "${status}".`
                  : "Create your first shipment to get started."}
              </p>
            </div>
            {isAdmin && <CreateShipmentDialog />}
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table className="w-full min-w-[860px]">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-[11px] uppercase tracking-wider font-bold w-[160px]">
                    Tracking #
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-bold">
                    Recipient
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-bold">
                    Address
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-bold">
                    Status
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-bold w-[80px]">
                    Weight
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-bold w-[110px]">
                    Created
                  </TableHead>
                  {isAdmin && (
                    <TableHead className="text-[11px] uppercase tracking-wider font-bold w-[150px]">
                      Actions
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((s) => (
                  <TableRow
                    key={s.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <Link
                        href={`/shipments/${s.id}`}
                        className="font-mono text-sm font-semibold text-primary hover:underline no-underline"
                      >
                        {s.trackingNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm text-foreground">
                        {s.recipientName}
                      </p>
                      {s.recipientPhone && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {s.recipientPhone}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground max-w-[200px] block truncate">
                        {s.recipientAddress}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={s.status} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {s.weight ? `${s.weight} kg` : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs tabular-nums text-muted-foreground whitespace-nowrap">
                        {new Date(s.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <ShipmentActions
                          shipmentId={s.id}
                          currentStatus={s.status}
                          currentAgentId={s.driverId ?? null}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 w-full">
          <Link
            href={`/shipments?page=${Math.max(1, page - 1)}${
              status ? `&status=${status}` : ""
            }`}
            aria-disabled={page === 1}
            className={[
              "px-3 py-2 rounded-lg text-sm font-medium border transition-colors no-underline",
              page === 1
                ? "pointer-events-none opacity-30 bg-muted border-border text-muted-foreground"
                : "bg-muted border-border text-foreground hover:bg-accent",
            ].join(" ")}
          >
            ‹ Prev
          </Link>

          {pageRange.map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm"
              >
                …
              </span>
            ) : (
              <Link
                key={p}
                href={`/shipments?page=${p}${
                  status ? `&status=${status}` : ""
                }`}
                className={[
                  "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium border no-underline transition-colors tabular-nums",
                  p === page
                    ? "bg-primary text-primary-foreground border-primary font-bold shadow-sm"
                    : "bg-muted border-border text-foreground hover:bg-accent",
                ].join(" ")}
              >
                {p}
              </Link>
            ),
          )}

          <Link
            href={`/shipments?page=${Math.min(totalPages, page + 1)}${
              status ? `&status=${status}` : ""
            }`}
            aria-disabled={page === totalPages}
            className={[
              "px-3 py-2 rounded-lg text-sm font-medium border transition-colors no-underline",
              page === totalPages
                ? "pointer-events-none opacity-30 bg-muted border-border text-muted-foreground"
                : "bg-muted border-border text-foreground hover:bg-accent",
            ].join(" ")}
          >
            Next ›
          </Link>
        </div>
      )}
    </div>
  );
}
