import { serverFetch } from "@/lib/server-api";
import { getSessionUser } from "@/lib/session";
import Link from "next/link";
import {
  CreditCard,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ReceiptText,
} from "lucide-react";
import { CreatePaymentDialog } from "@/components/payments/create-payment-dialog";
import { UpdateStatusButton } from "@/components/payments/update-status-button";
import type { ListPaymentsResponse, Payment } from "@/types/payment.types";
import { cn } from "@/lib/utils";

// ── Status badge ────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  paid: {
    label: "Paid",
    classes:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  },
  pending: {
    label: "Pending",
    classes:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  },
  failed: {
    label: "Failed",
    classes: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  },
  refunded: {
    label: "Refunded",
    classes:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.refunded;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        cfg.classes,
      )}
    >
      {cfg.label}
    </span>
  );
}

// ── KPI summary cards ────────────────────────────────────────────
function SummaryCards({ payments }: { payments: Payment[] }) {
  const total = payments.length;
  const paid = payments.filter((p) => p.status === "paid").length;
  const pending = payments.filter((p) => p.status === "pending").length;
  const failed = payments.filter((p) => p.status === "failed").length;
  const revenue = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + Number(p.amount), 0);

  const cards = [
    { label: "Total Records", value: total, classes: "bg-slate-600" },
    { label: "Paid", value: paid, classes: "bg-green-500" },
    { label: "Pending", value: pending, classes: "bg-yellow-500" },
    { label: "Failed", value: failed, classes: "bg-red-500" },
    {
      label: "Revenue Collected",
      value: revenue.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      }),
      classes: "bg-indigo-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((c) => (
        <div
          key={c.label}
          className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm"
        >
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg text-white",
              c.classes,
            )}
          >
            <CreditCard size={13} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {c.label}
          </p>
          <p className="text-xl font-extrabold tabular-nums text-foreground">
            {c.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────
export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const { page: pageParam, status = "" } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));
  const limit = 15;

  const user = await getSessionUser();
  const role = user?.role;

  // ── Customer: redirect hint ──────────────────────────────────
  if (role === "customer") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <ReceiptText size={40} className="text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground max-w-xs">
          To view your payment history, open a shipment from{" "}
          <Link
            href="/shipments"
            className="text-primary underline underline-offset-2"
          >
            My Shipments
          </Link>{" "}
          and check the payments tab.
        </p>
      </div>
    );
  }

  // ── Non-admin guard ──────────────────────────────────────────
  if (role !== "admin") {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Payments are not available for your role.
      </div>
    );
  }

  // ── Fetch ────────────────────────────────────────────────────
  let payments: Payment[] = [];
  let fetchError: string | null = null;

  try {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(status ? { status } : {}),
    });
    const res = await serverFetch<{ data: ListPaymentsResponse }>(
      `payments?${query}`,
    );
    payments = res.data?.payments ?? [];
  } catch (e: any) {
    fetchError = e?.message ?? "Failed to load payments";
  }

  const hasNextPage = payments.length === limit;
  const statusFilters = ["", "pending", "paid", "failed", "refunded"];
  const buildHref = (p: number, s: string) =>
    `/payments?${new URLSearchParams({ page: String(p), ...(s ? { status: s } : {}) })}`;

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Payments</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            All payment records for your workspace
          </p>
        </div>
        <CreatePaymentDialog />
      </div>

      {/* Error */}
      {fetchError && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          <AlertCircle size={16} className="shrink-0" />
          {fetchError}
        </div>
      )}

      {/* Summary KPIs */}
      {payments.length > 0 && <SummaryCards payments={payments} />}

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((s) => {
          const active = status === s;
          return (
            <Link
              key={s || "all"}
              href={buildHref(1, s)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                active
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
            </Link>
          );
        })}
      </div>

      {/* Table / Empty state */}
      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <ReceiptText size={36} className="text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">
            No payments found{status ? ` with status "${status}"` : ""}.
          </p>
          {status && (
            <Link
              href="/payments"
              className="text-xs text-primary underline underline-offset-2"
            >
              Clear filter
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {[
                    { label: "Tracking #", align: "left" },
                    { label: "Recipient", align: "left" },
                    { label: "Amount", align: "right" },
                    { label: "Currency", align: "left" },
                    { label: "Status", align: "left" },
                    { label: "Date", align: "left" },
                    { label: "Notes", align: "left" },
                    { label: "Actions", align: "right" },
                  ].map((h) => (
                    <th
                      key={h.label}
                      className={cn(
                        "whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground",
                        h.align === "right" ? "text-right" : "text-left",
                      )}
                    >
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((p) => (
                  <tr
                    key={p.id}
                    className="bg-card transition-colors hover:bg-muted/30"
                  >
                    {/* Tracking # */}
                    <td className="px-4 py-3">
                      <Link
                        href={`/shipments/${p.parcelId}`}
                        className="font-mono text-xs text-primary hover:underline"
                      >
                        {p.parcel?.trackingNumber ?? "—"}
                      </Link>
                    </td>

                    {/* Recipient */}
                    <td className="px-4 py-3 font-medium text-foreground">
                      {p.parcel?.recipientName ?? "—"}
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">
                      {p.amount != null
                        ? Number(p.amount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })
                        : "—"}
                    </td>

                    {/* Currency */}
                    <td className="px-4 py-3 text-xs uppercase text-muted-foreground">
                      {p.currency ?? "INR"}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Notes */}
                    <td className="max-w-[160px] truncate px-4 py-3 text-xs text-muted-foreground">
                      {p.notes ?? "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <UpdateStatusButton
                        paymentId={p.id}
                        currentStatus={p.status}
                      />
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
        <span className="text-xs text-muted-foreground">
          Page <span className="font-semibold text-foreground">{page}</span>
        </span>
        <div className="flex gap-2">
          {page > 1 && (
            <Link
              href={buildHref(page - 1, status)}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <ChevronLeft size={13} /> Previous
            </Link>
          )}
          {hasNextPage && (
            <Link
              href={buildHref(page + 1, status)}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              Next <ChevronRight size={13} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
