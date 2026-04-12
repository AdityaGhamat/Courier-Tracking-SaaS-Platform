import { fetcher, API } from "@/lib/fetcher";
import type {
  LoginInput,
  RegisterTenantInput,
  RegisterCustomerInput,
  AuthResponse,
} from "@/types/auth.types";

export const authService = {
  login: (body: LoginInput) =>
    fetcher<AuthResponse>(`${API.auth}/login`, { method: "POST", body }),

  registerTenant: (body: RegisterTenantInput) =>
    fetcher<AuthResponse>(`${API.auth}/register/tenant`, {
      method: "POST",
      body,
    }),

  registerCustomer: (body: RegisterCustomerInput) =>
    fetcher<AuthResponse>(`${API.auth}/register/customer`, {
      method: "POST",
      body,
    }),

  logout: () =>
    fetcher<{ success: boolean }>(`${API.auth}/logout`, { method: "POST" }),

  me: () => fetcher<AuthResponse>(`${API.auth}/me`),
};
