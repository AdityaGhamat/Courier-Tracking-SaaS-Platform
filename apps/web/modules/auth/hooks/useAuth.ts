"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth.service";
import type {
  LoginInput,
  RegisterTenantInput,
  RegisterCustomerInput,
} from "@/types/auth.types";

export function useLogin() {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (res) => {
      const role = res.data?.user?.role;
      if (role === "super_admin") router.push("/admin/analytics");
      else router.push("/dashboard");
    },
  });
}

export function useRegisterTenant() {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: RegisterTenantInput) => authService.registerTenant(data),
    onSuccess: () => router.push("/login"),
  });
}

export function useRegisterCustomer() {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: RegisterCustomerInput) =>
      authService.registerCustomer(data),
    onSuccess: () => router.push("/login"),
  });
}

export function useLogout() {
  const router = useRouter();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => router.push("/login"),
  });
}
