type FetchOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const API = {
  auth: "/api/v1/auth",
  shipments: "/api/v1/shipments",
  track: "/api/v1/track",
  hubs: "/api/v1/hubs",
  vehicles: "/api/v1/vehicles",
  payments: "/api/v1/payments",
  analytics: "/api/v1/analytics",
  qrcode: "/api/v1/qrcode",
  subscriptions: "/api/v1/subscriptions",
  superAdmin: "/api/v1/super-admin",
} as const;

export async function fetcher<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const res = await fetch(path, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const json = await res.json();
      message = json?.message ?? message;
    } catch {}
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}
