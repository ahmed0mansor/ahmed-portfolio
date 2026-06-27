"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SiteLanguage } from "@/lib/site-content";
import { Bot, CheckCircle2, ClipboardCheck, Loader2, Send, X } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type LeadForm = {
  name: string;
  phone: string;
  email: string;
  companyName: string;
  website: string;
};

type AIChatWidgetProps = {
  greeting: string;
  greetingEn: string;
};

function allText(messages: Message[]) {
  return messages.map((message) => message.content).join("\n").toLowerCase();
}

function inferProjectType(messages: Message[]) {
  const text = allText(messages);
  if (text.includes("متجر") || text.includes("ecommerce") || text.includes("بيع")) return "متجر إلكتروني";
  if (text.includes("تطبيق") || text.includes("mobile") || text.includes("app") || text.includes("موبايل")) return "تطبيق موبايل";
  if (text.includes("نظام") || text.includes("dashboard") || text.includes("لوحة")) return "نظام إدارة / Dashboard";
  if (text.includes("أتمتة") || text.includes("automation") || text.includes("n8n")) return "أتمتة / Automation";
  if (text.includes("موقع") || text.includes("website") || text.includes("ويب")) return "موقع ويب";
  return "طلب مشروع رقمي";
}

function extractBudget(messages: Message[]) {
  const text = allText(messages);
  const match = text.match(/(?:ميزانية|budget|تكلفة|سعر)[^\n]{0,40}/i);
  return match?.[0]?.trim() || "غير محددة";
}

function extractTimeline(messages: Message[]) {
  const text = allText(messages);
  const match = text.match(/(?:مدة|أسبوع|اسبوع|شهر|يوم|timeline|deadline|موعد)[^\n]{0,50}/i);
  return match?.[0]?.trim() || "غير محددة";
}

function buildLeadSummary(messages: Message[]) {
  const conversation = messages
    .filter((message) => message.content.trim())
    .map((message) => `${message.role === "user" ? "العميل" : "المساعد"}: ${message.content.trim()}`)
    .join("\n\n");

  return [
    `نوع الطلب المتوقع: ${inferProjectType(messages)}`,
    ``,
    `ملخص المحادثة بين العميل والمساعد الذكي:`,
    conversation.slice(0, 6500),
  ].join("\n");
}

