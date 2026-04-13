"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      // AuthContext.login() handles redirect to /dashboard
    } catch (err: unknown) {
      setError((err as { message?: string })?.message ?? "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-bg, #f7f6f2)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "var(--color-surface, #fff)",
          padding: "2rem",
          borderRadius: "var(--radius-lg, 0.75rem)",
          boxShadow: "var(--shadow-md)",
          minWidth: 340,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
          Sign in
        </h1>

        {error && (
          <p style={{ color: "var(--color-error, #a12c7b)", margin: 0 }}>
            {error}
          </p>
        )}

        <label
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <span>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "0.5rem 0.75rem",
              border: "1px solid var(--color-border, #d4d1ca)",
              borderRadius: "var(--radius-md, 0.5rem)",
              fontSize: "1rem",
            }}
          />
        </label>

        <label
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <span>Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "0.5rem 0.75rem",
              border: "1px solid var(--color-border, #d4d1ca)",
              borderRadius: "var(--radius-md, 0.5rem)",
              fontSize: "1rem",
            }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.625rem 1rem",
            backgroundColor: "var(--color-primary, #01696f)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius-md, 0.5rem)",
            fontSize: "1rem",
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
