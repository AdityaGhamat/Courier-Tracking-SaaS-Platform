import { redirect } from "next/navigation";
import { serverAuth } from "@/lib/server-api";
import { AuthProvider } from "@/context/auth-context";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // SSR: fetch the current user. If session_key is invalid/missing,
  // this throws → we catch and redirect to /login
  let user = null;
  try {
    user = await serverAuth.getMe();
  } catch (err: unknown) {
    const statusCode = (err as { statusCode?: number })?.statusCode;
    // 401 = unauthenticated, 403 = forbidden — send to login
    if (!statusCode || statusCode === 401 || statusCode === 403) {
      redirect("/login");
    }
    // For 5xx or network errors, still redirect so users aren't stuck
    redirect("/login");
  }

  return (
    <AuthProvider initialUser={user}>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Your Sidebar goes here — it will receive user via useAuth() */}
        {children}
      </div>
    </AuthProvider>
  );
}
