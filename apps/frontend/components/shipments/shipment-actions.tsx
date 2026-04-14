"use client";

import { useRouter } from "next/navigation";
import { AssignAgentDialog } from "./assign-agent-dialog";
import { UpdateStatusDialog } from "./update-status-dialog";
import type { ShipmentStatus } from "@/types/shipment.types";

interface Props {
  shipmentId: string;
  currentStatus: ShipmentStatus;
  currentAgentId?: string | null;
}

export function ShipmentActions({
  shipmentId,
  currentStatus,
  currentAgentId,
}: Props) {
  const router = useRouter();
  function refresh() {
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <UpdateStatusDialog
        shipmentId={shipmentId}
        currentStatus={currentStatus}
        onDone={refresh}
      />
      <AssignAgentDialog
        shipmentId={shipmentId}
        currentAgentId={currentAgentId}
        onDone={refresh}
      />
    </div>
  );
}
