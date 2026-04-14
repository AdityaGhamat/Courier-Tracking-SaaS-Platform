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
  MapPin,
  Calendar,
  Weight,
  Truck,
} from "lucide-react";
import { serverFetch } from "@/lib/server-api";
import { getSessionUser } from "@/lib/session";
import { ShipmentTimeline } from "@/components/shipments/shipment-timeline";
import { AssignAgentDialog } from "@/components/shipments/assign-agent-dialog";
import {
  UpdateStatusDialog,
  AGENT_ALLOWED_STATUSES,
} from "@/components/shipments/update-status-dialog";
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
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex flex-col gap-1 w-full overflow-hidden">
      <dt className="flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase tracking-wider font-bold">
        {Icon && <Icon size={10} />}
        {label}
      </dt>
      <dd
        className={`text-sm font-medium text-foreground break-words ${
          mono ? "font-mono" : ""
        }`}
      >
        {value ?? <span className="text-muted-foreground italic">—</span>}
      </dd>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
  accent,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div
        className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border"
        style={accent ? { background: accent } : undefined}
      >
        <Icon
          size={14}
          className={
            accent ? "text-white/80 shrink-0" : "text-primary shrink-0"
          }
        />
        <h2
          className={`text-sm font-bold ${
            accent ? "text-white" : "text-foreground"
          }`}
        >
          {title}
        </h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

const TERMINAL_STATUSES = ["delivered", "returned"] as const;
type TerminalStatus = (typeof TERMINAL_STATUSES)[number];

export default async function ShipmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getSessionUser();

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isAgent = user?.role === "delivery_agent";

  let shipment: Shipment | null = null;
  let errorMsg: string | null = null;

  try {
    const res = await serverFetch<ShipmentResponse>(`shipments/${id}`);
    shipment = res.data?.shipment ?? null;
  } catch (err: any) {
    errorMsg = err?.message || "Failed to load shipment.";
    if (err?.statusCode === 404) notFound();
  }

  // ── Error / not-found state ──────────────────────────────────────────────────
  if (errorMsg || !shipment) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
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
                {errorMsg ? "Backend error" : `ID: ${id.slice(0, 8)}…`}
              </p>
            </div>
          </div>
          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
              <p className="text-sm text-destructive font-medium">
                {errorMsg || `Shipment "${id}" could not be found.`}
              </p>
            </div>
            <Link
              href="/shipments"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-semibold text-sm text-white transition-opacity hover:opacity-90 no-underline"
              style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
            >
              <ArrowLeft size={14} />
              Return to Shipments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Agent context flags
  const isAssignedToMe = isAgent && shipment.driver?.id === user?.id;
  const isTerminal = TERMINAL_STATUSES.includes(
    shipment.status as TerminalStatus,
  );

  return (
    <div className="flex flex-col gap-5 w-full min-w-0 max-w-4xl mx-auto pb-8">
      {/* Back */}
      <Link
        href="/shipments"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors no-underline w-fit"
      >
        <ArrowLeft size={13} />
        Back to Shipments
      </Link>

      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-3 w-full">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-foreground">
              Shipment Detail
            </h1>
            <StatusBadge status={shipment.status} />
          </div>
          <p className="text-sm text-muted-foreground mt-1 font-mono">
            {shipment.trackingNumber}
          </p>
        </div>

        {/* Admin actions */}
        {isAdmin && (
          <div className="flex gap-2 flex-wrap shrink-0">
            <AssignAgentDialog shipmentId={shipment.id} />
            <UpdateStatusDialog
              shipmentId={shipment.id}
              currentStatus={shipment.status}
            />
          </div>
        )}

        {/* Agent action — scoped status list, non-terminal only */}
        {isAgent && isAssignedToMe && !isTerminal && (
          <div className="shrink-0">
            <UpdateStatusDialog
              shipmentId={shipment.id}
              currentStatus={shipment.status}
              allowedStatuses={AGENT_ALLOWED_STATUSES}
            />
          </div>
        )}
      </div>

      {/* Agent context banners */}
      {isAgent && !isAssignedToMe && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5">
          <Truck size={16} className="text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800 font-medium">
            This shipment is not currently assigned to you — status updates are
            disabled.
          </p>
        </div>
      )}

      {isAgent && isAssignedToMe && isTerminal && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-3.5">
          <UserCheck size={16} className="text-green-600 shrink-0" />
          <p className="text-sm text-green-800 font-medium">
            This shipment has been{" "}
            <span className="font-bold">{shipment.status}</span> — no further
            updates are needed.
          </p>
        </div>
      )}

      {/* Assigned agent banner */}
      {shipment.driver && (
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-5 py-3.5">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 text-primary-foreground font-bold text-sm">
            {shipment.driver.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-primary font-bold uppercase tracking-wider">
              Assigned Agent
            </p>
            <p className="text-sm font-semibold text-foreground truncate">
              {shipment.driver.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {shipment.driver.email}
            </p>
          </div>
          <UserCheck size={16} className="text-primary/50 shrink-0" />
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
              icon={Weight}
              value={shipment.weight ? `${shipment.weight} kg` : null}
            />
            <InfoRow
              label="Estimated Delivery"
              icon={Calendar}
              value={
                shipment.estimatedDelivery
                  ? new Date(shipment.estimatedDelivery).toLocaleString(
                      "en-IN",
                      { dateStyle: "medium", timeStyle: "short" },
                    )
                  : null
              }
            />
            <InfoRow
              label="Created"
              value={new Date(shipment.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            />
            <InfoRow
              label="Last Updated"
              value={new Date(shipment.updatedAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            />
          </dl>
        </SectionCard>

        <SectionCard title="Recipient" icon={User}>
          <dl className="flex flex-col gap-4">
            <InfoRow label="Name" value={shipment.recipientName} />
            <InfoRow
              label="Address"
              icon={MapPin}
              value={shipment.recipientAddress}
            />
            <InfoRow label="Phone" value={shipment.recipientPhone} />
            <InfoRow label="Email" value={(shipment as any).recipientEmail} />
          </dl>
        </SectionCard>
      </div>

      {/* QR Code */}
      <SectionCard title="QR Code" icon={QrCode}>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="bg-background p-2.5 rounded-xl border border-border shadow-sm w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/proxy/qrcode/${shipment.id}`}
              alt={`QR code for ${shipment.trackingNumber}`}
              width={140}
              height={140}
              loading="lazy"
              className="block rounded"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Scan to Track</p>
            <p className="text-xs text-muted-foreground mt-1.5 max-w-[200px]">
              Share this QR code with the recipient so they can track their
              package.
            </p>
            <p className="text-[11px] font-mono text-muted-foreground mt-2 bg-muted px-2 py-1 rounded">
              {shipment.trackingNumber}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Proof of delivery */}
      {(shipment as any).deliveryProofUrl && (
        <SectionCard title="Proof of Delivery" icon={Package}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={(shipment as any).deliveryProofUrl}
            alt="Proof of delivery"
            loading="lazy"
            className="max-w-[400px] w-full h-auto rounded-xl border border-border shadow-sm"
          />
        </SectionCard>
      )}

      {/* Timeline */}
      <SectionCard title="Tracking History" icon={Clock}>
        <ShipmentTimeline events={shipment.events ?? []} />
      </SectionCard>
    </div>
  );
}
