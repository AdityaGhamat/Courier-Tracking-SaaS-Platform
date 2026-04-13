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

type User = {
  id: string;
  name: string;
  email: string;
  role: "tenant" | "customer" | "agent" | string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: User | null;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const [loading, setLoading] = useState(!initialUser);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = (await authApi.getMe()) as { data?: User } & User;
      // Handle both { data: user } and flat user shapes
      setUser((data as { data?: User }).data ?? (data as User));
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch if not seeded from server
    if (!initialUser) {
      refresh();
    }
  }, [initialUser, refresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      // POST /api/proxy/auth/login → Express sets session_key cookie
      await authApi.login({ email, password });
      // Fetch the user immediately after login
      await refresh();
      router.push("/dashboard");
      router.refresh(); // Invalidate RSC cache so layout re-renders
    },
    [refresh, router],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if the backend call fails, clear client state
    } finally {
      setUser(null);
      router.push("/login");
      router.refresh();
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
