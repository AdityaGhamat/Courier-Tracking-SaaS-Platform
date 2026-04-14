import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3005";

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const segments = path.join("/");

  // /api/proxy/auth/login → http://localhost:3005/api/v1/auth/login
  const targetUrl = `${BACKEND_URL}/api/v1/${segments}${req.nextUrl.search}`;

  const cookieStore = await cookies();
  const sessionKey = cookieStore.get("session_key")?.value;
  const refreshKey = cookieStore.get("refresh_key")?.value;

  const cookieHeader = [
    sessionKey ? `session_key=${sessionKey}` : "",
    refreshKey ? `refresh_key=${refreshKey}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  const hasBody = ["POST", "PUT", "PATCH"].includes(req.method);
  const body = hasBody ? await req.text() : undefined;

  let backendRes: Response;
  try {
    backendRes = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      ...(body ? { body } : {}),
      redirect: "manual",
    });
  } catch (e) {
    console.error("[proxy] fetch failed:", e);
    return NextResponse.json(
      { message: "Backend unreachable" },
      { status: 502 },
    );
  }

  // ✅ Forward Set-Cookie from Express → browser
  const rawHeaders = backendRes.headers as unknown as {
    getSetCookie?: () => string[];
  };
  const allSetCookies =
    typeof rawHeaders.getSetCookie === "function"
      ? rawHeaders.getSetCookie()
      : backendRes.headers.get("set-cookie")
        ? [backendRes.headers.get("set-cookie")!]
        : [];

  const contentType = backendRes.headers.get("content-type") || "";

  // ✅ FIX: If the backend returns an image (or file), pass the raw binary buffer directly
  if (
    contentType.includes("image/") ||
    contentType.includes("application/octet-stream")
  ) {
    const arrayBuffer = await backendRes.arrayBuffer();

    const headers = new Headers();
    headers.set("Content-Type", contentType);

    const disposition = backendRes.headers.get("content-disposition");
    if (disposition) {
      headers.set("Content-Disposition", disposition);
    }

    const nextRes = new NextResponse(arrayBuffer, {
      status: backendRes.status,
      headers,
    });

    allSetCookies.forEach((c) => nextRes.headers.append("set-cookie", c));
    return nextRes;
  }

  // ✅ Standard JSON handling for regular API endpoints
  const responseText = await backendRes.text();
  let responseData: unknown;
  try {
    responseData = JSON.parse(responseText);
  } catch {
    responseData = { message: responseText };
  }

  const nextRes = NextResponse.json(responseData, {
    status: backendRes.status,
  });

  allSetCookies.forEach((c) => {
    nextRes.headers.append("set-cookie", c);
  });

  return nextRes;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
