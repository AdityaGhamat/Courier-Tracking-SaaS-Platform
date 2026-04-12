export type Role = "admin" | "customer" | "delivery_agent" | "super_admin";

export type AuthUser = {
  id: string;
  role: Role;
  workspaceId?: string;
};

export type AuthResponse = {
  success: boolean;
  active: boolean;
  message: string;
  data: {
    user: AuthUser;
    tokens?: {
      sessionCookie: string;
      refreshCookie: string;
    };
  };
  error: { message: string };
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterTenantInput = {
  companyName: string;
  adminName: string;
  email: string;
  password: string;
};

export type RegisterCustomerInput = {
  name: string;
  email: string;
  password: string;
};
