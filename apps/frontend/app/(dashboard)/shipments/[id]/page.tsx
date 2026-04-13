import { notFound } from "next/navigation";
import Link from "next/link";
import { serverFetch } from "@/lib/server-api";
import { ShipmentTimeline } from "@/components/shipments/shipment-timeline";
import { AssignAgentDialog } from "@/components/shipments/assign-agent-dialog";
import { UpdateStatusDialog } from "@/components/shipments/update-status-dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Shipment } from "@/types/shipment.types";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface ShipmentResponse {
  data: { shipment: Shipment };
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 w-full overflow-hidden">
      <dt className="text-xs text-muted-foreground uppercase tracking-wider font-medium truncate">
        {label}
      </dt>
      <dd
        className={`text-sm font-medium break-words ${mono ? "font-mono" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

export default async function ShipmentDetailPage({ params }: PageProps) {
  const { id } = await params;

  let shipment: Shipment | null = null;
  let errorMsg: string | null = null;

  try {
    const res = await serverFetch<ShipmentResponse>(`shipments/${id}`);
    shipment = res.data?.shipment ?? null;
  } catch (err: any) {
    errorMsg = err?.message || "Failed to connect to the backend API.";
  }

  if (errorMsg || !shipment) {
    return (
      <div className="p-6 rounded-lg bg-destructive/10 text-destructive border border-destructive max-w-3xl mx-auto mt-8 text-center w-full">
        <h2 className="text-lg font-bold mb-2">Failed to Load Shipment</h2>
        <p className="text-sm mb-4 break-words">
          {errorMsg || `Shipment ID "${id}" could not be found.`}
        </p>
        <Link
          href="/shipments"
          className="text-sm font-semibold underline text-destructive"
        >
          ← Return to Shipments
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full min-w-0 max-w-4xl mx-auto">
      {/* Back + Header */}
      <div className="w-full">
        <Link
          href="/shipments"
          className="text-sm text-muted-foreground no-underline inline-flex items-center gap-1 hover:text-foreground transition-colors"
        >
          ← Back to Shipments
        </Link>
        <div className="flex items-start justify-between mt-4 flex-wrap gap-3 w-full">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold truncate">Shipment Detail</h1>
            <p className="text-sm text-muted-foreground mt-1 font-mono truncate">
              {shipment.trackingNumber}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap shrink-0">
            <AssignAgentDialog shipmentId={shipment.id} />
            <UpdateStatusDialog
              shipmentId={shipment.id}
              currentStatus={shipment.status}
            />
          </div>
        </div>
      </div>

      {/* Two-column info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-w-0">
        {/* Shipment Info */}
        <div className="bg-card border border-border rounded-lg p-6 w-full overflow-hidden">
          <h2 className="text-base font-semibold mb-4">Shipment Info</h2>
          <dl className="flex flex-col gap-4">
            <InfoRow
              label="Tracking Number"
              value={shipment.trackingNumber}
              mono
            />
            <InfoRow
              label="Status"
              value={<StatusBadge status={shipment.status} />}
            />
            <InfoRow
              label="Weight"
              value={shipment.weight ? `${shipment.weight} kg` : "—"}
            />
            <InfoRow
              label="Estimated Delivery"
              value={
                shipment.estimatedDelivery
                  ? new Date(shipment.estimatedDelivery).toLocaleString()
                  : "—"
              }
            />
            <InfoRow
              label="Created"
              value={new Date(shipment.createdAt).toLocaleString()}
            />
            <InfoRow
              label="Last Updated"
              value={new Date(shipment.updatedAt).toLocaleString()}
            />
          </dl>
        </div>

        {/* Recipient Info */}
        <div className="bg-card border border-border rounded-lg p-6 w-full overflow-hidden">
          <h2 className="text-base font-semibold mb-4">Recipient</h2>
          <dl className="flex flex-col gap-4">
            <InfoRow label="Name" value={shipment.recipientName} />
            <InfoRow label="Address" value={shipment.recipientAddress} />
            <InfoRow label="Phone" value={shipment.recipientPhone ?? "—"} />
            <InfoRow label="Email" value={shipment.recipientEmail ?? "—"} />
          </dl>
        </div>
      </div>

      {/* Assigned Driver */}
      {shipment.driver && (
        <div className="bg-[#fd761a]/10 border border-[#fd761a]/30 rounded-lg px-6 py-4 flex gap-3 items-center w-full min-w-0">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0 text-[#fd761a]"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          <div className="min-w-0">
            <p className="font-semibold text-sm">Assigned Agent</p>
            <p className="text-sm text-muted-foreground truncate">
              {shipment.driver.name} — {shipment.driver.email}
            </p>
          </div>
        </div>
      )}

      {/* QR Code */}
      <div className="bg-card border border-border rounded-lg p-6 w-full min-w-0">
        <h2 className="text-base font-semibold mb-4">QR Code</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="bg-white p-2 w-fit rounded-md border border-border">
          <img
            src={`/api/proxy/qrcode/${shipment.id}`}
            alt={`QR code for shipment ${shipment.trackingNumber}`}
            width={140}
            height={140}
            className="block"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Scan to track this shipment
        </p>
      </div>

      {/* Proof of Delivery */}
      {shipment.deliveryProofUrl && (
        <div className="bg-card border border-border rounded-lg p-6 w-full min-w-0">
          <h2 className="text-base font-semibold mb-4">Proof of Delivery</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shipment.deliveryProofUrl}
            alt="Proof of delivery"
            className="max-w-[400px] w-full h-auto rounded-md border border-border"
          />
        </div>
      )}

      {/* Tracking Timeline */}
      <div className="bg-card border border-border rounded-lg p-6 w-full min-w-0">
        <h2 className="text-base font-semibold mb-6">Tracking History</h2>
        <ShipmentTimeline events={shipment.events ?? []} />
      </div>
    </div>
  );
}
