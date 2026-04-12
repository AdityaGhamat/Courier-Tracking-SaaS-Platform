"use client";
import { useState } from "react";
import { useLogin } from "../hooks/useAuth";

export default function LoginForm() {
  const { mutate: login, isPending, error } = useLogin();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow space-y-4"
    >
      <h1 className="text-2xl font-bold text-center">Login</h1>

      {error && (
        <p className="text-sm text-red-500 text-center">{error.message}</p>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {isPending ? "Logging in..." : "Login"}
      </button>

      <p className="text-sm text-center text-gray-500">
        New business?{" "}
        <a href="/register" className="text-black font-medium underline">
          Register your company
        </a>
      </p>
    </form>
  );
}
