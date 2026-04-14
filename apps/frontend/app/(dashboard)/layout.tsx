import { AuthProvider } from "@/context/auth-context";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50">
        {/* Desktop sidebar — hidden on mobile */}
        <Sidebar />

        <div className="flex flex-1 flex-col min-w-0 overflow-y-auto relative">
          {/* Mobile top nav — hidden on desktop */}
          <MobileNav />

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
