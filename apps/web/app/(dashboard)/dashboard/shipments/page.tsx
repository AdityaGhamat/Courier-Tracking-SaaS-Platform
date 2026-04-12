"use client";
import { useState } from "react";
import {
  useShipments,
  useMyShipments,
  useAgentShipments,
} from "@/modules/shipment/hooks/useShipments";
import ShipmentTable from "@/modules/shipment/components/ShipmentTable";
import CreateShipmentForm from "@/modules/shipment/components/CreateShipmentForm";
import { useSession } from "@/hooks/useSession";
function AdminShipments() {
  const { data, isLoading } = useShipments({ page: 1, limit: 20 });
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Shipments</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          + New Shipment
        </button>
      </div>
      {showForm && (
        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Create Shipment</h2>
          <CreateShipmentForm onClose={() => setShowForm(false)} />
        </div>
      )}
      {isLoading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <ShipmentTable shipments={data?.data?.shipments ?? []} />
      )}
    </div>
  );
}

function CustomerShipments() {
  const { data, isLoading } = useMyShipments({ page: 1, limit: 20 });
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Shipments</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          + New Shipment
        </button>
      </div>
      {showForm && (
        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Create Shipment</h2>
          <CreateShipmentForm onClose={() => setShowForm(false)} />
        </div>
      )}
      {isLoading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <ShipmentTable shipments={data?.data?.shipments ?? []} />
      )}
    </div>
  );
}

function AgentShipments() {
  const { data, isLoading } = useAgentShipments();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Assigned Shipments</h1>
      {isLoading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <ShipmentTable shipments={data?.data?.shipments ?? []} />
      )}
    </div>
  );
}

export default function ShipmentsPage() {
  const { role } = useSession();

  if (role === "admin") return <AdminShipments />;
  if (role === "customer") return <CustomerShipments />;
  if (role === "delivery_agent") return <AgentShipments />;
  return null;
}
