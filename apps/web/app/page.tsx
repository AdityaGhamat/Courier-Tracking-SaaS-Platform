import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Link from "next/link";

export default async function RootPage() {
  const session = await getSession();

  if (session) {
    if (session.role === "super_admin") redirect("/admin/analytics");
    redirect("/dashboard");
  }

  // Not logged in — minimal public landing
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-3">CourierSaaS</h1>
      <p className="text-gray-500 max-w-md mb-8 text-sm leading-relaxed">
        A multi-tenant courier tracking platform. Manage shipments, agents, hubs
        and vehicles — all in one place.
      </p>
      <div className="flex gap-3">
        <Link
          href="/login"
          className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          Sign In
        </Link>
        <Link
          href="/tracking"
          className="border px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          Track Shipment
        </Link>
      </div>
    </div>
  );
}
