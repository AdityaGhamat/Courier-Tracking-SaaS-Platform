import { notFound } from "next/navigation";
import {
  Building2,
  Sparkles,
  Users,
  ShieldCheck,
  Package,
  CheckCircle2,
  XCircle,
  CalendarClock,
} from "lucide-react";
import { serverFetch } from "@/lib/server-api";
import { getSessionUser } from "@/lib/session";
import { DeleteTenantButton } from "@/components/super-admin/delete-tenant-button";
import { CreatePlanDialog } from "@/components/super-admin/create-plan-dialog";
import { EditPlanDialog } from "@/components/super-admin/edit-plan-dialog";
import { AssignPlanDialog } from "@/components/super-admin/assign-plan-dialog";
import type { Tenant, SubscriptionPlan } from "@/types/super-admin.types";
import { cn } from "@/lib/utils";

// ── KPI card (Updated to match our new StatCard Glassmorphism) ──
function KpiCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-card p-6 shadow-lg transition-all duration-300 hover:border-primary/30 hover:shadow-primary/5">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/25" />

      <div className="relative z-10 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </h3>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>

      <div className="relative z-10 mt-4">
        <p className="text-3xl font-bold tracking-tight text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

// ── Section header ───────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
  action,
}: {
  icon: React.ElementType;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon size={15} className="text-primary" />
        </div>
        <h2 className="text-base font-bold text-foreground">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export default async function SuperAdminPage() {
  const user = await getSessionUser();
  if (user?.role !== "super_admin") notFound();

  const [tenantsRes, plansRes] = await Promise.allSettled([
    serverFetch<{ data: Tenant[] }>("super-admin/tenants"),
    serverFetch<{ data: SubscriptionPlan[] }>("super-admin/plans"),
  ]);

  const tenants =
    tenantsRes.status === "fulfilled" ? (tenantsRes.value.data ?? []) : [];
  const plans =
    plansRes.status === "fulfilled" ? (plansRes.value.data ?? []) : [];

  const activePlans = plans.filter((p) => p.isActive).length;
  const inactivePlans = plans.length - activePlans;

  return (
    <div className="flex flex-col gap-8 w-full pb-10">
      {/* ── Page header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck size={18} className="text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Super Admin</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-11">
            Platform-level tenant and subscription management
          </p>
        </div>
        <AssignPlanDialog tenants={tenants} plans={plans} />
      </div>

      {/* ── KPI strip ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard
          label="Total Tenants"
          value={tenants.length}
          icon={Building2}
        />
        <KpiCard label="Total Plans" value={plans.length} icon={Sparkles} />
        <KpiCard label="Active Plans" value={activePlans} icon={CheckCircle2} />
        <KpiCard label="Inactive Plans" value={inactivePlans} icon={XCircle} />
      </div>

      {/* ── Tenants table ─────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <SectionHeader icon={Building2} title={`Tenants (${tenants.length})`} />

        {tenants.length === 0 ? (
          <div className="py-14 flex flex-col items-center gap-3 rounded-xl border border-dashed border-white/10 bg-card/50 text-center">
            <Building2 size={32} className="text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No tenants yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/5 bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/5 bg-muted/30">
                  <tr>
                    {[
                      "Workspace",
                      "Owner",
                      "Owner Email",
                      "Created",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tenants.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-foreground">
                            {t.name}
                          </p>
                          <p className="text-xs font-mono text-muted-foreground mt-0.5">
                            {t.id.slice(0, 8)}…
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium text-foreground">
                        {t.owner?.name ?? (
                          <span className="text-muted-foreground italic text-xs">
                            Unknown
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {t.owner?.email ?? "—"}
                      </td>
                      <td
                        className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap"
                        suppressHydrationWarning
                      >
                        {t.createdAt
                          ? new Date(t.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              timeZone: "Asia/Kolkata",
                            })
                          : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <AssignPlanDialog
                            tenants={tenants}
                            plans={plans}
                            defaultTenantId={t.id}
                          />
                          <DeleteTenantButton
                            tenantId={t.id}
                            tenantName={t.name}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Plans section ─────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <SectionHeader
          icon={Sparkles}
          title={`Subscription Plans (${plans.length})`}
          action={<CreatePlanDialog />}
        />

        {plans.length === 0 ? (
          <div className="py-14 flex flex-col items-center gap-3 rounded-xl border border-dashed border-white/10 bg-card/50 text-center">
            <Sparkles size={32} className="text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              No plans created yet.
            </p>
            <CreatePlanDialog />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="group relative flex flex-col gap-4 rounded-xl border border-white/5 bg-card p-6 shadow-lg transition-all duration-300 hover:border-primary/30"
              >
                {/* Plan header */}
                <div className="flex items-start justify-between gap-2 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-foreground text-base">
                        {plan.name}
                      </p>
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          plan.isActive
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {plan.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {plan.description && (
                      <p className="text-xs text-muted-foreground">
                        {plan.description}
                      </p>
                    )}
                  </div>
                  <EditPlanDialog plan={plan} />
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 relative z-10">
                  <span className="text-3xl font-extrabold text-foreground tabular-nums tracking-tight">
                    ₹{Number(plan.price).toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    /month
                  </span>
                </div>

                {/* Limits */}
                <div className="grid grid-cols-2 gap-3 relative z-10 mt-2">
                  <div className="flex flex-col items-start gap-2 bg-muted/30 rounded-lg px-4 py-3 border border-white/5">
                    <Package size={14} className="text-primary" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">
                        Shipments
                      </p>
                      <p className="text-sm font-bold text-foreground tabular-nums">
                        {plan.maxShipments.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 bg-muted/30 rounded-lg px-4 py-3 border border-white/5">
                    <Users size={14} className="text-primary" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">
                        Agents
                      </p>
                      <p className="text-sm font-bold text-foreground tabular-nums">
                        {plan.maxAgents}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-1.5 pt-4 mt-2 border-t border-white/5 relative z-10">
                  <CalendarClock size={12} className="text-muted-foreground" />
                  <p
                    className="text-[11px] font-medium text-muted-foreground"
                    suppressHydrationWarning
                  >
                    Created{" "}
                    {new Date(plan.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      timeZone: "Asia/Kolkata",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
