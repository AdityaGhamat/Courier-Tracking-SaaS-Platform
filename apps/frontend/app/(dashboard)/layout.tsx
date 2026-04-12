import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { AuthProvider } from "@/context/auth-context";
import { getUserFromCookie } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_key")?.value;

  if (!sessionToken) redirect("/login");

  const user = await getUserFromCookie(sessionToken);
  if (!user) redirect("/login");

  return (
    // Hydrate client auth context with server-decoded user
    <AuthProvider initialUser={user}>
      <div
        className="flex h-screen overflow-hidden"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <Sidebar user={user} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Topbar user={user} />
          <main
            className="flex-1 overflow-y-auto p-6 lg:p-8"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
