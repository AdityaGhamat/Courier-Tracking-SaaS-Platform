import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3005";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  workspaceId?: string;
};

// Shape returned by SuccessResponse wrapper
type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

export async function serverFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const cookieStore = await cookies();
  const sessionKey = cookieStore.get("session_key")?.value;
  const refreshKey = cookieStore.get("refresh_key")?.value;

  const cookieHeader = [
    sessionKey ? `session_key=${sessionKey}` : "",
    refreshKey ? `refresh_key=${refreshKey}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  const res = await fetch(`${BACKEND_URL}/api/v1/${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
      ...options.headers,
    },
    next: { revalidate: 0 }, // never cache auth'd data
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({
      message: `Backend error ${res.status}`,
    }));
    throw Object.assign(
      new Error((err as { message?: string }).message ?? "Backend error"),
      { statusCode: res.status, body: err },
    );
  }

  return res.json() as Promise<T>;
}

// ✅ serverAuth.getMe() — used by DashboardLayout (SSR)
// Controller returns: { data: { user: {...} }, message: "Authenticated user" }
export const serverAuth = {
  getMe: async (): Promise<User> => {
    const res = await serverFetch<ApiResponse<{ user: User }>>("auth/me");
    return res.data.user; // ← unwrap the nested shape
  },
};
