const PROXY_BASE = "/api/proxy";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
};

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
) {
  const url = new URL(`${PROXY_BASE}/${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined) url.searchParams.set(key, String(val));
    });
  }
  return url.toString();
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, params } = options;

  const res = await fetch(buildUrl(path, params), {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(
      (data as { message?: string })?.message ?? "Something went wrong",
    ) as Error & { statusCode: number; errors: unknown };
    error.statusCode = res.status;
    error.errors = (data as { errors?: unknown })?.errors;
    throw error;
  }

  return data as T;
}

// ── Auth
export const authApi = {
  registerTenant: (body: unknown) =>
    request("auth/register-tenant", { method: "POST", body }),
  registerCustomer: (body: unknown) =>
    request("auth/register-customer", { method: "POST", body }),
  login: (body: unknown) => request("auth/login", { method: "POST", body }),
  logout: () => request("auth/logout", { method: "POST" }),
  getMe: () => request("auth/me"), // ✅ Added
  refreshSession: () => request("auth/refresh-session", { method: "POST" }),
  registerAgent: (body: unknown) =>
    request("auth/register-agent", { method: "POST", body }),
};

// ── Shipments
export const shipmentsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    request("shipments", { params }),
  getById: (id: string) => request(`shipments/${id}`),
  create: (body: unknown) => request("shipments", { method: "POST", body }),
  updateStatus: (id: string, body: unknown) =>
    request(`shipments/${id}/status`, { method: "POST", body }),
  assignAgent: (id: string, body: unknown) =>
    request(`shipments/${id}/assign-agent`, { method: "POST", body }),
  myShipments: (
    params?: Record<string, string | number | boolean | undefined>,
  ) => request("shipments/my/shipments", { params }),
  agentAssigned: () => request("shipments/agent/assigned"),
  getOptimizedRoute: (
    agentId: string,
    params: { hubLat: number; hubLng: number },
  ) =>
    request(`shipments/agent/${agentId}/optimized-route`, {
      params: params as Record<string, number>,
    }),
};

// ── Tracking (public)
export const trackingApi = {
  track: (trackingId: string) => request(`track/${trackingId}`),
};

// ── Hubs
export const hubsApi = {
  list: () => request("hubs"),
  create: (body: unknown) => request("hubs", { method: "POST", body }),
  getById: (id: string) => request(`hubs/${id}`),
  update: (id: string, body: unknown) =>
    request(`hubs/${id}`, { method: "PUT", body }),
  delete: (id: string) => request(`hubs/${id}`, { method: "DELETE" }),
};

// ── Vehicles
export const vehiclesApi = {
  list: () => request("vehicles"),
  create: (body: unknown) => request("vehicles", { method: "POST", body }),
  update: (id: string, body: unknown) =>
    request(`vehicles/${id}`, { method: "PUT", body }),
  delete: (id: string) => request(`vehicles/${id}`, { method: "DELETE" }),
  assignAgent: (id: string, body: { agentId: string }) =>
    request(`vehicles/${id}/assign-agent`, { method: "PATCH", body }),
  unassignAgent: (id: string) =>
    request(`vehicles/${id}/unassign-agent`, { method: "DELETE" }),
  getMyVehicle: () => request("vehicles/my"),
};

// ── Analytics
export const analyticsApi = {
  getDashboard: () => request("analytics"),
};

// ── Payments
export const paymentsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    request("payments", { params }),
  getById: (id: string) => request(`payments/${id}`),
};

// ── Subscriptions
export const subscriptionsApi = {
  list: () => request("subscriptions"),
  getById: (id: string) => request(`subscriptions/${id}`),
  create: (body: unknown) => request("subscriptions", { method: "POST", body }),
};

// ── Upload
export const uploadApi = {
  upload: (body: unknown) => request("upload", { method: "POST", body }),
};
