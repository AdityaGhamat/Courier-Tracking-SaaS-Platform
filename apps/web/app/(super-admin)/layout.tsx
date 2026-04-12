import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Link from "next/link";

const superAdminNav = [
  { label: "Platform Analytics", href: "/admin/analytics" },
  { label: "Tenants", href: "/admin/tenants" },
  { label: "Plans", href: "/admin/plans" },
  { label: "Subscriptions", href: "/admin/subscriptions" },
];

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role !== "super_admin") redirect("/login");

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 min-h-screen bg-gray-900 text-white flex flex-col py-6 px-4">
        <div className="text-lg font-bold mb-8 px-2">⚡ Super Admin</div>
        <nav className="flex flex-col gap-1">
          {superAdminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex flex-col flex-1 bg-gray-50">
        <header className="h-14 border-b bg-white flex items-center px-6">
          <span className="text-sm text-gray-500">Super Admin Panel</span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
