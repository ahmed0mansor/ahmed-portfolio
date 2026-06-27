"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCircle2, Clock3, Loader2, Mail, Phone, RefreshCw, UserRound } from "lucide-react";

type LeadStatus = "NEW" | "REVIEWED" | "CONTACTED" | "ACCEPTED" | "REJECTED";

type LeadMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
};

type LeadBrief = {
  id: string;
  aiSummary: string;
  createdAt: string;
};

type ClientLead = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  companyName?: string | null;
  projectType: string;
  budgetRange?: string | null;
  timeline?: string | null;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  briefs?: LeadBrief[];
  sessions?: Array<{ messages?: LeadMessage[] }>;
};

const statusLabels: Record<LeadStatus, string> = {
  NEW: "جديد",
  REVIEWED: "تمت المراجعة",
  CONTACTED: "تم التواصل",
  ACCEPTED: "مقبول",
  REJECTED: "مرفوض",
};

const statusClasses: Record<LeadStatus, string> = {
  NEW: "border-cyanBrand/30 bg-cyanBrand/10 text-cyan-100",
  REVIEWED: "border-violet-300/30 bg-violet-300/10 text-violet-100",
  CONTACTED: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  ACCEPTED: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
  REJECTED: "border-red-300/30 bg-red-300/10 text-red-100",
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("ar", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function DashboardLeadsPanel() {
  const [token, setToken] = useState("");
  const [leads, setLeads] = useState<ClientLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState("");

  const newCount = useMemo(() => leads.filter((lead) => lead.status === "NEW").length, [leads]);

  useEffect(() => {
    const savedToken = window.sessionStorage.getItem("admin_token") || "";
    setToken(savedToken);
  }, []);

  async function loadLeads() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        headers: token ? { "x-admin-token": token } : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "تعذر تحميل الطلبات.");
      setLeads(data.leads || []);
      if (token) window.sessionStorage.setItem("admin_token", token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحميل الطلبات.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: LeadStatus) {
    setError("");
    setUpdatingId(id);
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "x-admin-token": token } : {}),
        },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "تعذر تحديث حالة الطلب.");
      setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, status: data.lead.status } : lead)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحديث حالة الطلب.");
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <section className="card-border rounded-[2rem] p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-kicker">Client Leads</p>
          <h2 className="mt-2 text-2xl font-black text-white">طلبات العملاء من AI Chat</h2>
          <p className="mt-3 max-w-3xl leading-8 text-slate-300">
            عندما يضغط العميل على "إرسال الطلب الآن" داخل الشات، يتم حفظ الطلب في قاعدة البيانات ثم يظهر هنا داخل لوحة التحكم بعد إدخال رمز المدير الصحيح.
          </p>
        </div>
        <div className="rounded-3xl border border-cyanBrand/20 bg-cyanBrand/10 px-5 py-4 text-center">
          <div className="text-3xl font-black text-white">{newCount}</div>
          <div className="text-xs font-bold text-cyan-100">طلبات جديدة</div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          value={token}
          type="password"
          autoComplete="off"
          maxLength={200}
          onChange={(event) => setToken(event.target.value)}
          placeholder="ADMIN_TOKEN لقراءة الطلبات وتعديل حالتها"
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyanBrand"
        />
        <button
          onClick={loadLeads}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyanBrand px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-sky-300 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          تحميل الطلبات
        </button>
      </div>

      <div className="mt-4 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-8 text-amber-50">
        <div className="mb-1 flex items-center gap-2 font-black">
          <Bell className="h-4 w-4" /> الإشعارات
        </div>
        يوجد إشعار داخلي هنا داخل الداشبورد. ويمكن تفعيل إشعار خارجي بإضافة متغيرات Resend للبريد أو Telegram في Vercel.
      </div>

      {error ? <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p> : null}

      <div className="mt-6 space-y-4">
        {leads.length === 0 && !loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-slate-300">
            لا توجد طلبات محملة بعد. أدخل رمز المدير الصحيح واضغط "تحميل الطلبات" أو انتظر أول طلب من الشات.
          </div>
        ) : null}

        {leads.map((lead) => {
          const latestBrief = lead.briefs?.[0];
          const messages = lead.sessions?.[0]?.messages || [];
          const isExpanded = expandedId === lead.id;
          return (
            <article key={lead.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClasses[lead.status]}`}>
                      {statusLabels[lead.status]}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
                      {formatDate(lead.createdAt)}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-black text-white">{lead.projectType}</h3>
                  <div className="mt-3 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
                    <span className="inline-flex items-center gap-2"><UserRound className="h-4 w-4 text-cyanBrand" /> {lead.name}</span>
                    {lead.phone ? <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-cyanBrand" /> {lead.phone}</span> : null}
                    {lead.email ? <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-cyanBrand" /> {lead.email}</span> : null}
                    <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-cyanBrand" /> {lead.timeline || "مدة غير محددة"}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["REVIEWED", "CONTACTED", "ACCEPTED", "REJECTED"] as LeadStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(lead.id, status)}
                      disabled={updatingId === lead.id}
                      className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-cyanBrand hover:text-white disabled:opacity-50"
                    >
                      {updatingId === lead.id ? "..." : statusLabels[status]}
                    </button>
                  ))}
                </div>
              </div>

              {latestBrief?.aiSummary ? (
                <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <button onClick={() => setExpandedId(isExpanded ? "" : lead.id)} className="flex w-full items-center justify-between text-right text-sm font-black text-cyanBrand">
                    <span>{isExpanded ? "إخفاء ملخص الطلب" : "عرض ملخص الطلب والمحادثة"}</span>
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  {isExpanded ? (
                    <div className="mt-4 space-y-4">
                      <pre className="whitespace-pre-wrap rounded-2xl bg-white/[0.03] p-4 text-sm leading-8 text-slate-200">{latestBrief.aiSummary}</pre>
                      {messages.length ? (
                        <div className="space-y-2">
                          <h4 className="text-sm font-black text-white">سجل المحادثة</h4>
                          {messages.map((message) => (
                            <div key={message.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-7 text-slate-300">
                              <span className="font-black text-cyanBrand">{message.role === "user" ? "العميل" : "المساعد"}: </span>
                              {message.content}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
