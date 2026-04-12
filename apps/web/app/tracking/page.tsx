"use client";
import { useState } from "react";
import { useTracking } from "@/modules/tracking/hooks/useTracking";
import ShipmentStatusBadge from "@/modules/shipment/components/ShipmentStatusBadge";

export default function TrackingPage() {
  const [input, setInput] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const { data, isLoading, error } = useTracking(trackingNumber);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingNumber(input.trim());
  };

  const result = data?.data;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
      <h1 className="text-3xl font-bold mb-2">Track Your Shipment</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Enter your tracking number below
      </p>

      <form
        onSubmit={handleSearch}
        className="flex gap-2 w-full max-w-lg mb-10"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. CN-20260412-AB3X"
          className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          Track
        </button>
      </form>

      {isLoading && <p className="text-gray-500 text-sm">Searching...</p>}
      {error && <p className="text-red-500 text-sm">Shipment not found.</p>}

      {result && (
        <div className="w-full max-w-lg bg-white border rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-mono">
                {result.trackingNumber}
              </p>
              <p className="font-semibold">{result.recipientName}</p>
              <p className="text-sm text-gray-500">{result.recipientAddress}</p>
            </div>
            <ShipmentStatusBadge status={result.currentStatus} />
          </div>

          {result.estimatedDelivery && (
            <p className="text-sm text-gray-500">
              Est. Delivery:{" "}
              <span className="font-medium text-gray-800">
                {new Date(result.estimatedDelivery).toLocaleDateString()}
              </span>
            </p>
          )}

          <div>
            <h2 className="text-sm font-semibold mb-3">Tracking History</h2>
            <ol className="relative border-l border-gray-200 space-y-4 pl-4">
              {result.events.map((event, i) => (
                <li key={i} className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gray-900 border-2 border-white" />
                  <div className="flex items-start justify-between">
                    <div>
                      <ShipmentStatusBadge status={event.status} />
                      <p className="text-sm text-gray-700 mt-1">
                        {event.description}
                      </p>
                      <p className="text-xs text-gray-400">{event.location}</p>
                    </div>
                    <p className="text-xs text-gray-400 shrink-0 ml-4">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
