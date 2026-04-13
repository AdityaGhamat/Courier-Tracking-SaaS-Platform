import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3005";

async function handler(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const joined = path.join("/");
  const search = req.nextUrl.search ?? "";
  const backendUrl = `${BACKEND_URL}/api/v1/${joined}${search}`;

  // Forward cookies from browser → backend
  const cookieStore = await cookies();
  const sessionKey = cookieStore.get("session_key")?.value;
  const refreshKey = cookieStore.get("refresh_key")?.value;

  const cookieHeader = [
    sessionKey ? `session_key=${sessionKey}` : "",
    refreshKey ? `refresh_key=${refreshKey}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  const forwardHeaders = new Headers();
  forwardHeaders.set("content-type", "application/json");
  if (cookieHeader) forwardHeaders.set("cookie", cookieHeader);

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await req.text()
      : undefined;

  let backendRes: Response;
  try {
    backendRes = await fetch(backendUrl, {
      method: req.method,
      headers: forwardHeaders,
      body,
    });
  } catch {
    return NextResponse.json(
      { message: "Backend unreachable" },
      { status: 502 },
    );
  }

  const responseText = await backendRes.text();

  const response = new NextResponse(responseText, {
    status: backendRes.status,
    headers: { "content-type": "application/json" },
  });

  const setCookies: string[] =
    (backendRes.headers as any).getSetCookie?.() ??
    [backendRes.headers.get("set-cookie")].filter(Boolean);

  for (const raw of setCookies) {
    const [nameValuePart] = raw.split(";");
    const eqIdx = nameValuePart.indexOf("=");
    const name = nameValuePart.slice(0, eqIdx).trim();
    const value = nameValuePart.slice(eqIdx + 1).trim();

    const isSession = name === "session_key";
    const isRefresh = name === "refresh_key";

    // Only forward the two known auth cookies; ignore anything else
    if (isSession || isRefresh) {
      response.cookies.set(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: isSession ? 60 * 60 : 60 * 60 * 24 * 7, // 1h / 7d
      });
    }
  }

  // Clear cookies on logout
  if (joined === "auth/logout") {
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
