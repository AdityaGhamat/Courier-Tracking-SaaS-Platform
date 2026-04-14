import { Suspense } from "react";
import { TrackingSearchForm } from "@/components/tracking/tracking-search-form";
import { Loader2 } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata = {
  title: "Track Shipment",
  description: "Track your shipment in real-time with your tracking number.",
};

function TrackingShell({ initialQuery }: { initialQuery: string }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-none">
              CourierTrack
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time shipment tracking
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 py-10">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {/* Hero */}
          <div className="text-center flex flex-col gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Track Your Shipment
            </h1>
            <p className="text-sm text-slate-500">
              Enter your tracking number to get real-time delivery updates.
            </p>
          </div>

          {/* Search form + results */}
          <TrackingSearchForm initialQuery={initialQuery} />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        Powered by CourierTrack · Real-time delivery intelligence
      </footer>
    </div>
  );
}

export default async function PublicTrackPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 size={32} className="animate-spin text-indigo-400" />
        </div>
      }
    >
      <TrackingShell initialQuery={q} />
    </Suspense>
  );
}
