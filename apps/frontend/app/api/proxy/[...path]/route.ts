import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3005";

// All HTTP methods map to the same handler
async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const segments = path.join("/");

  // Build the backend URL: /api/proxy/auth/login → BACKEND_URL/api/v1/auth/login
  const backendPath = `${BACKEND_URL}/api/v1/${segments}`;

  // Forward query params
  const search = req.nextUrl.search;
  const targetUrl = `${backendPath}${search}`;

  // Forward the session cookies from the incoming browser request
  const cookieStore = await cookies();
  const sessionKey = cookieStore.get("session_key")?.value;
  const refreshKey = cookieStore.get("refresh_key")?.value;

  const cookieHeader = [
    sessionKey ? `session_key=${sessionKey}` : "",
    refreshKey ? `refresh_key=${refreshKey}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  // Read the body only for methods that have one
  const hasBody = ["POST", "PUT", "PATCH"].includes(req.method);
  const body = hasBody ? await req.text() : undefined;

  const backendRes = await fetch(targetUrl, {
    method: req.method,
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    ...(body ? { body } : {}),
    // Don't follow redirects — proxy them as-is
    redirect: "manual",
  });

  // Read body
  const responseText = await backendRes.text();
  let responseData: unknown;
  try {
    responseData = JSON.parse(responseText);
  } catch {
    responseData = { message: responseText };
  }

  // Build the Next.js response
  const nextRes = NextResponse.json(responseData, {
    status: backendRes.status,
  });

  // Forward Set-Cookie headers from backend → browser
  // This is how session_key gets planted on login
  const setCookieHeader = backendRes.headers.get("set-cookie");
  if (setCookieHeader) {
    // Multiple set-cookie headers need to be forwarded individually
    // Next.js only exposes the first via .get(); use getSetCookie() if available
    const rawHeaders = backendRes.headers as unknown as {
      getSetCookie?: () => string[];
    };
    const allSetCookies =
      typeof rawHeaders.getSetCookie === "function"
        ? rawHeaders.getSetCookie()
        : [setCookieHeader];

    allSetCookies.forEach((cookieStr) => {
      nextRes.headers.append("set-cookie", cookieStr);
    });
  }

  return nextRes;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
