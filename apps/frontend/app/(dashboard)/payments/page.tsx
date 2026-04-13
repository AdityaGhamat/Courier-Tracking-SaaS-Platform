import { serverFetch } from "@/lib/server-api";
import { getSessionUser } from "@/lib/session";
import Link from "next/link";

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  paid: { bg: "var(--color-success-highlight)", color: "var(--color-success)" },
  pending: { bg: "var(--color-gold-highlight)", color: "var(--color-gold)" },
  failed: { bg: "var(--color-error-highlight)", color: "var(--color-error)" },
  refunded: {
    bg: "var(--color-surface-offset)",
    color: "var(--color-text-muted)",
  },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.refunded;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "var(--space-1) var(--space-3)",
        borderRadius: "var(--radius-full)",
        background: s.bg,
        color: s.color,
        fontSize: "var(--text-xs)",
        fontWeight: 600,
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
  );
}

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const { page: pageParam, status = "" } = await searchParams;
  const page = Number(pageParam ?? 1);
  const limit = 15;

  const user = await getSessionUser();
  const role = user?.role;

  if (role === "customer") {
    return (
      <div
        style={{
          padding: "var(--space-8)",
          textAlign: "center",
          fontSize: "var(--text-sm)",
          color: "var(--color-text-muted)",
        }}
      >
        To view your payment history, go to{" "}
        <Link
          href="/shipments"
          style={{ color: "var(--color-primary)", textDecoration: "underline" }}
        >
          My Shipments
        </Link>{" "}
        and select a shipment.
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div
        style={{
          padding: "var(--space-8)",
          fontSize: "var(--text-sm)",
          color: "var(--color-text-muted)",
        }}
      >
        Payments are not available for your role.
      </div>
    );
  }

  let payments: any[] = [];
  try {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(status ? { status } : {}),
    });
    const res = await serverFetch<{ data: { payments: any[] } }>(
      `payments?${query}`,
    );
    payments = res.data?.payments ?? [];
  } catch {
    payments = [];
  }

  const hasNextPage = payments.length === limit;
  const statusFilters = ["", "pending", "paid", "failed", "refunded"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
        maxWidth: "var(--content-wide)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-1)",
        }}
      >
        <h1
          style={{
            fontSize: "var(--text-xl)",
            fontWeight: 700,
            color: "var(--color-text)",
          }}
        >
          Payments
        </h1>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
          }}
        >
          All payment records for your workspace
        </p>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
        {statusFilters.map((s) => {
          const isActive = status === s;
          const params = new URLSearchParams({
            page: "1",
            ...(s ? { status: s } : {}),
          });
          return (
            <Link
              key={s || "all"}
              href={`/payments?${params}`}
              style={{
                padding: "var(--space-1) var(--space-3)",
                borderRadius: "var(--radius-full)",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                textDecoration: "none",
                background: isActive
                  ? "var(--color-primary)"
                  : "var(--color-surface-offset)",
                color: isActive
                  ? "var(--color-text-inverse)"
                  : "var(--color-text-muted)",
                transition:
                  "background var(--transition-interactive), color var(--transition-interactive)",
              }}
            >
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      {payments.length === 0 ? (
        <div
          style={{
            border: "1px dashed var(--color-border)",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-surface)",
            padding: "var(--space-12)",
            textAlign: "center",
            color: "var(--color-text-muted)",
            fontSize: "var(--text-sm)",
          }}
        >
          No payments found{status ? ` with status "${status}"` : ""}.
        </div>
      ) : (
        <div
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "var(--text-sm)",
              }}
            >
              <thead style={{ background: "var(--color-surface-offset)" }}>
                <tr>
                  {[
                    "Tracking #",
                    "Recipient",
                    "Amount",
                    "Currency",
                    "Status",
                    "Date",
                    "Notes",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: h === "Amount" ? "right" : "left",
                        padding: "var(--space-3) var(--space-4)",
                        fontSize: "var(--text-xs)",
                        fontWeight: 600,
                        color: "var(--color-text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p: any) => (
                  <tr
                    key={p.id}
                    style={{
                      borderTop: "1px solid var(--color-divider)",
                      background: "var(--color-surface)",
                    }}
                  >
                    <td
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        fontFamily: "monospace",
                        fontSize: "var(--text-xs)",
                        color: "var(--color-primary)",
                      }}
                    >
                      {p.parcel?.trackingNumber ?? "—"}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        color: "var(--color-text)",
                      }}
                    >
                      {p.parcel?.recipientName ?? "—"}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                        fontWeight: 600,
                        color: "var(--color-text)",
                      }}
                    >
                      {p.amount != null
                        ? Number(p.amount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })
                        : "—"}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        color: "var(--color-text-muted)",
                        textTransform: "uppercase",
                        fontSize: "var(--text-xs)",
                      }}
                    >
                      {p.currency ?? "INR"}
                    </td>
                    <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                      <StatusBadge status={p.status} />
                    </td>
                    <td
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        color: "var(--color-text-muted)",
                        fontSize: "var(--text-xs)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        color: "var(--color-text-muted)",
                        fontSize: "var(--text-xs)",
                        maxWidth: "150px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.notes ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "var(--text-sm)",
        }}
      >
        <span style={{ color: "var(--color-text-muted)" }}>Page {page}</span>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          {page > 1 && (
            <Link
              href={`/payments?${new URLSearchParams({ page: String(page - 1), ...(status ? { status } : {}) })}`}
              style={{
                padding: "var(--space-1) var(--space-3)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
                textDecoration: "none",
                fontSize: "var(--text-xs)",
              }}
            >
              ← Previous
            </Link>
          )}
          {hasNextPage && (
            <Link
              href={`/payments?${new URLSearchParams({ page: String(page + 1), ...(status ? { status } : {}) })}`}
              style={{
                padding: "var(--space-1) var(--space-3)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
                textDecoration: "none",
                fontSize: "var(--text-xs)",
              }}
            >
              Next →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
