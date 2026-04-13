import { serverFetch } from "@/lib/server-api";
import { AuthProvider } from "@/context/auth-context";
import { Sidebar } from "@/components/layout/sidebar";
import type { User } from "@/types";
import { redirect } from "next/navigation";

async function getMe(): Promise<User | null> {
  try {
    const res = await serverFetch<{ data: { user: User } }>("auth/me");
    return res.data?.user ?? null;
  } catch {
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();

  if (!user) redirect("/login");

  return (
    <AuthProvider initialUser={user}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar user={user} />
        <main
          className="flex-1 overflow-y-auto"
          style={{
            backgroundColor: "var(--color-bg)",
            padding: "var(--space-8)",
          }}
        >
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
