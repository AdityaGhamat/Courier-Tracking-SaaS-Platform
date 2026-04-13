import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export interface SessionUser {
  id: string;
  role: "admin" | "customer" | "delivery_agent" | "super_admin";
  workspaceId: string;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_key")?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(
      process.env.COOKIE_SECRET_KEY ?? "fallback-dev-secret",
    );
    const { payload } = await jwtVerify(token, secret);

    return {
      id: payload.id as string,
      role: payload.role as SessionUser["role"],
      workspaceId: payload.workspaceId as string,
    };
  } catch {
    return null;
  }
}
