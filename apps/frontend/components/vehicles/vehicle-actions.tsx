"use client";

import { useRouter } from "next/navigation";
import { AssignAgentVehicleDialog } from "./assign-agent-vehicle-dialog";
import { UnassignAgentButton } from "./unassign-agent-button";

interface Props {
  vehicleId: string;
  currentAgentId?: string | null;
  currentAgentName?: string | null;
}

export function VehicleActions({
  vehicleId,
  currentAgentId,
  currentAgentName,
}: Props) {
  const router = useRouter();

  function refresh() {
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
      <AssignAgentVehicleDialog
        vehicleId={vehicleId}
        currentAgentId={currentAgentId}
        onDone={refresh}
      />
      {/* Only show Unassign if vehicle has an agent */}
      {currentAgentId && (
        <UnassignAgentButton
          vehicleId={vehicleId}
          agentName={currentAgentName ?? undefined}
          onDone={refresh}
        />
      )}
    </div>
  );
}
