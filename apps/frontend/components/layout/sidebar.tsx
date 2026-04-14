"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { NAV_ITEMS } from "@/lib/nav";

export function Sidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = user
    ? NAV_ITEMS.filter((item) => item.roles.includes(user.role))
    : [];

  return (
    <aside
      /* CHANGED: h-screen to h-full */
      className="hidden lg:flex flex-col h-full shrink-0 transition-all duration-300 relative z-20 shadow-xl"
      style={{
        width: collapsed ? "72px" : "240px",
        background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 shrink-0"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          minHeight: "64px",
        }}
      >
        <div className="shrink-0">
          <svg
            width="32"
            height="32"
            viewBox="0 0 36 36"
            fill="none"
            aria-label="LogisticsEngine"
          >
            <rect width="36" height="36" rx="8" fill="url(#sg)" />
            <defs>
              <linearGradient
                id="sg"
                x1="0"
                y1="0"
                x2="36"
                y2="36"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
            <path
              d="M10 22 L18 10 L26 22"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M8 26 L28 26"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="18" cy="22" r="2.5" fill="white" />
          </svg>
        </div>
        {!collapsed && (
          <span
            className="text-white font-bold truncate text-base"
            style={{ fontFamily: "var(--font-display)" }}
          >
            LogisticsEngine
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-2">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 rounded-lg mb-1"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />
            ))
          : visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    isActive ? "nav-active" : "hover:bg-white/5"
                  }`}
                  style={isActive ? {} : { color: "rgba(255,255,255,0.55)" }}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    size={18}
                    className="shrink-0 transition-colors"
                    style={{ color: isActive ? "#a5b4fc" : "inherit" }}
                  />
                  {!collapsed && (
                    <span
                      className="truncate text-sm"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "white" : "inherit",
                      }}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
      </nav>

      {/* User badge */}
      {!collapsed && (
        <div
          className="p-4 shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          {user ? (
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                }}
              >
                {user.name?.[0]?.toUpperCase() ?? user.role[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white font-medium truncate text-xs">
                  {user.name}
                </p>
                <p
                  className="truncate capitalize text-[11px]"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {user.role.replace("_", " ")}
                </p>
              </div>
            </div>
          ) : (
            <div
              className="h-9 rounded-lg"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
          )}
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-colors bg-white border border-slate-200 text-slate-500 hover:text-slate-900"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
