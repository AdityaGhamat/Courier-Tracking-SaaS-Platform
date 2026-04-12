import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import type { Role } from "@/types";

type SessionPayload = {
  id: string;
  role: Role;
  workspaceId?: string;
};

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_key")?.value;
  if (!token) return null;

  try {
    return jwtDecode<SessionPayload>(token);
  } catch {
    return null;
  }
}
