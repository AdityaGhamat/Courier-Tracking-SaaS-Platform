"use client";
import { useState } from "react";
import { useRegisterTenant } from "../hooks/useAuth";

export default function RegisterTenantForm() {
  const { mutate: register, isPending, error } = useRegisterTenant();
  const [form, setForm] = useState({
    companyName: "",
    adminName: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(form);
  };

  const fields = [
    { key: "companyName", label: "Company Name", type: "text" },
    { key: "adminName", label: "Your Name", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "password", label: "Password", type: "password" },
  ] as const;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow space-y-4"
    >
      <h1 className="text-2xl font-bold text-center">Register Your Company</h1>

      {error && (
        <p className="text-sm text-red-500 text-center">{error.message}</p>
      )}

      {fields.map((f) => (
        <div key={f.key} className="space-y-1">
          <label className="text-sm font-medium">{f.label}</label>
          <input
            type={f.type}
            required
            value={form[f.key]}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {isPending ? "Creating account..." : "Create Account"}
      </button>

      <p className="text-sm text-center text-gray-500">
        Already have an account?{" "}
        <a href="/login" className="text-black font-medium underline">
          Login
        </a>
      </p>
    </form>
  );
}
