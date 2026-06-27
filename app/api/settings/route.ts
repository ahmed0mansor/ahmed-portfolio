import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/admin-auth";
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings";
import { languageVariants, layoutVariants, normalizeSiteContent, themeVariants } from "@/lib/site-content";
import { englishSiteContent } from "@/lib/site-translations";
import {
  isAllowedOrigin,
  originForbiddenResponse,
  payloadTooLargeResponse,
  rateLimit,
  rateLimitResponse,
  readJsonBody,
} from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, { key: "settings-read", limit: 30, windowMs: 60_000 });
  if (!limited.allowed) return rateLimitResponse(limited.retryAfter);

  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getSiteSettings();
  return NextResponse.json({ settings }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: NextRequest) {
  const limited = rateLimit(request, { key: "settings-write", limit: 20, windowMs: 60_000 });
  if (!limited.allowed) return rateLimitResponse(limited.retryAfter);

  if (!isAllowedOrigin(request)) return originForbiddenResponse();

  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await readJsonBody(request, 600_000);
  } catch (error) {
    if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") {
      return payloadTooLargeResponse();
    }
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const update: Parameters<typeof updateSiteSettings>[0] = {};

  if ("cvDownloadEnabled" in body && typeof body.cvDownloadEnabled === "boolean") {
    update.cvDownloadEnabled = body.cvDownloadEnabled;
  }

  if ("themeVariant" in body && typeof body.themeVariant === "string" && themeVariants.includes(body.themeVariant as never)) {
    update.themeVariant = body.themeVariant as never;
  }

  if ("layoutVariant" in body && typeof body.layoutVariant === "string" && layoutVariants.includes(body.layoutVariant as never)) {
    update.layoutVariant = body.layoutVariant as never;
  }

  if ("defaultLanguage" in body && typeof body.defaultLanguage === "string" && languageVariants.includes(body.defaultLanguage as never)) {
    update.defaultLanguage = body.defaultLanguage as never;
  }

  if ("colorRotationEnabled" in body && typeof body.colorRotationEnabled === "boolean") {
    update.colorRotationEnabled = body.colorRotationEnabled;
  }

  if ("colorRotationIntervalSeconds" in body && typeof body.colorRotationIntervalSeconds === "number") {
    update.colorRotationIntervalSeconds = [10, 15].includes(body.colorRotationIntervalSeconds)
      ? body.colorRotationIntervalSeconds
      : 10;
  }

  if ("content" in body && body.content && typeof body.content === "object") {
    update.content = normalizeSiteContent(body.content);
  }

  if ("contentEn" in body && body.contentEn && typeof body.contentEn === "object") {
    update.contentEn = normalizeSiteContent(body.contentEn, englishSiteContent);
  }

  const settings = await updateSiteSettings(update);
  return NextResponse.json({ settings }, { headers: { "Cache-Control": "no-store" } });
}
