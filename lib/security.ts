import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitRecord>();

function now() {
  return Date.now();
}

export function getClientIp(request: Request) {
  const headers = request.headers;
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headers.get("x-real-ip")?.trim();
  const vercelIp = headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || vercelIp || realIp || "unknown";
}

export function rateLimit(request: Request, options: { key: string; limit: number; windowMs: number }) {
  const ip = getClientIp(request);
  const bucketKey = `${options.key}:${ip}`;
  const current = now();
  const existing = buckets.get(bucketKey);

  if (!existing || existing.resetAt <= current) {
    buckets.set(bucketKey, { count: 1, resetAt: current + options.windowMs });
    return { allowed: true, remaining: options.limit - 1, retryAfter: 0 };
  }

  if (existing.count >= options.limit) {
    const retryAfter = Math.max(1, Math.ceil((existing.resetAt - current) / 1000));
    return { allowed: false, remaining: 0, retryAfter };
  }

  existing.count += 1;
  buckets.set(bucketKey, existing);
  return { allowed: true, remaining: Math.max(0, options.limit - existing.count), retryAfter: 0 };
}

export function rateLimitResponse(retryAfter: number) {
  return NextResponse.json(
    { error: "Too many requests. Please wait and try again." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function readJsonBody(request: Request, maxBytes: number) {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > maxBytes) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }

  const raw = await request.text();
  if (Buffer.byteLength(raw, "utf8") > maxBytes) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }

  if (!raw.trim()) {
    throw new Error("EMPTY_BODY");
  }

  return JSON.parse(raw) as unknown;
}

export function payloadTooLargeResponse() {
  return NextResponse.json({ error: "Request payload is too large." }, { status: 413 });
}

function normalizeAllowedOrigin(origin: string) {
  try {
    const url = new URL(origin);
    return `${url.protocol}//${url.host}`;
  } catch {
    return "";
  }
}

export function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const sameHostOrigin = host ? `${proto}://${host}` : "";

  const configuredOrigins = [
    process.env.SITE_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    sameHostOrigin,
  ]
    .filter(Boolean)
    .map((item) => normalizeAllowedOrigin(String(item)))
    .filter(Boolean);

  const supplied = origin || referer;

  if (!supplied) {
    return process.env.NODE_ENV !== "production";
  }

  const suppliedOrigin = normalizeAllowedOrigin(supplied);
  return Boolean(suppliedOrigin && configuredOrigins.includes(suppliedOrigin));
}

export function originForbiddenResponse() {
  return NextResponse.json({ error: "Forbidden origin." }, { status: 403 });
}

function hashToken(value: string) {
  return createHash("sha256").update(value).digest();
}

export function constantTimeEqual(a: string, b: string) {
  if (!a || !b) return false;
  const aHash = hashToken(a);
  const bHash = hashToken(b);
  return timingSafeEqual(aHash, bHash);
}

export function extractAdminToken(request: Request | NextRequest) {
  const xAdminToken = request.headers.get("x-admin-token")?.trim() || "";
  const authorization = request.headers.get("authorization")?.trim() || "";

  if (xAdminToken) return xAdminToken;
  if (authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7).trim();
  }
  return "";
}

export function isAuthorizedAdminRequest(request: Request | NextRequest) {
  const configuredToken = process.env.ADMIN_TOKEN;
  if (!configuredToken || configuredToken.length < 16) {
    return false;
  }

  const providedToken = extractAdminToken(request);
  return constantTimeEqual(providedToken, configuredToken);
}

export function sanitizeText(value: string, maxLength: number) {
  return value
    .normalize("NFKC")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, maxLength);
}

export function compactText(value: string, maxLength: number) {
  return sanitizeText(value, maxLength).replace(/[ \t]{2,}/g, " ");
}
