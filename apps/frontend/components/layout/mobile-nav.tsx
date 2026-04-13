"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { NAV_ITEMS } from "@/lib/nav";

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const visibleItems = user
    ? NAV_ITEMS.filter((item) => item.roles.includes(user.role))
    : [];

  return (
    <>
      {/* Mobile topbar */}
      <header
        className="lg:hidden flex items-center justify-between px-4 h-14 sticky top-0 z-40"
        style={{ background: "linear-gradient(90deg,#1e1b4b,#312e81)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}
          >
            <span className="text-white font-bold text-xs">LE</span>
          </div>
          <span
            className="text-white font-bold text-base"
            style={{ fontFamily: "var(--font-display)" }}
          >
            LogisticsEngine
          </span>
        </div>

        <button
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          className="flex items-center justify-center w-10 h-10 rounded-md text-white bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-[60] w-72 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "linear-gradient(180deg,#1e1b4b 0%,#312e81 100%)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 min-h-[64px] border-b border-white/10">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}
            >
              <span className="text-white font-bold text-xs">LE</span>
            </div>
            <span
              className="text-white font-bold text-base"
              style={{ fontFamily: "var(--font-display)" }}
            >
              LogisticsEngine
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="flex items-center justify-center w-9 h-9 rounded-md text-white/70 bg-white/10 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/15 text-white font-semibold"
                    : "text-white/60 hover:bg-white/8 hover:text-white"
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-indigo-300" : "text-inherit"}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User badge */}
        <div className="p-4 border-t border-white/10">
          {user && (
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                }}
              >
                {user.name?.[0]?.toUpperCase() ?? user.role[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {user.name}
                </p>
                <p className="text-xs text-white/50 capitalize truncate">
                  {user.role.replace("_", " ")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
