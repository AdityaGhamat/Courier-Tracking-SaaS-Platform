"use client";
import { useState } from "react";
import { useCreateShipment } from "../hooks/useShipments";

export default function CreateShipmentForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const { mutate: create, isPending, error } = useCreateShipment();
  const [form, setForm] = useState({
    recipientName: "",
    recipientAddress: "",
    recipientPhone: "",
    recipientEmail: "",
    weight: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create(form, { onSuccess: onClose });
  };

  const fields = [
    {
      key: "recipientName",
      label: "Recipient Name",
      type: "text",
      required: true,
    },
    {
      key: "recipientAddress",
      label: "Recipient Address",
      type: "text",
      required: true,
    },
    {
      key: "recipientPhone",
      label: "Phone (optional)",
      type: "text",
      required: false,
    },
    {
      key: "recipientEmail",
      label: "Email (optional)",
      type: "email",
      required: false,
    },
    {
      key: "weight",
      label: "Weight (optional)",
      type: "text",
      required: false,
    },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-500">{error.message}</p>}
      {fields.map((f) => (
        <div key={f.key} className="space-y-1">
          <label className="text-sm font-medium">{f.label}</label>
          <input
            type={f.type}
            required={f.required}
            value={form[f.key]}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create Shipment"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 border py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
