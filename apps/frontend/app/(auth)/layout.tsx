import { AuthProvider } from "@/context/auth-context";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — branding panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-12"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            aria-label="LogisticsEngine logo"
          >
            <rect width="36" height="36" rx="8" fill="#fd761a" />
            <path
              d="M8 18 L18 8 L28 18 L28 28 L8 28 Z"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="18" cy="20" r="4" fill="white" />
          </svg>
          <span
            className="text-white font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-title-lg)",
            }}
          >
            LogisticsEngine
          </span>
        </div>

        {/* Center content */}
        <div className="space-y-6">
          <p
            className="text-white/40 uppercase tracking-widest"
            style={{ fontSize: "var(--text-label-md)" }}
          >
            Engineered for Velocity
          </p>
          <h1
            className="text-white leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-display-md)",
              letterSpacing: "-0.02em",
            }}
          >
            Empower Your
            <br />
            <span style={{ color: "var(--color-secondary-container)" }}>
              Logistics.
            </span>
          </h1>
          <p
            className="text-white/60 max-w-sm"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-body-lg)",
              lineHeight: "1.7",
            }}
          >
            Scalable multi-tenant courier tracking — manage shipments, hubs,
            agents, and analytics from a single control plane.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: "99.9%", label: "Uptime SLA" },
            { value: "45ms", label: "API Latency" },
            { value: "10k+", label: "Shipments/day" },
          ].map((s) => (
            <div key={s.label}>
              <p
                className="text-white font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-headline-sm)",
                  color: "var(--color-secondary-container)",
                }}
              >
                {s.value}
              </p>
              <p
                className="text-white/50 uppercase tracking-wider mt-1"
                style={{ fontSize: "var(--text-label-sm)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form area */}
      <div
        className="flex items-center justify-center p-6 lg:p-12"
        style={{ backgroundColor: "var(--color-surface-lowest)" }}
      >
        <div className="w-full max-w-md">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </div>
    </div>
  );
}
