// src/components/layout/topbar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, LogOut, Menu } from "lucide-react";
import { useAuth } from "../../context/auth-context";
import { authApi } from "../../lib/api";
import type { User } from "../../types";

export function Topbar({ user }: { user: User }) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      router.push("/login");
    }
  }

  return (
    <header
      className="flex items-center gap-4 px-6 lg:px-8 h-16 shrink-0"
      style={{
        backgroundColor: "var(--color-surface-lowest)",
        borderBottom: "1px solid var(--color-outline-variant)",
      }}
    >
      {/* Mobile menu placeholder (wired in mobile-nav) */}
      <button
        className="lg:hidden p-2 rounded-lg"
        style={{ color: "var(--color-on-surface-variant)" }}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ backgroundColor: "var(--color-surface-low)" }}
        >
          <Search
            size={16}
            style={{ color: "var(--color-on-surface-variant)" }}
          />
          <input
            type="text"
            placeholder="Search shipments, hubs, agents..."
            className="flex-1 bg-transparent outline-none"
            style={{
              fontSize: "var(--text-body-md)",
              color: "var(--color-on-surface)",
            }}
          />
          {/* Keyboard shortcut hint */}
          <kbd
            className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded"
            style={{
              fontSize: "var(--text-label-sm)",
              color: "var(--color-on-surface-variant)",
              backgroundColor: "var(--color-surface-dim)",
              border: "1px solid var(--color-outline-variant)",
              fontFamily: "monospace",
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg transition-colors"
          style={{ color: "var(--color-on-surface-variant)" }}
          aria-label="Notifications"
        >
          <Bell size={20} />
          {/* Unread dot */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: "var(--color-secondary-container)" }}
          />
        </button>

        {/* Divider */}
        <div
          className="w-px h-6 mx-1"
          style={{ backgroundColor: "var(--color-outline-variant)" }}
        />

        {/* Avatar + logout */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shrink-0"
            style={{
              backgroundColor: "var(--color-primary)",
              fontSize: "var(--text-label-lg)",
              fontFamily: "var(--font-display)",
            }}
          >
            {user.name?.[0]?.toUpperCase() ?? user.role[0].toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p
              className="font-medium leading-tight"
              style={{
                fontSize: "var(--text-body-sm)",
                color: "var(--color-on-surface)",
              }}
            >
              {user.name}
            </p>
            <p
              className="leading-tight capitalize"
              style={{
                fontSize: "var(--text-label-sm)",
                color: "var(--color-on-surface-variant)",
              }}
            >
              {user.role.replace("_", " ")}
            </p>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="p-2 rounded-lg transition-colors disabled:opacity-50"
            style={{ color: "var(--color-on-surface-variant)" }}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
