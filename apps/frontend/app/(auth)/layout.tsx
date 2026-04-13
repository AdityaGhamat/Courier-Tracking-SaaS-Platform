import { AuthProvider } from "@/context/auth-context";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthProvider initialUser={null}>{children}</AuthProvider>;
}
