import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3005";

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const search = req.nextUrl.search;
  const backendUrl = `${BACKEND_URL}/api/v1/${pathStr}${search}`;

  // Forward cookies from browser → backend
  const cookieStore = await cookies();
  const sessionKey = cookieStore.get("session_key")?.value;
  const refreshKey = cookieStore.get("refresh_key")?.value;
  const cookieHeader = [
    sessionKey && `session_key=${sessionKey}`,
    refreshKey && `refresh_key=${refreshKey}`,
  ]
    .filter(Boolean)
    .join("; ");

  const headers = new Headers();
  headers.set("content-type", "application/json");
  if (cookieHeader) headers.set("cookie", cookieHeader);

  // Forward auth header if present (Bearer fallback)
  const authHeader = req.headers.get("authorization");
  if (authHeader) headers.set("authorization", authHeader);

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await req.text()
      : undefined;

  let backendRes: Response;
  try {
    backendRes = await fetch(backendUrl, {
      method: req.method,
      headers,
      body,
    });
  } catch {
    return NextResponse.json(
      { message: "Backend unreachable" },
      { status: 503 },
    );
  }

  const responseText = await backendRes.text();

  const response = new NextResponse(responseText, {
    status: backendRes.status,
    headers: { "content-type": "application/json" },
  });

  // Re-set cookies from backend onto the Next.js domain
  const rawCookies: string[] =
    (backendRes.headers as any).getSetCookie?.() ??
    ([backendRes.headers.get("set-cookie")].filter(Boolean) as string[]);

  for (const cookieStr of rawCookies) {
    const [nameValue] = cookieStr.split(";");
    const eqIdx = nameValue.indexOf("=");
    const name = nameValue.slice(0, eqIdx).trim();
    const value = nameValue.slice(eqIdx + 1).trim();

    response.cookies.set(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: name === "session_key" ? 3600 : 60 * 60 * 24 * 7,
    });
  }

  // On logout — clear cookies
  if (pathStr === "auth/logout") {
    response.cookies.delete("session_key");
    response.cookies.delete("refresh_key");
  }

  return response;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
