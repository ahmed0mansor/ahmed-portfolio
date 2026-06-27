import { NextRequest, NextResponse } from "next/server";
import { generateAIReply } from "@/lib/llm";
import { chatRequestSchema } from "@/lib/validators";
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

function fallbackReply(lastUserMessage: string) {
  const text = lastUserMessage.toLowerCase();
  const wantsEnglish = /[a-z]{3,}/i.test(lastUserMessage) && !/[؀-ۿ]/.test(lastUserMessage);

  if (wantsEnglish) {
    if (text.includes("website") || text.includes("web")) {
      return "Great. To prepare a clear project brief: what is the main goal of the website? Is it a personal portfolio, company website, online store, or landing page? What pages do you expect?";
    }

    if (text.includes("app") || text.includes("mobile")) {
      return "Understood. Is the app for Android only or Android and iOS? Who are the target users? Also mention the top 3 features you need.";
    }

    if (text.includes("system") || text.includes("dashboard")) {
      return "Good. Management systems need more detail. Do you need a dashboard for users, products, orders, reports, or other data? Do you need user roles and permissions?";
    }

    if (text.includes("store") || text.includes("ecommerce") || text.includes("shop")) {
      return "Got it. For the online store: what products will you sell? Do you need online payment, inventory management, coupons, shipping, and customer login?";
    }

    return "To define your request clearly: do you need a website, mobile app, management system, online store, or automation workflow? Then mention the main goal and target users.";
  }

  if (text.includes("موقع") || text.includes("website") || text.includes("ويب")) {
    return "ممتاز. حتى أحول طلبك إلى Project Brief واضح: ما هدف الموقع الأساسي؟ هل هو موقع شخصي، شركة، متجر، أم صفحة تعريفية؟ وما الصفحات التي تتوقع وجودها؟";
  }

  if (text.includes("تطبيق") || text.includes("app") || text.includes("موبايل")) {
    return "واضح أنك تفكر في تطبيق. هل التطبيق للاندرويد فقط أم اندرويد وiOS؟ ومن هم المستخدمون المستهدفون؟ اذكر أيضًا أهم 3 خصائص تريدها في التطبيق.";
  }

  if (text.includes("نظام") || text.includes("dashboard") || text.includes("لوحة")) {
    return "جيد. الأنظمة تحتاج تحديدًا أدق. هل تريد لوحة تحكم لإدارة مستخدمين، منتجات، طلبات، تقارير، أم بيانات أخرى؟ وهل تحتاج صلاحيات مختلفة للمستخدمين؟";
  }

  if (text.includes("متجر") || text.includes("بيع") || text.includes("ecommerce")) {
    return "فهمت. بالنسبة للمتجر: ما نوع المنتجات؟ هل تحتاج دفع إلكتروني، إدارة مخزون، كوبونات، شحن، وتسجيل دخول للعملاء؟";
  }

  return "حتى أحدد طلبك بدقة: هل تريد موقعًا، تطبيقًا، نظام إدارة، متجرًا إلكترونيًا، أم أتمتة؟ ثم اذكر الهدف الأساسي والجمهور المستهدف.";
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, { key: "chat", limit: 12, windowMs: 60_000 });
  if (!limited.allowed) return rateLimitResponse(limited.retryAfter);

  if (!isAllowedOrigin(request)) return originForbiddenResponse();

  try {
    const body = await readJsonBody(request, 60_000);
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { messages } = parsed.data;
    const lastUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content ?? "";

    try {
      const ai = await generateAIReply(messages);
      return NextResponse.json(
        { reply: ai.reply, mode: ai.provider, model: ai.model },
        { headers: { "Cache-Control": "no-store" } },
      );
    } catch (error) {
      console.warn("AI provider failed, using fallback:", error);
      return NextResponse.json(
        { reply: fallbackReply(lastUserMessage), mode: "fallback" },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") {
      return payloadTooLargeResponse();
    }
    console.error("/api/chat failed");
    return NextResponse.json({ reply: "حدث خطأ مؤقت. حاول مرة أخرى. / Temporary error. Please try again." }, { status: 500 });
  }
}
