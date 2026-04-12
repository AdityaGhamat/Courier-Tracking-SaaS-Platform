"use client";
import { useState } from "react";
import {
  usePayments,
  useUpdatePaymentStatus,
} from "@/modules/payment/hooks/usePayments";
import type {
  Payment,
  PaymentStatus,
} from "@/modules/payment/types/payment.types";
import { useSession } from "@/hooks/useSession";

const statusStyles: Record<PaymentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
};

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function UpdateStatusModal({
  payment,
  onClose,
}: {
  payment: Payment;
  onClose: () => void;
}) {
  const { mutate: update, isPending } = useUpdatePaymentStatus(payment.id);
  const [status, setStatus] = useState<PaymentStatus>(payment.status);
  const [txId, setTxId] = useState("");

  const STATUSES: PaymentStatus[] = ["pending", "paid", "failed", "refunded"];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4 shadow-xl">
        <h2 className="font-semibold">Update Payment Status</h2>
        <div className="space-y-1">
          <label className="text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PaymentStatus)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">
            Transaction ID (optional)
          </label>
          <input
            value={txId}
            onChange={(e) => setTxId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() =>
              update(
                { status, gatewayTransactionId: txId || undefined },
                { onSuccess: onClose },
              )
            }
            disabled={isPending}
            className="flex-1 bg-black text-white py-2 rounded-lg text-sm disabled:opacity-50"
          >
            {isPending ? "Updating..." : "Update"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 border py-2 rounded-lg text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminPayments() {
  const { data, isLoading } = usePayments({ page: 1, limit: 20 });
  const [selected, setSelected] = useState<Payment | null>(null);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Payments</h1>
      {selected && (
        <UpdateStatusModal
          payment={selected}
          onClose={() => setSelected(null)}
        />
      )}
      {isLoading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {[
                  "Parcel ID",
                  "Amount",
                  "Currency",
                  "Status",
                  "Created",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-medium text-gray-600"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {(data?.data?.payments ?? []).map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{p.parcelId}</td>
                  <td className="px-4 py-3 font-medium">{p.amount}</td>
                  <td className="px-4 py-3 text-gray-500">{p.currency}</td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(p)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function PaymentsPage() {
  const { role } = useSession();
  if (role === "admin") return <AdminPayments />;
  // customer view is per-shipment, linked from shipment detail page
  return (
    <p className="text-gray-500 text-sm">
      Select a shipment to view its payment.
    </p>
  );
}
