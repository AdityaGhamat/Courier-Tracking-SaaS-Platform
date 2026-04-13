"use client";

import { useAuth } from "@/context/auth-context";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

const UserIcon = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ShieldIcon = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const LogOutIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await authApi.logout();
    } finally {
      router.push("/login");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
        maxWidth: "var(--content-narrow)",
      }}
    >
      {/* Header */}
      <div>
        <h1
          style={{
            fontSize: "var(--text-xl)",
            fontWeight: 700,
            color: "var(--color-text)",
          }}
        >
          Settings
        </h1>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            marginTop: "var(--space-1)",
          }}
        >
          Account and workspace settings
        </p>
      </div>

      {/* Profile card */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-5)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        {/* Avatar + name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-4)",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--radius-full)",
              background: "var(--color-primary-highlight)",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "var(--text-lg)",
              flexShrink: 0,
            }}
          >
            {user?.name?.[0]?.toUpperCase() ??
              user?.role?.[0]?.toUpperCase() ??
              "U"}
          </div>
          <div>
            <p
              style={{
                fontWeight: 600,
                fontSize: "var(--text-base)",
                color: "var(--color-text)",
              }}
            >
              {user?.name || "—"}
            </p>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-muted)",
              }}
            >
              {user?.email || "—"}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--color-divider)" }} />

        {/* Role row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "var(--space-2) 0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              color: "var(--color-text-muted)",
            }}
          >
            {UserIcon}
            <span style={{ fontSize: "var(--text-sm)" }}>Role</span>
          </div>
          <span
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              padding: "var(--space-1) var(--space-3)",
              borderRadius: "var(--radius-full)",
              background: "var(--color-primary-highlight)",
              color: "var(--color-primary)",
              textTransform: "capitalize",
            }}
          >
            {user?.role?.replace("_", " ") ?? "—"}
          </span>
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        disabled={loading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
          width: "100%",
          padding: "var(--space-3) var(--space-4)",
          borderRadius: "var(--radius-lg)",
          background: "var(--color-error-highlight)",
          color: "var(--color-error)",
          border: "1px solid oklch(from var(--color-error) l c h / 0.2)",
          fontSize: "var(--text-sm)",
          fontWeight: 600,
          cursor: loading ? "wait" : "pointer",
          opacity: loading ? 0.6 : 1,
          transition: "opacity var(--transition-interactive)",
        }}
      >
        {LogOutIcon}
        {loading ? "Signing out…" : "Sign Out"}
      </button>
    </div>
  );
}
