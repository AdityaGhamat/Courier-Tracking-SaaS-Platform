"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PackageSearch,
  Warehouse,
  Truck,
  Users,
  MapPin,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "customer", "delivery_agent", "super_admin"],
  },
  {
    label: "Shipments",
    href: "/shipments",
    icon: PackageSearch,
    roles: ["admin", "customer", "delivery_agent"],
  },
  {
    label: "Tracking",
    href: "/tracking",
    icon: MapPin,
    roles: ["admin", "customer", "delivery_agent"],
  },
  { label: "Hubs", href: "/hubs", icon: Warehouse, roles: ["admin"] },
  { label: "Vehicles", href: "/vehicles", icon: Truck, roles: ["admin"] },
  { label: "Agents", href: "/agents", icon: Users, roles: ["admin"] },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: ["admin", "super_admin"],
  },
  {
    label: "Payments",
    href: "/payments",
    icon: CreditCard,
    roles: ["admin", "super_admin"],
  },
  {
    label: "Super Admin",
    href: "/super-admin",
    icon: ShieldCheck,
    roles: ["super_admin"],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin", "customer", "delivery_agent", "super_admin"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // While user is loading, render the shell without nav items
  const visibleItems = user
    ? NAV_ITEMS.filter((item) => item.roles.includes(user.role))
    : [];

  return (
    <aside
      className="hidden lg:flex flex-col h-screen shrink-0 transition-all duration-300 relative"
      style={{
        width: collapsed ? "72px" : "240px",
        backgroundColor: "var(--color-primary)",
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
            <rect width="36" height="36" rx="8" fill="#fd761a" />
            <path
              d="M8 18 L18 8 L28 18 L28 28 L8 28 Z"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="18" cy="20" r="4" fill="white" />
          </svg>
        </div>
        {!collapsed && (
          <span
            className="text-white font-bold truncate"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-title-md)",
            }}
          >
            LogisticsEngine
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
        {loading
          ? // Skeleton while user loads
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: "40px",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  marginBottom: "4px",
                }}
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
                    isActive ? "nav-active" : ""
                  }`}
                  style={isActive ? {} : { color: "rgba(255,255,255,0.55)" }}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    size={18}
                    className="shrink-0 transition-colors"
                    style={{ color: isActive ? "#fd761a" : "inherit" }}
                  />
                  {!collapsed && (
                    <span
                      className="truncate"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-body-md)",
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
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold"
                style={{
                  backgroundColor: "var(--color-secondary-container)",
                  fontSize: "var(--text-label-lg)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {user.name?.[0]?.toUpperCase() ?? user.role[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p
                  className="text-white font-medium truncate"
                  style={{ fontSize: "var(--text-body-sm)" }}
                >
                  {user.name}
                </p>
                <p
                  className="truncate capitalize"
                  style={{
                    fontSize: "var(--text-label-sm)",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {user.role.replace("_", " ")}
                </p>
              </div>
            </div>
          ) : (
            // Skeleton user badge
            <div
              style={{
                height: "36px",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            />
          )}
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-colors"
        style={{
          backgroundColor: "var(--color-surface-lowest)",
          border: "1px solid var(--color-outline-variant)",
          color: "var(--color-on-surface-variant)",
        }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
