import { ArrowRight, Database, LockKeyhole, Palette, Terminal } from "lucide-react";
import { DashboardSettingsPanel } from "@/components/DashboardSettingsPanel";
import { DashboardLeadsPanel } from "@/components/DashboardLeadsPanel";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <main className="min-h-screen py-12">
      <div className="container-shell">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-cyanBrand hover:text-cyan-200">
          <ArrowRight className="h-4 w-4" /> العودة للموقع
        </a>

        <div className="mt-8 card-border rounded-[2rem] p-8">
          <p className="section-kicker">Admin Dashboard</p>
          <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">لوحة التحكم الكاملة</h1>
          <p className="mt-5 max-w-3xl leading-8 text-slate-300">
            هذه النسخة تحول الموقع إلى Portfolio قابل للإدارة: تعديل البيانات، النصوص، المهارات، الخدمات، المشاريع، الألوان، شكل العرض، وإظهار أو إخفاء الأقسام من لوحة واحدة.
          </p>
        </div>

        <div className="mt-8">
          <DashboardLeadsPanel />
        </div>

        <div className="mt-8">
          <DashboardSettingsPanel />
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {[
            {
              icon: Database,
              title: "Database",
              text: "الإعدادات تحفظ في Neon عبر جدول SiteSetting بدون الحاجة لتعديل الكود.",
            },
            {
              icon: LockKeyhole,
              title: "Security",
              text: "الدخول للتعديل يعتمد على ADMIN_TOKEN الموجود في Vercel.",
            },
            {
              icon: Palette,
              title: "Design",
              text: "يمكن تغيير Theme وLayout من لوحة التحكم ثم حفظ التعديلات.",
            },
            {
              icon: Terminal,
              title: "API",
              text: "واجهة /api/settings مسؤولة عن قراءة وحفظ إعدادات الموقع.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="card-border rounded-3xl p-6">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyanBrand/10 text-cyanBrand">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-white">{item.title}</h2>
                <p className="mt-3 leading-8 text-slate-300">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
