"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { DashboardLeadsPanel } from "@/components/DashboardLeadsPanel";
import { DashboardSettingsPanel } from "@/components/DashboardSettingsPanel";

export function DashboardProtectedContent() {
  const [token, setToken] = useState("");
  const [verifiedToken, setVerifiedToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = window.sessionStorage.getItem("admin_token") || "";
    if (saved) setToken(saved);
  }, []);

  async function verifyToken() {
    const cleanToken = token.trim();
    setError("");
    if (!cleanToken) {
      setError("أدخل رمز المدير أولًا.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/settings", {
        headers: { "x-admin-token": cleanToken },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("رمز المدير غير صحيح أو لم يتم ضبط ADMIN_TOKEN في Vercel.");
      }

      window.sessionStorage.setItem("admin_token", cleanToken);
      setVerifiedToken(cleanToken);
    } catch (err) {
      setVerifiedToken("");
      setError(err instanceof Error ? err.message : "تعذر التحقق من الرمز.");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    window.sessionStorage.removeItem("admin_token");
    setVerifiedToken("");
    setToken("");
  }

  if (!verifiedToken) {
    return (
      <main className="min-h-screen py-12">
        <div className="container-shell">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-cyanBrand hover:text-cyan-200">
            <ArrowRight className="h-4 w-4" /> العودة للموقع
          </a>

          <section className="mx-auto mt-12 max-w-xl card-border rounded-[2rem] p-7 text-center md:p-10">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-cyanBrand/10 text-cyanBrand">
              <LockKeyhole className="h-8 w-8" />
            </div>
            <p className="section-kicker mt-7">Admin Access</p>
            <h1 className="mt-3 text-3xl font-black text-white md:text-4xl">أدخل رمز المدير</h1>
            <p className="mt-4 leading-8 text-slate-300">
              بعد إدخال الرمز الصحيح ستظهر لك الطلبات والإعدادات الكاملة للموقع.
            </p>

            <div className="mt-7 space-y-3">
              <input
                value={token}
                onChange={(event) => setToken(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") verifyToken();
                }}
                type="password"
                autoComplete="off"
                dir="ltr"
                maxLength={200}
                placeholder="ADMIN_TOKEN"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-center text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyanBrand"
              />
              <button
                onClick={verifyToken}
                disabled={loading || !token.trim()}
                className="btn-primary w-full gap-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                دخول لوحة التحكم
              </button>
            </div>

            {error ? (
              <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-3 text-sm leading-7 text-red-200">
                {error}
              </p>
            ) : null}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container-shell">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-cyanBrand hover:text-cyan-200">
            <ArrowRight className="h-4 w-4" /> العودة للموقع
          </a>
          <button
            onClick={logout}
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-red-300/40 hover:text-red-200"
          >
            تسجيل الخروج
          </button>
        </div>

        <div className="mt-8 card-border rounded-[2rem] p-8">
          <p className="section-kicker">Admin Dashboard</p>
          <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">لوحة التحكم الكاملة</h1>
          <p className="mt-5 max-w-3xl leading-8 text-slate-300">
            إدارة الطلبات، الإعدادات، النصوص، المهارات، الخدمات، المشاريع، الألوان، شكل العرض، وإظهار أو إخفاء الأقسام من مكان واحد.
          </p>
        </div>

        <div className="mt-8">
          <DashboardLeadsPanel adminToken={verifiedToken} autoLoad />
        </div>

        <div className="mt-8">
          <DashboardSettingsPanel adminToken={verifiedToken} autoLoad />
        </div>
      </div>
    </main>
  );
}
