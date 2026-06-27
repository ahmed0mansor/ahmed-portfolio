import type { ClientLead, ProjectBrief } from "@prisma/client";

type LeadWithBriefs = ClientLead & {
  briefs?: ProjectBrief[];
};

function getLeadSummary(lead: LeadWithBriefs) {
  const latestBrief = lead.briefs?.[0];
  return [
    `طلب مشروع جديد من موقع أحمد`,
    ``,
    `العميل: ${lead.name}`,
    `الهاتف: ${lead.phone || "غير محدد"}`,
    `البريد: ${lead.email || "غير محدد"}`,
    `الشركة: ${lead.companyName || "غير محددة"}`,
    `نوع المشروع: ${lead.projectType}`,
    `الميزانية: ${lead.budgetRange || "غير محددة"}`,
    `المدة: ${lead.timeline || "غير محددة"}`,
    `الحالة: ${lead.status}`,
    ``,
    `الملخص:`,
    latestBrief?.aiSummary || "لا يوجد ملخص.",
  ].join("\n");
}

async function sendTelegramNotification(lead: LeadWithBriefs) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return { skipped: true, channel: "telegram" };

  const message = getLeadSummary(lead).slice(0, 3900);
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Telegram notification failed: ${response.status} ${body}`);
  }

  return { sent: true, channel: "telegram" };
}

async function sendEmailNotification(lead: LeadWithBriefs) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_NOTIFY_EMAIL;
  const from = process.env.LEADS_NOTIFY_FROM || "Ahmed Portfolio <onboarding@resend.dev>";
  if (!apiKey || !to) return { skipped: true, channel: "email" };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to,
      subject: `طلب مشروع جديد: ${lead.projectType}`,
      text: getLeadSummary(lead),
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Email notification failed: ${response.status} ${body}`);
  }

  return { sent: true, channel: "email" };
}

export async function notifyNewLead(lead: LeadWithBriefs) {
  const results = await Promise.allSettled([
    sendTelegramNotification(lead),
    sendEmailNotification(lead),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Lead notification error:", result.reason);
    }
  }

  return results;
}
