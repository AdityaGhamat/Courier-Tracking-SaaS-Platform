import type { ShipmentStatus } from "@/types/shipment.types";

const statusStyles: Record<ShipmentStatus, string> = {
  label_created: "bg-gray-100 text-gray-700",
  picked_up: "bg-blue-100 text-blue-700",
  at_sorting_facility: "bg-purple-100 text-purple-700",
  in_transit: "bg-yellow-100 text-yellow-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  retry: "bg-yellow-100 text-yellow-800",
  returned: "bg-pink-100 text-pink-700",
  exception: "bg-red-200 text-red-800",
};

export default function ShipmentStatusBadge({
  status,
}: {
  status: ShipmentStatus;
}) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
