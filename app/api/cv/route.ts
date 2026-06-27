import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { isCvDownloadEnabled } from "@/lib/site-settings";
import { rateLimit, rateLimitResponse } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, { key: "cv-download", limit: 10, windowMs: 60_000 });
  if (!limited.allowed) return rateLimitResponse(limited.retryAfter);

  const enabled = await isCvDownloadEnabled();

  if (!enabled) {
    return NextResponse.json(
      { error: "CV download is currently disabled." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  const filePath = path.join(process.cwd(), "private", "Ahmed_Qaid_CV.pdf");
  const file = await readFile(filePath);

  return new NextResponse(file, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Ahmed_Qaid_CV.pdf"',
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
