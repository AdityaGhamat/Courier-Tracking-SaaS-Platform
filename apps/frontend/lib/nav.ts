import {
  LayoutDashboard,
  PackageSearch,
  Warehouse,
  Truck,
  Users,
  MapPin,
  BarChart3,
  Settings,
  CreditCard,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: string[];
};

export const NAV_ITEMS: NavItem[] = [
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
