import Link from "next/link";
import { serverFetch } from "@/lib/server-api";
import { CreateShipmentDialog } from "@/components/shipments/create-shipment-dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Shipment, ShipmentStatus } from "@/types/shipment.types";

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
  searchParams: { page?: string; status?: string };
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
  const page = Number(searchParams.page) || 1;
  const status = searchParams.status ?? "";

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
          alignItems: "center",
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
            Shipments
          </h1>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-muted)",
              marginTop: "var(--space-1)",
            }}
          >
            {result?.total ?? 0} total shipments
          </p>
        </div>
        <CreateShipmentDialog />
      </div>

      {/* Status filter */}
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
        {STATUS_OPTIONS.map((opt) => {
          const isActive = status === opt.value;
          const href = `/shipments?page=1${opt.value ? `&status=${opt.value}` : ""}`;
          return (
            <Link
              key={opt.value}
              href={href}
              style={{
                padding: "var(--space-1) var(--space-3)",
                borderRadius: "var(--radius-full)",
                fontSize: "var(--text-sm)",
                fontWeight: isActive ? 600 : 400,
                background: isActive
                  ? "var(--color-primary)"
                  : "var(--color-surface-offset)",
                color: isActive
                  ? "var(--color-text-inverse)"
                  : "var(--color-text-muted)",
                textDecoration: "none",
                border: `1px solid ${isActive ? "var(--color-primary)" : "var(--color-border)"}`,
                transition: "all 150ms ease",
              }}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>

      {/* Error */}
      {fetchError && (
        <div
          style={{
            padding: "var(--space-4)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-error-highlight)",
            color: "var(--color-error)",
            fontSize: "var(--text-sm)",
          }}
        >
          {fetchError}
        </div>
      )}

      {/* Table */}
      <div
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
          overflow: "hidden",
        }}
      >
        {shipments.length === 0 && !fetchError ? (
          <div
            style={{
              padding: "var(--space-16)",
              textAlign: "center",
              color: "var(--color-text-muted)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "var(--space-4)" }}>
              📦
            </div>
            <p style={{ fontWeight: 600, color: "var(--color-text)" }}>
              No shipments yet
            </p>
            <p
              style={{
                fontSize: "var(--text-sm)",
                marginTop: "var(--space-2)",
              }}
            >
              Create your first shipment to get started.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking #</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Created</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "var(--text-sm)",
                        fontWeight: 600,
                      }}
                    >
                      {s.trackingNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p
                        style={{ fontWeight: 500, fontSize: "var(--text-sm)" }}
                      >
                        {s.recipientName}
                      </p>
                      {s.recipientPhone && (
                        <p
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--color-text-muted)",
                          }}
                        >
                          {s.recipientPhone}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-text-muted)",
                        maxWidth: "200px",
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.recipientAddress}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={s.status} />
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {s.weight ? `${s.weight} kg` : "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/shipments/${s.id}`}
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-primary)",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      View →
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "var(--space-2)",
          }}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/shipments?page=${p}${status ? `&status=${status}` : ""}`}
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-sm)",
                fontWeight: p === page ? 700 : 400,
                background:
                  p === page
                    ? "var(--color-primary)"
                    : "var(--color-surface-offset)",
                color:
                  p === page
                    ? "var(--color-text-inverse)"
                    : "var(--color-text)",
                textDecoration: "none",
                border: "1px solid var(--color-border)",
              }}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
