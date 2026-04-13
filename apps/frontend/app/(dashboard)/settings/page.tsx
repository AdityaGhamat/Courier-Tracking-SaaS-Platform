"use client";

import { useAuth } from "@/context/auth-context";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, User, Shield } from "lucide-react";

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
    <div className="space-y-6 max-w-lg">
      <div>
        <h1
          className="font-bold"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-headline-sm)",
            color: "var(--color-on-surface)",
          }}
        >
          Settings
        </h1>
        <p
          style={{
            fontSize: "var(--text-body-md)",
            color: "var(--color-on-surface-variant)",
            marginTop: "0.25rem",
          }}
        >
          Account and workspace settings
        </p>
      </div>

      {/* Profile card */}
      <div
        className="rounded-xl p-5 space-y-4"
        style={{
          backgroundColor: "var(--color-surface-lowest)",
          border: "1px solid var(--color-outline-variant)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shrink-0"
            style={{
              backgroundColor: "var(--color-secondary-container)",
              fontSize: "var(--text-title-md)",
              fontFamily: "var(--font-display)",
            }}
          >
            {user?.name?.[0]?.toUpperCase() ??
              user?.role?.[0]?.toUpperCase() ??
              "U"}
          </div>
          <div>
            <p
              className="font-semibold"
              style={{
                fontSize: "var(--text-title-md)",
                color: "var(--color-on-surface)",
              }}
            >
              {user?.name || "—"}
            </p>
            <p
              style={{
                fontSize: "var(--text-body-sm)",
                color: "var(--color-on-surface-variant)",
              }}
            >
              {user?.email || "—"}
            </p>
          </div>
        </div>

        <div
          className="space-y-2 pt-2"
          style={{ borderTop: "1px solid var(--color-outline-variant)" }}
        >
          <div className="flex items-center justify-between py-2">
            <div
              className="flex items-center gap-2"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              <User size={15} />
              <span style={{ fontSize: "var(--text-body-sm)" }}>Role</span>
            </div>
            <span
              className="font-medium capitalize px-2.5 py-0.5 rounded-full"
              style={{
                fontSize: "var(--text-label-md)",
                backgroundColor: "var(--color-primary-container)",
                color: "var(--color-on-primary)",
              }}
            >
              {user?.role?.replace("_", " ") ?? "—"}
            </span>
          </div>
          {user?.workspaceId && (
            <div className="flex items-center justify-between py-2">
              <div
                className="flex items-center gap-2"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                <Shield size={15} />
                <span style={{ fontSize: "var(--text-body-sm)" }}>
                  Workspace ID
                </span>
              </div>
              <span
                className="font-mono"
                style={{
                  fontSize: "var(--text-label-md)",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                {user.workspaceId.slice(0, 8)}…
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={loading}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all disabled:opacity-60"
        style={{
          backgroundColor: "var(--color-error-container)",
          color: "var(--color-on-error-container)",
          fontSize: "var(--text-body-md)",
          fontWeight: 600,
          border: "none",
        }}
      >
        <LogOut size={16} />
        {loading ? "Signing out…" : "Sign Out"}
      </button>
    </div>
  );
}
