import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) throw new Error("BACKEND_URL is not defined in .env.local");

export function createProxy(backendPrefix: string) {
  async function handler(
    req: NextRequest,
    context: { params: Promise<{ path: string[] }> },
  ) {
    const { path: pathSegments } = await context.params;
    const path = pathSegments?.join("/") ?? "";
    const url = `${BACKEND_URL}/api/v1/${backendPrefix}${path ? `/${path}` : ""}${req.nextUrl.search}`;
    const isBodyMethod = ["POST", "PUT", "PATCH"].includes(req.method);

    const res = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("Authorization") ?? "",
        cookie: req.headers.get("cookie") ?? "",
      },
      body: isBodyMethod ? await req.text() : undefined,
    });

    const data = await res.json();
    const response = NextResponse.json(data, { status: res.status });

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  }

  return {
    GET: handler,
    POST: handler,
    PUT: handler,
    PATCH: handler,
    DELETE: handler,
  };
}
