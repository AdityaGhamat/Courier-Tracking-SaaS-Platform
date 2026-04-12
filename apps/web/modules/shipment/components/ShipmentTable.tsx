"use client";
import type { Shipment } from "@/types/shipment.types";
import ShipmentStatusBadge from "./ShipmentStatusBadge";
import Link from "next/link";

export default function ShipmentTable({
  shipments,
}: {
  shipments: Shipment[];
}) {
  if (shipments.length === 0) {
    return <p className="text-gray-500 text-sm">No shipments found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-gray-600">
              Tracking #
            </th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">
              Recipient
            </th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">
              Address
            </th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">
              Status
            </th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">
              Created
            </th>
            <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {shipments.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs">
                {s.trackingNumber}
              </td>
              <td className="px-4 py-3">{s.recipientName}</td>
              <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                {s.recipientAddress}
              </td>
              <td className="px-4 py-3">
                <ShipmentStatusBadge status={s.status} />
              </td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(s.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/dashboard/shipments/${s.id}`}
                  className="text-blue-600 hover:underline text-xs"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
