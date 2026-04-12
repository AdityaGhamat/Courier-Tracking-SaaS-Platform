import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3005";

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
      cookie: cookieHeader,
      ...options.headers,
    },
    // Never cache auth'd data by default
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }

  return res.json();
}
