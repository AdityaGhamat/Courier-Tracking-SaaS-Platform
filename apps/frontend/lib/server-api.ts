import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3005";

export async function serverFetch<T>(
  path: string,
  options: RequestInit = {},
  revalidate?: number,
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
    next: revalidate !== undefined ? { revalidate } : { revalidate: 0 },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({
      message: `Backend error ${res.status}`,
    }));
    // Throw a plain object so Server Components can pattern-match it
    throw Object.assign(
      new Error((err as { message?: string }).message ?? "Backend error"),
      {
        statusCode: res.status,
        body: err,
      },
    );
  }

  return res.json() as Promise<T>;
}

// Convenience helpers for Server Components
export const serverAuth = {
  getMe: () =>
    serverFetch<{ id: string; name: string; email: string; role: string }>(
      "auth/me",
    ),
};
