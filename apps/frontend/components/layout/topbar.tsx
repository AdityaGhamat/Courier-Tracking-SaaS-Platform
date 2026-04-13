"use client";

import { useState } from "react";
import { Search, Bell, LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export function Topbar() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
  }

  return (
    <header className="hidden lg:flex items-center gap-4 px-6 lg:px-8 h-16 shrink-0 z-10 bg-white border-b border-slate-200">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 transition-colors focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-400">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search shipments, hubs, agents..."
            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
          />
          <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-400 bg-slate-100 border border-slate-200">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
        </button>

        <div className="w-px h-6 mx-1 bg-slate-200" />

        {/* Avatar + logout */}
        <div className="flex items-center gap-3">
          {user && (
            <>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                }}
              >
                {user.name?.[0]?.toUpperCase() ?? user.role[0].toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-800 leading-tight">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 leading-tight capitalize">
                  {user.role.replace("_", " ")}
                </p>
              </div>
            </>
          )}

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors disabled:opacity-50 ml-1"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}
