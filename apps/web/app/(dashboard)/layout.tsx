import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import DashboardShell from "@/components/layout/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) redirect("/login");

  if (session.role === "super_admin") redirect("/admin");

  return <DashboardShell role={session.role}>{children}</DashboardShell>;
}
