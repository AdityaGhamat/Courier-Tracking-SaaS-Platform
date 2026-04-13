"use client";

import { useState } from "react";
import { trackingApi } from "@/lib/api";
import type { Shipment, ShipmentStatus } from "@/types";
import { MapPin, Search, Loader2, CheckCircle2, Circle } from "lucide-react";

const TIMELINE: { status: ShipmentStatus; label: string }[] = [
  { status: "label_created", label: "Label Created" },
  { status: "picked_up", label: "Picked Up" },
  { status: "at_sorting_facility", label: "At Sorting Facility" },
  { status: "in_transit", label: "In Transit" },
  { status: "out_for_delivery", label: "Out for Delivery" },
  { status: "delivered", label: "Delivered" },
];

const TERMINAL: ShipmentStatus[] = ["failed", "returned", "retry"];

function getStepIndex(status: ShipmentStatus) {
  return TIMELINE.findIndex((t) => t.status === status);
}

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setLoading(true);
    setError("");
    setShipment(null);
    try {
      const res = (await trackingApi.track(trackingId.trim())) as any;
      setShipment(res?.data ?? res);
    } catch (e: any) {
      setError(e?.message ?? "Shipment not found");
    } finally {
      setLoading(false);
    }
  }

  const currentStep = shipment ? getStepIndex(shipment.status) : -1;
  const isTerminal = shipment ? TERMINAL.includes(shipment.status) : false;

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1
          className="font-bold"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-headline-sm)",
            color: "var(--color-on-surface)",
          }}
        >
          Track Shipment
        </h1>
        <p
          style={{
            fontSize: "var(--text-body-md)",
            color: "var(--color-on-surface-variant)",
            marginTop: "0.25rem",
          }}
        >
          Enter a tracking ID to get live status updates
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleTrack} className="flex gap-3">
        <div
          className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg"
          style={{
            backgroundColor: "var(--color-surface-low)",
            border: "1px solid var(--color-outline-variant)",
          }}
        >
          <MapPin
            size={16}
            style={{ color: "var(--color-on-surface-variant)" }}
          />
          <input
            type="text"
            placeholder="Enter tracking ID (e.g. TRK-123456)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            style={{
              fontSize: "var(--text-body-md)",
              color: "var(--color-on-surface)",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-kinetic px-5 py-3 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-60"
          style={{ fontSize: "var(--text-body-md)" }}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Search size={16} />
          )}
          Track
        </button>
      </form>

      {/* Error */}
      {error && (
        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: "var(--color-error-container)",
            color: "var(--color-on-error-container)",
            fontSize: "var(--text-body-md)",
          }}
        >
          {error}
        </div>
      )}

      {/* Result */}
      {shipment && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--color-outline-variant)" }}
        >
          {/* Header */}
          <div
            className="px-6 py-4"
            style={{ backgroundColor: "var(--color-primary-container)" }}
          >
            <p
              className="font-mono font-bold"
              style={{
                fontSize: "var(--text-title-md)",
                color: "var(--color-secondary-container)",
              }}
            >
              {shipment.trackingId}
            </p>
            <p
              className="font-semibold"
              style={{
                fontSize: "var(--text-body-md)",
                color: "var(--color-on-primary)",
                marginTop: "0.25rem",
              }}
            >
              To: {shipment.recipientName}
            </p>
            <p
              style={{
                fontSize: "var(--text-body-sm)",
                color: "var(--color-on-primary-container)",
              }}
            >
              {shipment.recipientAddress}
            </p>
          </div>

          {/* Timeline */}
          <div
            className="px-6 py-6 space-y-0"
            style={{ backgroundColor: "var(--color-surface-lowest)" }}
          >
            {isTerminal ? (
              <div
                className="rounded-lg p-4"
                style={{
                  backgroundColor: "var(--color-error-container)",
                  color: "var(--color-on-error-container)",
                }}
              >
                <p
                  className="font-semibold capitalize"
                  style={{ fontSize: "var(--text-body-md)" }}
                >
                  Status: {shipment.status.replace("_", " ")}
                </p>
              </div>
            ) : (
              TIMELINE.map((step, idx) => {
                const done = idx <= currentStep;
                const active = idx === currentStep;
                return (
                  <div key={step.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {done ? (
                        <CheckCircle2
                          size={20}
                          style={{
                            color: "var(--color-success)",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <Circle
                          size={20}
                          style={{
                            color: "var(--color-outline-variant)",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      {idx < TIMELINE.length - 1 && (
                        <div
                          className="w-px flex-1 my-1"
                          style={{
                            backgroundColor: done
                              ? "var(--color-success)"
                              : "var(--color-outline-variant)",
                            opacity: 0.4,
                            minHeight: "24px",
                          }}
                        />
                      )}
                    </div>
                    <div className="pb-5">
                      <p
                        className="font-medium"
                        style={{
                          fontSize: "var(--text-body-md)",
                          color: active
                            ? "var(--color-secondary-container)"
                            : done
                              ? "var(--color-on-surface)"
                              : "var(--color-on-surface-variant)",
                          fontWeight: active ? 700 : done ? 500 : 400,
                        }}
                      >
                        {step.label}
                      </p>
                      {active && shipment.events?.[0] && (
                        <p
                          style={{
                            fontSize: "var(--text-label-md)",
                            color: "var(--color-on-surface-variant)",
                            marginTop: "0.1rem",
                          }}
                        >
                          {new Date(
                            shipment.events[0].createdAt,
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ETA */}
          {shipment.estimatedDelivery && (
            <div
              className="px-6 py-3"
              style={{
                backgroundColor: "var(--color-surface-low)",
                borderTop: "1px solid var(--color-outline-variant)",
              }}
            >
              <p
                style={{
                  fontSize: "var(--text-body-sm)",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                Estimated delivery:{" "}
                <span
                  className="font-semibold"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
