import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BETTER_AUTH_URL ||
  "http://localhost:3001";

async function proxyAuthRequest(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const backendUrl = new URL(`${API_BASE}${pathname}${url.search}`);

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("content-length");

  const method = req.method;
  const body = ["GET", "HEAD"].includes(method) ? undefined : await req.text();

  const response = await fetch(backendUrl, {
    method,
    headers,
    body,
    redirect: "manual",
    cache: "no-store",
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.set("access-control-allow-origin", "*");
  responseHeaders.set("access-control-allow-credentials", "true");

  const nextResponse = new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });

  return nextResponse;
}

export async function GET(req: NextRequest) {
  return proxyAuthRequest(req);
}

export async function POST(req: NextRequest) {
  return proxyAuthRequest(req);
}

export async function PUT(req: NextRequest) {
  return proxyAuthRequest(req);
}

export async function PATCH(req: NextRequest) {
  return proxyAuthRequest(req);
}

export async function DELETE(req: NextRequest) {
  return proxyAuthRequest(req);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, Cookie, Set-Cookie",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

