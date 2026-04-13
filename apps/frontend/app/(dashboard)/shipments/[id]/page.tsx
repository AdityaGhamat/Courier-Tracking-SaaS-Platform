import { notFound } from "next/navigation";
import Link from "next/link";
import { serverFetch } from "@/lib/server-api";
import { ShipmentTimeline } from "@/components/shipments/shipment-timeline";
import { AssignAgentDialog } from "@/components/shipments/assign-agent-dialog";
import { UpdateStatusDialog } from "@/components/shipments/update-status-dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Shipment } from "@/types/shipment.types";

interface PageProps {
  params: { id: string };
}

interface ShipmentResponse {
  data: { shipment: Shipment };
}

export default async function ShipmentDetailPage({ params }: PageProps) {
  let shipment: Shipment | null = null;

  try {
    const res = await serverFetch<ShipmentResponse>(`shipments/${params.id}`);
    shipment = res.data?.shipment ?? null;
  } catch {
    notFound();
  }

  if (!shipment) notFound();

  const infoRows = [
    { label: "Tracking Number", value: shipment.trackingNumber, mono: true },
    { label: "Status", value: <StatusBadge status={shipment.status} /> },
    { label: "Weight", value: shipment.weight ? `${shipment.weight} kg` : "—" },
    {
      label: "Estimated Delivery",
      value: shipment.estimatedDelivery
        ? new Date(shipment.estimatedDelivery).toLocaleString()
        : "—",
    },
    { label: "Created", value: new Date(shipment.createdAt).toLocaleString() },
    {
      label: "Last Updated",
      value: new Date(shipment.updatedAt).toLocaleString(),
    },
  ];

  const recipientRows = [
    { label: "Name", value: shipment.recipientName },
    { label: "Address", value: shipment.recipientAddress },
    { label: "Phone", value: shipment.recipientPhone ?? "—" },
    { label: "Email", value: shipment.recipientEmail ?? "—" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
        maxWidth: "900px",
      }}
    >
      {/* Back + Header */}
      <div>
        <Link
          href="/shipments"
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            textDecoration: "none",
          }}
        >
          ← Back to Shipments
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "var(--space-4)",
            flexWrap: "wrap",
            gap: "var(--space-3)",
          }}
        >
          <div>
            <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 700 }}>
              Shipment Detail
            </h1>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-muted)",
                marginTop: "var(--space-1)",
                fontFamily: "monospace",
              }}
            >
              {shipment.trackingNumber}
            </p>
          </div>
          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <AssignAgentDialog shipmentId={shipment.id} />
            <UpdateStatusDialog
              shipmentId={shipment.id}
              currentStatus={shipment.status}
            />
          </div>
        </div>
      </div>

      {/* Two-column cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-6)",
        }}
      >
        {/* Shipment Info */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-6)",
          }}
        >
          <h2
            style={{
              fontSize: "var(--text-base)",
              fontWeight: 600,
              marginBottom: "var(--space-4)",
            }}
          >
            Shipment Info
          </h2>
          <dl
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
            }}
          >
            {infoRows.map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-1)",
                }}
              >
                <dt
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {row.label}
                </dt>
                <dd
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    fontFamily: (row as any).mono ? "monospace" : undefined,
                  }}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Recipient Info */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-6)",
          }}
        >
          <h2
            style={{
              fontSize: "var(--text-base)",
              fontWeight: 600,
              marginBottom: "var(--space-4)",
            }}
          >
            Recipient
          </h2>
          <dl
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
            }}
          >
            {recipientRows.map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-1)",
                }}
              >
                <dt
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {row.label}
                </dt>
                <dd style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Assigned Driver */}
      {shipment.driver && (
        <div
          style={{
            background: "var(--color-primary-highlight)",
            border: "1px solid var(--color-primary)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-4) var(--space-6)",
            display: "flex",
            gap: "var(--space-3)",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>🚴</span>
          <div>
            <p style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>
              Assigned Agent
            </p>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-muted)",
              }}
            >
              {shipment.driver.name} — {shipment.driver.email}
            </p>
          </div>
        </div>
      )}

      {/* QR Code */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-6)",
        }}
      >
        <h2
          style={{
            fontSize: "var(--text-base)",
            fontWeight: 600,
            marginBottom: "var(--space-4)",
          }}
        >
          QR Code
        </h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/proxy/qrcode/${shipment.id}`}
          alt={`QR code for shipment ${shipment.trackingNumber}`}
          width={160}
          height={160}
          style={{
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
          }}
        />
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            marginTop: "var(--space-2)",
          }}
        >
          Scan to track this shipment
        </p>
      </div>

      {/* Proof of Delivery */}
      {shipment.deliveryProofUrl && (
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-6)",
          }}
        >
          <h2
            style={{
              fontSize: "var(--text-base)",
              fontWeight: 600,
              marginBottom: "var(--space-4)",
            }}
          >
            Proof of Delivery
          </h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shipment.deliveryProofUrl}
            alt="Proof of delivery"
            style={{
              maxWidth: "400px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
            }}
          />
        </div>
      )}

      {/* Tracking Timeline */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-6)",
        }}
      >
        <h2
          style={{
            fontSize: "var(--text-base)",
            fontWeight: 600,
            marginBottom: "var(--space-6)",
          }}
        >
          Tracking History
        </h2>
        <ShipmentTimeline events={shipment.events ?? []} />
      </div>
    </div>
  );
}
