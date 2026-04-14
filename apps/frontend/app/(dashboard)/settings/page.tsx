"use client";

import { useAuth } from "@/context/auth-context";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  User,
  Shield,
  LogOut,
  Mail,
  Building2,
  KeyRound,
  Bell,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Role badge color map (Aligned with light theme globals) ──
const ROLE_STYLES: Record<string, string> = {
  super_admin: "bg-indigo-100 text-indigo-700 border-indigo-200",
  admin: "bg-indigo-50 text-indigo-600 border-indigo-200",
  delivery_agent: "bg-cyan-50 text-cyan-600 border-cyan-200",
  customer: "bg-slate-100 text-slate-600 border-slate-200",
};

function RoleBadge({ role }: { role: string }) {
  const cls = ROLE_STYLES[role] ?? ROLE_STYLES.customer;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
        cls,
      )}
    >
      {role.replace("_", " ")}
    </span>
  );
}

// ── Section wrapper ──────────────────────────────────────────────
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
        {title}
      </h2>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_16px_rgba(30,27,75,0.04)] transition-shadow hover:shadow-[0_4px_20px_rgba(30,27,75,0.08)]">
        {children}
      </div>
    </div>
  );
}

// ── Info row ─────────────────────────────────────────────────────
function InfoRow({
  icon: Icon,
  label,
  value,
  last = false,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-5 py-3.5",
        !last && "border-b border-slate-100",
      )}
    >
      <div className="flex items-center gap-3 text-slate-500">
        <Icon size={16} className="shrink-0" />
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <div className="text-sm text-slate-900 font-semibold text-right">
        {value}
      </div>
    </div>
  );
}

// ── Menu row (for future actions) ────────────────────────────────
function MenuRow({
  icon: Icon,
  label,
  description,
  last = false,
  onClick,
  disabled = false,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  last?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex w-full items-center justify-between px-5 py-3.5 text-left transition-all",
        !last && "border-b border-slate-100",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:bg-slate-50 active:bg-slate-100",
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600">
          <Icon size={14} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
            {label}
          </p>
          {description && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <ChevronRight
        size={16}
        className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500"
      />
    </button>
  );
}

// ── Main page ────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const initials =
    user?.name
      ?.split(" ")
      .map((w: string) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ??
    user?.role?.[0]?.toUpperCase() ??
    "U";

  async function handleLogout() {
    setLoading(true);
    try {
      await authApi.logout();
    } finally {
      router.push("/login");
    }
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-8 mx-auto py-4">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-extrabold tracking-tight text-slate-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account preferences and workspace settings.
        </p>
      </div>

      {/* Profile hero card */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.06)]">
        {/* Subtle background decoration */}
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-indigo-50 blur-2xl pointer-events-none" />

        <div className="relative flex items-center gap-5">
          {/* Avatar */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-black text-indigo-600 ring-4 ring-white shadow-sm">
            {initials}
          </div>

          {/* Name + email */}
          <div className="flex-1 min-w-0">
            <h2
              className="truncate text-xl font-bold text-slate-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {user?.name || "Unknown User"}
            </h2>
            <p className="truncate text-sm font-medium text-slate-500 mt-0.5">
              {user?.email || "No email provided"}
            </p>
          </div>

          {/* Role badge */}
          <div className="hidden sm:block shrink-0">
            {user?.role && <RoleBadge role={user.role} />}
          </div>
        </div>
      </div>

      {/* Account info */}
      <Section title="Profile Details">
        <InfoRow icon={User} label="Full Name" value={user?.name || "—"} />
        <InfoRow icon={Mail} label="Email Address" value={user?.email || "—"} />
        <InfoRow
          icon={Shield}
          label="Account Privileges"
          value={user?.role ? <RoleBadge role={user.role} /> : "—"}
          last
        />
      </Section>

      {/* Workspace */}
      <Section title="Workspace">
        <InfoRow
          icon={Building2}
          label="Current Workspace"
          value={
            <span className="font-semibold text-slate-900">
              LogisticsEngine
            </span>
          }
        />
        <InfoRow
          icon={Sparkles}
          label="Subscription Plan"
          value={
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-600 border border-indigo-100">
              Pro Tier
            </span>
          }
          last
        />
      </Section>

      {/* Preferences */}
      <Section title="Preferences">
        <MenuRow
          icon={Bell}
          label="Notifications"
          description="Manage email alerts and push notifications"
        />
        <MenuRow
          icon={KeyRound}
          label="Security & Password"
          description="Update your login credentials and 2FA"
          last
        />
      </Section>

      {/* Danger zone */}
      <div className="pt-4">
        <button
          onClick={handleLogout}
          disabled={loading}
          className={cn(
            "group flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-bold text-red-600 transition-all",
            loading
              ? "cursor-wait opacity-60"
              : "hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-md active:scale-[0.98]",
          )}
        >
          <LogOut
            size={16}
            className={cn(
              "transition-transform",
              !loading && "group-hover:-translate-x-1",
            )}
          />
          {loading ? "Signing out securely…" : "Sign Out of Account"}
        </button>
      </div>
    </div>
  );
}
