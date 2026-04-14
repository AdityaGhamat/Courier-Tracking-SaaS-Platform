import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  User,
  Clock,
  QrCode,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
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
      <dt className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
        {label}
      </dt>
      <dd
        className={`text-sm font-medium break-words ${mono ? "font-mono" : ""}`}
      >
        {value ?? <span className="text-muted-foreground">—</span>}
      </dd>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
        <Icon size={15} className="text-indigo-500 shrink-0" />
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
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
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="max-w-md w-full">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Error header */}
            <div
              className="px-6 py-8 flex flex-col items-center text-center gap-4"
              style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)" }}
            >
              <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle size={28} className="text-red-300" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">
                  Shipment Not Found
                </h2>
                <p className="text-indigo-300 text-sm mt-1">
                  {errorMsg
                    ? "Backend connection error"
                    : `ID: ${id.slice(0, 8)}…`}
                </p>
              </div>
            </div>

            {/* Error body */}
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <p className="text-sm text-red-600 font-medium">
                  {errorMsg || `Shipment ID "${id}" could not be found.`}
                </p>
              </div>

              <div className="space-y-2 text-sm text-slate-500">
                <p className="font-medium text-slate-700">Possible reasons:</p>
                <ul className="space-y-1 list-disc list-inside text-xs">
                  <li>The shipment ID is incorrect or has been deleted</li>
                  <li>The backend service is temporarily unavailable</li>
                  <li>You may not have permission to view this shipment</li>
                </ul>
              </div>

              <Link
                href="/shipments"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-semibold text-sm text-white transition-opacity hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                }}
              >
                <ArrowLeft size={14} />
                Return to Shipments
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full min-w-0 max-w-4xl mx-auto pb-8">
      {/* Back + Header */}
      <div>
        <Link
          href="/shipments"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors no-underline"
        >
          <ArrowLeft size={14} />
          Back to Shipments
        </Link>

        <div className="flex items-start justify-between mt-4 flex-wrap gap-3 w-full">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">
                Shipment Detail
              </h1>
              <StatusBadge status={shipment.status} />
            </div>
            <p className="text-sm text-slate-500 mt-1 font-mono">
              {shipment.trackingNumber}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap shrink-0">
            <AssignAgentDialog shipmentId={shipment.id} />
            <UpdateStatusDialog
              shipmentId={shipment.id}
              currentStatus={shipment.status}
            />
          </div>
        </div>
      </div>

      {/* Assigned Agent Banner */}
      {shipment.driver && (
        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-3.5">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 text-white font-bold text-sm">
            {shipment.driver.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide">
              Assigned Agent
            </p>
            <p className="text-sm font-semibold text-indigo-900 truncate">
              {shipment.driver.name}
            </p>
            <p className="text-xs text-indigo-600 truncate">
              {shipment.driver.email}
            </p>
          </div>
          <UserCheck size={18} className="text-indigo-400 ml-auto shrink-0" />
        </div>
      )}

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Shipment Info" icon={Package}>
          <dl className="flex flex-col gap-4">
            <InfoRow
              label="Tracking Number"
              value={shipment.trackingNumber}
              mono
            />
            <InfoRow
              label="Weight"
              value={shipment.weight ? `${shipment.weight} kg` : null}
            />
            <InfoRow
              label="Estimated Delivery"
              value={
                shipment.estimatedDelivery
                  ? new Date(shipment.estimatedDelivery).toLocaleString()
                  : null
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
        </SectionCard>

        <SectionCard title="Recipient" icon={User}>
          <dl className="flex flex-col gap-4">
            <InfoRow label="Name" value={shipment.recipientName} />
            <InfoRow label="Address" value={shipment.recipientAddress} />
            <InfoRow label="Phone" value={shipment.recipientPhone} />
            <InfoRow label="Email" value={shipment.recipientEmail} />
          </dl>
        </SectionCard>
      </div>

      {/* QR Code */}
      <SectionCard title="QR Code" icon={QrCode}>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="bg-white p-2 w-fit rounded-lg border border-slate-200 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/proxy/qrcode/${shipment.id}`}
              alt={`QR code for shipment ${shipment.trackingNumber}`}
              width={140}
              height={140}
              className="block"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Scan to Track
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
              Share this QR code with the recipient to let them track their
              shipment.
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Proof of Delivery */}
      {shipment.deliveryProofUrl && (
        <SectionCard title="Proof of Delivery" icon={Package}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shipment.deliveryProofUrl}
            alt="Proof of delivery"
            className="max-w-[400px] w-full h-auto rounded-lg border border-slate-200"
          />
        </SectionCard>
      )}

      {/* Tracking Timeline */}
      <SectionCard title="Tracking History" icon={Clock}>
        <ShipmentTimeline events={shipment.events ?? []} />
      </SectionCard>
    </div>
  );
}
