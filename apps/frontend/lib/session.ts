import { jwtVerify } from "jose";
import type { User } from "@/types";

export async function getUserFromCookie(
  sessionToken: string,
): Promise<User | null> {
  try {
    const secret = new TextEncoder().encode(process.env.COOKIE_SECRET_KEY!);

    const { payload } = await jwtVerify(sessionToken, secret, {
      algorithms: ["HS256"],
    });

    if (!payload.id || !payload.role) return null;

    return {
      id: payload.id as string,
      role: payload.role as User["role"],
      workspaceId: payload.workspaceId as string | null | undefined,
      // name & email resolved separately via serverFetch if needed
      name: "",
      email: "",
    };
  } catch (err) {
    console.error("[session] JWT verify failed:", err);
    return null;
  }
}