export function AIChatWidget({ greeting, greetingEn }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [language, setLanguage] = useState<SiteLanguage>("ar");
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadForm, setLeadForm] = useState<LeadForm>({ name: "", phone: "", email: "", companyName: "", website: "" });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function readCurrentLanguage(): SiteLanguage {
      const rootLanguage = document.querySelector(".site-root")?.getAttribute("data-language");
      return rootLanguage === "en" ? "en" : "ar";
    }

    function syncLanguage(nextLanguage = readCurrentLanguage()) {
      setLanguage(nextLanguage);
      setMessages((current) => {
        const hasUserMessage = current.some((message) => message.role === "user");
        if (hasUserMessage) return current;
        return [{ role: "assistant", content: nextLanguage === "en" ? greetingEn : greeting }];
      });
    }

    syncLanguage();

    function handleLanguageChange(event: Event) {
      const nextLanguage = (event as CustomEvent<SiteLanguage>).detail;
      syncLanguage(nextLanguage === "en" ? "en" : "ar");
    }

    window.addEventListener("site-language-change", handleLanguageChange);
    return () => window.removeEventListener("site-language-change", handleLanguageChange);
  }, [greeting, greetingEn]);

  const text = {
    title: language === "en" ? "AI Project Assistant" : "المساعد الذكي للمشاريع",
    subtitle: language === "en" ? "Collect requirements and submit the request" : "جمع المتطلبات وإرسال الطلب",
    thinking: language === "en" ? "Thinking..." : "جاري التفكير...",
    submitTitle: language === "en" ? "Submit request to dashboard" : "إرسال الطلب للوحة التحكم",
    name: language === "en" ? "Name *" : "الاسم *",
    phone: language === "en" ? "Phone or WhatsApp *" : "الهاتف أو واتساب *",
    email: language === "en" ? "Email optional" : "البريد اختياري",
    company: language === "en" ? "Company optional" : "الشركة اختياري",
    sent: language === "en" ? "Request submitted." : "تم إرسال الطلب.",
    submitNow: language === "en" ? "Submit request now" : "إرسال الطلب الآن",
    placeholder: language === "en" ? "Write your project idea..." : "اكتب فكرة المشروع...",
    errorReply: language === "en" ? "There was an issue generating the reply. Please try again." : "حدث خطأ في توليد الرد. حاول مرة أخرى.",
    serverError: language === "en" ? "Could not connect to the server. Check the API settings." : "تعذر الاتصال بالخادم. تأكد من إعدادات API.",
    successReply: language === "en"
      ? "Your request has been submitted successfully. It will now appear in the dashboard and will be reviewed before contacting you."
      : "تم إرسال طلبك بنجاح. سيظهر الطلب الآن في لوحة التحكم، وسيتم التواصل معك بعد مراجعة التفاصيل.",
    submitError: language === "en" ? "Could not submit the request." : "تعذر إرسال الطلب.",
    submitErrorTry: language === "en" ? "Could not submit the request. Please try again." : "تعذر إرسال الطلب. حاول مرة أخرى.",
  };

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);
  const hasClientMessages = messages.some((message) => message.role === "user");
  const canSubmitLead = leadForm.name.trim().length >= 2 && (leadForm.phone.trim().length >= 5 || leadForm.email.trim().length >= 5);

  async function sendMessage() {
    if (!canSend) return;
    const userMessage: Message = { role: "user", content: input.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply || text.errorReply,
      };
      setMessages((current) => [...current, assistantMessage]);
      setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }), 50);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: text.serverError },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function submitLead() {
    if (!canSubmitLead || submitLoading || submitted) return;
    setSubmitError("");
    setSubmitLoading(true);

    const payload = {
      name: leadForm.name.trim(),
      phone: leadForm.phone.trim(),
      email: leadForm.email.trim(),
      companyName: leadForm.companyName.trim(),
      website: leadForm.website.trim(),
      projectType: inferProjectType(messages),
      budgetRange: extractBudget(messages),
      timeline: extractTimeline(messages),
      aiSummary: buildLeadSummary(messages),
      rawJson: {
        source: "ai_chat_widget",
        submittedAt: new Date().toISOString(),
        messages,
      },
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || text.submitError);
      }

      setSubmitted(true);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: text.successReply,
        },
      ]);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : text.submitErrorTry);
    } finally {
      setSubmitLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        id="chat"
        onClick={() => setIsOpen(true)}
        className="chat-widget fixed bottom-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-cyanBrand text-slate-950 shadow-glow transition hover:-translate-y-1"
        aria-label="Open AI chat"
      >
        <Bot className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div id="chat" dir={language === "ar" ? "rtl" : "ltr"} className="chat-widget fixed bottom-5 z-50 w-[calc(100%-40px)] max-w-md overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyanBrand/10 text-cyanBrand">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{text.title}</h3>
            <p className="text-xs text-slate-400">{text.subtitle}</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Close chat">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div ref={listRef} className="max-h-[390px] space-y-3 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-7 ${
                message.role === "user"
                  ? "bg-cyanBrand text-slate-950"
                  : "border border-white/10 bg-white/[0.04] text-slate-100"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {loading ? (
          <div className="flex justify-end">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
              <Loader2 className="h-4 w-4 animate-spin" /> {text.thinking}
            </div>
          </div>
        ) : null}
      </div>

      {hasClientMessages ? (
        <div className="border-t border-white/10 bg-white/[0.02] p-3">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold text-cyanBrand">
            <ClipboardCheck className="h-4 w-4" /> {text.submitTitle}
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <input
              value={leadForm.name}
              maxLength={100}
              autoComplete="name"
              onChange={(event) => setLeadForm((current) => ({ ...current, name: event.target.value }))}
              placeholder={text.name}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none placeholder:text-slate-500 focus:border-cyanBrand"
            />
            <input
              value={leadForm.phone}
              maxLength={30}
              autoComplete="tel"
              onChange={(event) => setLeadForm((current) => ({ ...current, phone: event.target.value }))}
              placeholder={text.phone}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none placeholder:text-slate-500 focus:border-cyanBrand"
            />
            <input
              value={leadForm.email}
              type="email"
              maxLength={150}
              autoComplete="email"
              onChange={(event) => setLeadForm((current) => ({ ...current, email: event.target.value }))}
              placeholder={text.email}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none placeholder:text-slate-500 focus:border-cyanBrand"
            />
            <input
              value={leadForm.companyName}
              maxLength={120}
              autoComplete="organization"
              onChange={(event) => setLeadForm((current) => ({ ...current, companyName: event.target.value }))}
              placeholder={text.company}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none placeholder:text-slate-500 focus:border-cyanBrand"
            />
            <input
              value={leadForm.website}
              onChange={(event) => setLeadForm((current) => ({ ...current, website: event.target.value }))}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
              placeholder="Website"
            />
          </div>
          {submitError ? <p className="mt-2 text-xs text-red-300">{submitError}</p> : null}
          {submitted ? (
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">
              <CheckCircle2 className="h-4 w-4" /> {text.sent}
            </div>
          ) : (
            <button
              onClick={submitLead}
              disabled={!canSubmitLead || submitLoading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-cyanBrand px-4 py-2 text-xs font-black text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardCheck className="h-4 w-4" />}
              {text.submitNow}
            </button>
          )}
        </div>
      ) : null}

      <div className="border-t border-white/10 p-3">
        <div className="flex gap-2">
          <input
            value={input}
            maxLength={2000}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
            placeholder={text.placeholder}
            className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyanBrand"
          />
          <button onClick={sendMessage} disabled={!canSend} className="grid h-12 w-12 place-items-center rounded-full bg-cyanBrand text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Send message">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
