import { AuthProvider } from "@/context/auth-context";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "var(--color-surface)",
        }}
      >
        {/* Desktop sidebar — hidden on mobile */}
        <Sidebar />

        {/* Main content column */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {/* Mobile top nav — hidden on desktop */}
          <MobileNav />

          <main style={{ flex: 1, padding: "1.5rem" }}>{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
