"use client";
import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import type { Role } from "@/types";

type SessionPayload = {
  id: string;
  role: Role;
  workspaceId?: string;
};

export function useSession(): SessionPayload {
  return useMemo(() => {
    if (typeof document === "undefined") return { id: "", role: "customer" };
    const cookies = document.cookie.split("; ");
    const sessionCookie = cookies.find((c) => c.startsWith("session_key="));
    if (!sessionCookie) return { id: "", role: "customer" };
    const token = sessionCookie.split("=")[1];
    try {
      return jwtDecode<SessionPayload>(token ?? "");
    } catch {
      return { id: "", role: "customer" };
    }
  }, []);
}
