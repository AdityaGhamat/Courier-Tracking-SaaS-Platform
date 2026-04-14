import { notFound } from "next/navigation";
import {
  Building2,
  Sparkles,
  Users,
  ShieldCheck,
  Package,
  CheckCircle2,
  XCircle,
  Zap,
  CalendarClock,
} from "lucide-react";
import { serverFetch } from "@/lib/server-api";
import { getSessionUser } from "@/lib/session";
import { DeleteTenantButton } from "@/components/super-admin/delete-tenant-button";
import { CreatePlanDialog } from "@/components/super-admin/create-plan-dialog";
import { EditPlanDialog } from "@/components/super-admin/edit-plan-dialog";
import { AssignPlanDialog } from "@/components/super-admin/assign-plan-dialog";
import type { Tenant, SubscriptionPlan } from "@/types/super-admin.types";

// ── KPI card ────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
        style={{ background: color }}
      >
        <Icon size={15} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="text-2xl font-extrabold tabular-nums text-foreground mt-0.5">
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
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
          <Icon size={15} className="text-indigo-600" />
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

  // ── Fetch all data in parallel ──────────────────────────────
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
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
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
          color="#4f46e5"
        />
        <KpiCard
          label="Total Plans"
          value={plans.length}
          icon={Sparkles}
          color="#7c3aed"
        />
        <KpiCard
          label="Active Plans"
          value={activePlans}
          icon={CheckCircle2}
          color="#059669"
        />
        <KpiCard
          label="Inactive Plans"
          value={inactivePlans}
          icon={XCircle}
          color="#dc2626"
        />
      </div>

      {/* ── Tenants table ─────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <SectionHeader icon={Building2} title={`Tenants (${tenants.length})`} />

        {tenants.length === 0 ? (
          <div className="py-14 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card text-center">
            <Building2 size={32} className="text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No tenants yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
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
                        className="text-left px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tenants.map((t) => (
                    <tr
                      key={t.id}
                      className="bg-card hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-foreground">
                            {t.name}
                          </p>
                          <p className="text-xs font-mono text-muted-foreground mt-0.5">
                            {t.id.slice(0, 8)}…
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {t.owner?.name ?? (
                          <span className="text-muted-foreground italic text-xs">
                            Unknown
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {t.owner?.email ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {t.createdAt
                          ? new Date(t.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
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
          <div className="py-14 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card text-center">
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
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                {/* Plan header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-foreground text-base">
                        {plan.name}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          plan.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
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
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-foreground tabular-nums">
                    ₹{Number(plan.price).toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-muted-foreground">/month</span>
                </div>

                {/* Limits */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2.5">
                    <Package size={13} className="text-indigo-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">
                        Shipments
                      </p>
                      <p className="text-sm font-bold text-foreground tabular-nums">
                        {plan.maxShipments.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2.5">
                    <Users size={13} className="text-purple-500 shrink-0" />
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
                <div className="flex items-center gap-1.5 pt-2 border-t border-border">
                  <CalendarClock size={11} className="text-muted-foreground" />
                  <p className="text-[11px] text-muted-foreground">
                    Created{" "}
                    {new Date(plan.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
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
