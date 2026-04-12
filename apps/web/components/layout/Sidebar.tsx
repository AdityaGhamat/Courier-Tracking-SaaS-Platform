"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/types";

type NavItem = {
  label: string;
  href: string;
};

const navByRole: Record<Role, NavItem[]> = {
  admin: [
    { label: "Shipments", href: "/dashboard/shipments" },
    { label: "Hubs", href: "/dashboard/hubs" },
    { label: "Vehicles", href: "/dashboard/vehicles" },
    { label: "Analytics", href: "/dashboard/analytics" },
    { label: "Payments", href: "/dashboard/payments" },
    { label: "Subscriptions", href: "/dashboard/subscriptions" },
  ],
  customer: [
    { label: "My Shipments", href: "/dashboard/shipments" },
    { label: "Track Shipment", href: "/tracking" },
    { label: "Payments", href: "/dashboard/payments" },
  ],
  delivery_agent: [
    { label: "Assigned Shipments", href: "/dashboard/shipments" },
    { label: "My Vehicle", href: "/dashboard/vehicles" },
    { label: "Analytics", href: "/dashboard/analytics" },
  ],
  super_admin: [
    { label: "Platform Analytics", href: "/admin/analytics" },
    { label: "Subscriptions", href: "/admin/subscriptions" },
    { label: "Workspaces", href: "/admin/workspaces" },
  ],
};

export default function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = navByRole[role] ?? [];

  return (
    <aside className="w-60 min-h-screen bg-gray-900 text-white flex flex-col py-6 px-4">
      <div className="text-lg font-bold mb-8 px-2">📦 CourierTrack</div>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.href
                ? "bg-white text-gray-900"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
