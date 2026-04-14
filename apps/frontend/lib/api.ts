const PROXY_BASE = "/api/proxy";
const REFRESH_PATH = "auth/refresh-session";

let isRefreshing = false;
let isRedirecting = false;
const refreshQueue: Array<() => void> = [];

function flushQueue() {
  refreshQueue.forEach((cb) => cb());
  refreshQueue.length = 0;
}

type Params = Record<string, string | number | boolean | undefined>;

function buildUrl(path: string, params?: Params): string {
  const url = new URL(`${PROXY_BASE}/${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  params?: Params;
  _retry?: boolean;
};

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, params, _retry = false } = options;

  const res = await fetch(buildUrl(path, params), {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (res.ok) {
    return res.json().catch(() => ({}) as T);
  }

  const errData = await res.json().catch(() => ({}) as Record<string, unknown>);

  const isAuthEndpoint =
    path.startsWith("auth/login") ||
    path.startsWith("auth/register") ||
    path === REFRESH_PATH;

  if (res.status === 401 && !_retry && !isAuthEndpoint) {
    if (isRefreshing) {
      return new Promise<T>((resolve, reject) => {
        refreshQueue.push(async () => {
          try {
            resolve(await request<T>(path, { ...options, _retry: true }));
          } catch (err) {
            reject(err);
          }
        });
      });
    }

    isRefreshing = true;

    try {
      await fetch(buildUrl(REFRESH_PATH), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }).then(async (r) => {
        if (!r.ok) throw new Error("Refresh failed");
      });

      isRefreshing = false;
      flushQueue();
      return await request<T>(path, { ...options, _retry: true });
    } catch {
      isRefreshing = false;
      refreshQueue.length = 0;

      const currentPath = window.location.pathname;
      const isPublic =
        currentPath === "/" ||
        currentPath === "/login" ||
        currentPath === "/register" ||
        currentPath.startsWith("/track");

      if (!isRedirecting && !isPublic) {
        isRedirecting = true;
        window.location.replace("/login");
        setTimeout(() => {
          isRedirecting = false;
        }, 3000);
      }

      const error = new Error(
        "Session expired. Please log in again.",
      ) as Error & {
        statusCode: number;
        errors: unknown;
      };
      error.statusCode = 401;
      error.errors = null;
      throw error;
    }
  }

  const error = new Error(
    (errData as { message?: string })?.message ?? "Something went wrong",
  ) as Error & { statusCode: number; errors: unknown };
  error.statusCode = res.status;
  error.errors = (errData as { errors?: unknown })?.errors;
  throw error;
}

// ── Auth
export const authApi = {
  registerTenant: (body: unknown) =>
    request("auth/register-tenant", { method: "POST", body }),
  registerCustomer: (body: unknown) =>
    request("auth/register-customer", { method: "POST", body }),
  login: (body: unknown) => request("auth/login", { method: "POST", body }),
  logout: () => request("auth/logout", { method: "POST" }),
  getMe: () => request("auth/me"),
  registerAgent: (body: unknown) =>
    request("auth/register-agent", { method: "POST", body }),
  refreshSession: () => request(REFRESH_PATH, { method: "POST" }),
};

// ── Shipments
export const shipmentsApi = {
  list: (params?: Params) => request("shipments", { params }),
  getById: (id: string) => request(`shipments/${id}`),
  create: (body: unknown) => request("shipments", { method: "POST", body }),
  // FIX: backend requires status + location + description
  updateStatus: (
    id: string,
    body: { status: string; location: string; description: string },
  ) => request(`shipments/${id}/status`, { method: "POST", body }),
  assignAgent: (id: string, body: { agentId: string }) =>
    request(`shipments/${id}/assign-agent`, { method: "POST", body }),
  myShipments: (params?: Params) =>
    request("shipments/my/shipments", { params }),
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
    request(`hubs/${id}`, { method: "PATCH", body }), // ← was PUT, fix to PATCH
  delete: (id: string) => request(`hubs/${id}`, { method: "DELETE" }),

  assignShipment: (shipmentId: string, hubId: string) =>
    request(`hubs/shipments/${shipmentId}/assign`, {
      method: "POST",
      body: { hubId },
    }),
  getShipments: (hubId: string) => request(`hubs/${hubId}/shipments`),
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

export const analyticsApi = {
  getWorkspaceDashboard: () => request("analytics/workspace"),
  getPlatformDashboard: () => request("analytics/platform"),
  getAgentDashboard: () => request("analytics/agent"),
};

// ── Payments
export const paymentsApi = {
  list: (params?: Params) => request("payments", { params }),
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

export const agentsApi = {
  list: () => request("auth/agents"),
  create: (body: unknown) =>
    request("auth/register-agent", { method: "POST", body }),
};
