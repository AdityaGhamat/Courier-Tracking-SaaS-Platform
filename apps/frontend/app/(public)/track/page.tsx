import Link from "next/link";
import { TrackingSearchForm } from "@/components/tracking/tracking-search-form";

export const metadata = {
  title: "Track Your Shipment",
  description: "Enter your tracking number to get live status updates.",
};

export default function PublicTrackPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Minimal nav */}
      <header
        style={{
          padding: "var(--space-4) var(--space-6)",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            fontWeight: 700,
            fontSize: "var(--text-base)",
            color: "var(--color-text)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-label="CourierTrack logo"
          >
            <rect width="28" height="28" rx="6" fill="var(--color-primary)" />
            <path
              d="M7 14h14M14 7l7 7-7 7"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          CourierTrack
        </Link>
        <Link
          href="/login"
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-primary)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Sign in →
        </Link>
      </header>

      {/* Hero */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--space-12) var(--space-6)",
        }}
      >
        <div style={{ width: "100%", maxWidth: "560px" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>
              📦
            </div>
            <h1
              style={{
                fontSize: "var(--text-2xl)",
                fontWeight: 800,
                color: "var(--color-text)",
                lineHeight: 1.1,
                marginBottom: "var(--space-3)",
              }}
            >
              Track your shipment
            </h1>
            <p
              style={{
                fontSize: "var(--text-base)",
                color: "var(--color-text-muted)",
              }}
            >
              Enter your tracking number for live status updates.
            </p>
          </div>

          {/* The interactive search + result — must be client component */}
          <TrackingSearchForm />
        </div>
      </main>

      <footer
        style={{
          padding: "var(--space-4) var(--space-6)",
          borderTop: "1px solid var(--color-border)",
          textAlign: "center",
          fontSize: "var(--text-xs)",
          color: "var(--color-text-faint)",
        }}
      >
        © {new Date().getFullYear()} CourierTrack
      </footer>
    </div>
  );
}
