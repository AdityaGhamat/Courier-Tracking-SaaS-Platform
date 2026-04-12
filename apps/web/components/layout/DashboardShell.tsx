import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import type { Role } from "@/types";

export default function DashboardShell({
  children,
  role,
}: {
  children: React.ReactNode;
  role: Role;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} />
      <div className="flex flex-col flex-1">
        <Navbar role={role} />
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
