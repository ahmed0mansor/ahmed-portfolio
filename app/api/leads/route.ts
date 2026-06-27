import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validators";
import { notifyNewLead } from "@/lib/notifications";
import type { LeadStatus, MessageRole, Prisma } from "@prisma/client";
import {
  isAllowedOrigin,
  isAuthorizedAdminRequest,
  originForbiddenResponse,
  payloadTooLargeResponse,
  rateLimit,
  rateLimitResponse,
  readJsonBody,
} from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses: LeadStatus[] = ["NEW", "REVIEWED", "CONTACTED", "ACCEPTED", "REJECTED"];

function toPrismaJson(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined || value === null) return undefined;
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function normalizeMessages(rawJson: unknown) {
  if (!rawJson || typeof rawJson !== "object" || !("messages" in rawJson)) return [];

  const messages = (rawJson as { messages?: unknown }).messages;
  if (!Array.isArray(messages)) return [];

  return messages
    .slice(0, 30)
    .map((message) => {
      if (!message || typeof message !== "object") return null;
      const role = (message as { role?: unknown }).role;
      const content = (message as { content?: unknown }).content;
      if ((role !== "user" && role !== "assistant") || typeof content !== "string" || !content.trim()) return null;
      return {
        role: role as MessageRole,
        content: content.trim().slice(0, 2000),
      };
    })
    .filter(Boolean) as Array<{ role: MessageRole; content: string }>;
}

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, { key: "leads-admin-read", limit: 30, windowMs: 60_000 });
  if (!limited.allowed) return rateLimitResponse(limited.retryAfter);

  try {
    if (!isAuthorizedAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leads = await prisma.clientLead.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        briefs: { orderBy: { createdAt: "desc" }, take: 1 },
        sessions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { messages: { orderBy: { createdAt: "asc" }, take: 40 } },
        },
      },
      take: 100,
    });

    const counts = await prisma.clientLead.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    return NextResponse.json({ leads, counts }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("/api/leads GET failed");
    return NextResponse.json({ error: "Failed to load leads." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, { key: "lead-submit", limit: 3, windowMs: 10 * 60_000 });
  if (!limited.allowed) return rateLimitResponse(limited.retryAfter);

  if (!isAllowedOrigin(request)) return originForbiddenResponse();

  try {
    const body = await readJsonBody(request, 90_000);
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid lead data" }, { status: 400 });
    }

    const data = parsed.data;
    if (data.website) {
      return NextResponse.json({ error: "Rejected." }, { status: 400 });
    }

    const chatMessages = normalizeMessages(data.rawJson);

    const lead = await prisma.clientLead.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        companyName: data.companyName || null,
        projectType: data.projectType,
        budgetRange: data.budgetRange || null,
        timeline: data.timeline || null,
        briefs: {
          create: {
            projectType: data.projectType,
            budgetRange: data.budgetRange || null,
            timeline: data.timeline || null,
            mainGoal: data.mainGoal || null,
            targetUsers: data.targetUsers || [],
            requiredPages: data.requiredPages || [],
            requiredFeatures: data.requiredFeatures || [],
            preferredStyle: data.preferredStyle || null,
            language: data.language || null,
            aiSummary: data.aiSummary,
            rawJson: toPrismaJson(data.rawJson),
          },
        },
        sessions: chatMessages.length
          ? {
              create: {
                status: "submitted",
                messages: {
                  create: chatMessages,
                },
              },
            }
          : undefined,
      },
      include: {
        briefs: { orderBy: { createdAt: "desc" }, take: 1 },
        sessions: { include: { messages: true }, take: 1 },
      },
    });

    notifyNewLead(lead).catch((error) => {
      console.error("Notification failed after lead creation:", error);
    });

    return NextResponse.json({ lead }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") {
      return payloadTooLargeResponse();
    }
    console.error("/api/leads POST failed");
    return NextResponse.json({ error: "Failed to save lead." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const limited = rateLimit(request, { key: "leads-admin-update", limit: 30, windowMs: 60_000 });
  if (!limited.allowed) return rateLimitResponse(limited.retryAfter);

  if (!isAllowedOrigin(request)) return originForbiddenResponse();

  try {
    if (!isAuthorizedAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await readJsonBody(request, 10_000);
    const id = body && typeof body === "object" && "id" in body && typeof body.id === "string" ? body.id : "";
    const status = body && typeof body === "object" && "status" in body && typeof body.status === "string" ? body.status : "";

    if (!id || !allowedStatuses.includes(status as LeadStatus)) {
      return NextResponse.json({ error: "Invalid lead id or status" }, { status: 400 });
    }

    const lead = await prisma.clientLead.update({
      where: { id },
      data: { status: status as LeadStatus },
      include: { briefs: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    return NextResponse.json({ lead }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") {
      return payloadTooLargeResponse();
    }
    console.error("/api/leads PATCH failed");
    return NextResponse.json({ error: "Failed to update lead status." }, { status: 500 });
  }
}
