"use client";
import { useLogout } from "@/modules/auth/hooks/useAuth";
import type { Role } from "@/types";

const roleLabel: Record<Role, string> = {
  admin: "Admin",
  customer: "Customer",
  delivery_agent: "Delivery Agent",
  super_admin: "Super Admin",
};

export default function Navbar({ role }: { role: Role }) {
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          Role:{" "}
          <span className="font-medium text-gray-800">{roleLabel[role]}</span>
        </span>
        <button
          onClick={() => logout()}
          disabled={isPending}
          className="text-sm bg-gray-900 text-white px-4 py-1.5 rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          {isPending ? "Logging out..." : "Logout"}
        </button>
      </div>
    </header>
  );
}
