"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import type { User } from "@/types";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = (await authApi.getMe()) as {
          data: { user: User } | User;
          message?: string;
        };
        if (!cancelled) {
          // Handle both { data: { user } } and { data: User } response shapes
          const u = (res.data as { user?: User }).user ?? (res.data as User);
          setUser(u);
        }
      } catch {
        // No valid session — user stays null, middleware handles redirect
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Called by login page after authApi.login() — no extra fetch needed
  const login = useCallback((u: User) => {
    setUser(u);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // swallow
    } finally {
      setUser(null);
      router.push("/login");
      router.refresh();
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
