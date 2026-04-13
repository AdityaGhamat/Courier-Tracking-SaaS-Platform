import { cookies } from "next/headers";
import Link from "next/link";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:3005";

async function serverFetch(path: string, cookieHeader: string) {
  const res = await fetch(`${BACKEND}/api/v1/${path}`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-[var(--color-success-highlight)] text-[var(--color-success)]",
  pending: "bg-[var(--color-gold-highlight)] text-[var(--color-gold)]",
  failed: "bg-[var(--color-error-highlight)] text-[var(--color-error)]",
  refunded: "bg-[var(--color-surface-offset)] text-[var(--color-text-muted)]",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
        STATUS_STYLES[status] ??
        "bg-[var(--color-surface-offset)] text-[var(--color-text-muted)]"
      }`}
    >
      {status}
    </span>
  );
}

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string };
}) {
  const cookieStore = await cookies();
  const sessionKey = cookieStore.get("session_key")?.value;
  const refreshKey = cookieStore.get("refresh_key")?.value;
  const cookieHeader = [
    sessionKey ? `session_key=${sessionKey}` : "",
    refreshKey ? `refresh_key=${refreshKey}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  const meData = await serverFetch("auth/me", cookieHeader);
  const role = meData?.user?.role;

  const page = Number(searchParams.page ?? 1);
  const status = searchParams.status ?? "";
  const limit = 15;

  let data: any = null;

  if (role === "admin") {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(status ? { status } : {}),
    });
    data = await serverFetch(`payments?${query}`, cookieHeader);
  } else if (role === "customer") {
    // Customer flow: they need a parcelId — show a message directing them
    // to go through their shipments page instead
    return (
      <div className="p-8 text-center text-[var(--color-text-muted)] text-sm">
        To view your payment history, go to{" "}
        <Link
          href="/shipments"
          className="text-[var(--color-primary)] underline underline-offset-2"
        >
          My Shipments
        </Link>{" "}
        and select a shipment.
      </div>
    );
  } else {
    return (
      <div className="p-8 text-[var(--color-text-muted)] text-sm">
        Payments are not available for your role.
      </div>
    );
  }

  const payments: any[] = data?.payments ?? [];
  const hasNextPage = payments.length === limit;

  const statusFilters = ["", "pending", "paid", "failed", "refunded"];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[var(--content-wide)] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text)]">
            Payments
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            All payment records for your workspace
          </p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
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
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isActive
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-surface-offset)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-dynamic)]"
              }`}
            >
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      {payments.length === 0 ? (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
          <p className="text-[var(--color-text-muted)] text-sm">
            No payments found
            {status ? ` with status "${status}"` : ""}.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-surface-offset)]">
                <tr className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium">
                    Tracking #
                  </th>
                  <th className="text-left px-4 py-3 font-medium">Recipient</th>
                  <th className="text-right px-4 py-3 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 font-medium">Currency</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-divider)]">
                {payments.map((p: any) => (
                  <tr
                    key={p.id}
                    className="bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[var(--color-primary)]">
                      {p.parcel?.trackingNumber ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text)]">
                      {p.parcel?.recipientName ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">
                      {p.amount != null
                        ? Number(p.amount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)] uppercase text-xs">
                      {p.currency ?? "INR"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)] text-xs whitespace-nowrap">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)] text-xs max-w-[150px] truncate">
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
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-text-muted)]">Page {page}</span>
        <div className="flex gap-2">
          {page > 1 && (
            <Link
              href={`/payments?${new URLSearchParams({
                page: String(page - 1),
                ...(status ? { status } : {}),
              })}`}
              className="px-3 py-1.5 rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-offset)] transition-colors text-xs"
            >
              ← Previous
            </Link>
          )}
          {hasNextPage && (
            <Link
              href={`/payments?${new URLSearchParams({
                page: String(page + 1),
                ...(status ? { status } : {}),
              })}`}
              className="px-3 py-1.5 rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-offset)] transition-colors text-xs"
            >
              Next →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
