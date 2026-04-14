//  Cookie-based auth flow:
//    • Every request sends credentials (cookies) automatically
//    • On 401: silently call POST /api/proxy/auth/refresh-session
//      which hits  POST /api/v1/auth/refresh-session on the backend
//      → backend reads refresh_key cookie → issues new session_key
//        + refresh_key cookies → original request is retried ONCE
//    • If refresh itself fails → redirect to /login
//    • Concurrent 401s during refresh are queued and replayed after
//      refresh succeeds (same pattern as your reference project)
// ─────────────────────────────────────────────────────────────────

const PROXY_BASE = "/api/proxy";
const REFRESH_PATH = "auth/refresh-session";

// ── Refresh-queue state (module-level singleton, like authState in your ref) ──
let isRefreshing = false;
let isRedirecting = false;
const refreshQueue: Array<() => void> = [];

/** Drain the queue — replay all requests that were waiting for a new token */
function flushQueue() {
  refreshQueue.forEach((cb) => cb());
  refreshQueue.length = 0;
}

// ── URL builder ───────────────────────────────────────────────────────────────

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

// ── Core fetch wrapper ────────────────────────────────────────────────────────

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  params?: Params;
  /** Internal — prevents infinite retry loop */
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

  // ── Happy path ──────────────────────────────────────────────────
  if (res.ok) {
    return res.json().catch(() => ({}) as T);
  }

  // ── Parse error body ────────────────────────────────────────────
  const errData = await res.json().catch(() => ({}) as Record<string, unknown>);

  // ── Skip refresh for auth endpoints & the refresh call itself ───
  const isAuthEndpoint =
    path.startsWith("auth/login") ||
    path.startsWith("auth/register") ||
    path === REFRESH_PATH;

  // ── 401 handling — attempt silent token refresh ─────────────────
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
      // POST /api/proxy/auth/refresh-session

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

// ─────────────────────────────────────────────────────────────────
//  API modules
// ─────────────────────────────────────────────────────────────────

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
  // Explicit export so components can call it directly if needed
  refreshSession: () => request(REFRESH_PATH, { method: "POST" }),
};

// ── Shipments
export const shipmentsApi = {
  list: (params?: Params) => request("shipments", { params }),
  getById: (id: string) => request(`shipments/${id}`),
  create: (body: unknown) => request("shipments", { method: "POST", body }),
  updateStatus: (id: string, body: unknown) =>
    request(`shipments/${id}/status`, { method: "POST", body }),
  assignAgent: (id: string, body: unknown) =>
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

// ── Tracking
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
