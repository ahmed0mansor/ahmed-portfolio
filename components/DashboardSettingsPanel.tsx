"use client";

import { useEffect, useState } from "react";
import { Download, Eye, Loader2, Palette, RefreshCcw, Save, ShieldCheck, SlidersHorizontal, Timer } from "lucide-react";
import {
  defaultSiteContent,
  languageVariants,
  layoutVariants,
  serviceIconKeys,
  themeVariants,
  type LayoutVariant,
  type SiteLanguage,
  type ServiceContent,
  type ServiceIconKey,
  type SiteContent,
  type ThemeVariant,
} from "@/lib/site-content";
import { englishSiteContent } from "@/lib/site-translations";
import type { SiteSettings } from "@/lib/site-settings";

type TabKey = "general" | "design" | "sections" | "content" | "lists" | "assistant";

type DashboardSettings = SiteSettings;

const tabItems: { key: TabKey; label: string }[] = [
  { key: "general", label: "البيانات" },
  { key: "design", label: "الألوان والشكل" },
  { key: "sections", label: "الأقسام" },
  { key: "content", label: "النصوص" },
  { key: "lists", label: "المهارات والمشاريع" },
  { key: "assistant", label: "AI" },
];

const themeLabels: Record<ThemeVariant, string> = {
  cyber: "Cyber Blue - الحالي",
  emerald: "Emerald Green",
  royal: "Royal Purple",
  sunset: "Sunset Orange",
};

const layoutLabels: Record<LayoutVariant, string> = {
  classic: "Classic - الحالي",
  compact: "Compact - مختصر",
  showcase: "Showcase - عرض أكبر",
};

const languageLabels: Record<SiteLanguage, string> = {
  ar: "العربية كلغة افتراضية",
  en: "English as default language",
};

const colorRotationLabels: Record<number, string> = {
  10: "كل 10 ثواني",
  15: "كل 15 ثانية",
};

function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatStats(stats: SiteContent["about"]["stats"]) {
  return stats.map((stat) => `${stat.value}|${stat.label}`).join("\n");
}

function parseStats(value: string): SiteContent["about"]["stats"] {
  return lines(value).map((line) => {
    const [statValue = "", label = ""] = line.split("|").map((part) => part.trim());
    return { value: statValue, label };
  }).filter((stat) => stat.value && stat.label);
}

function formatSkills(skills: SiteContent["skills"]) {
  return skills.map((skill) => `${skill.group}: ${skill.items.join(", ")}`).join("\n");
}

function parseSkills(value: string): SiteContent["skills"] {
  return lines(value).map((line) => {
    const [group = "", rawItems = ""] = line.split(":");
    return { group: group.trim(), items: splitCsv(rawItems) };
  }).filter((skill) => skill.group && skill.items.length);
}

function formatServices(services: SiteContent["services"]) {
  return services.map((service) => `${service.icon}|${service.title}|${service.description}`).join("\n");
}

function parseServices(value: string): SiteContent["services"] {
  return lines(value).map((line) => {
    const [rawIcon = "server", title = "", ...descriptionParts] = line.split("|");
    const icon = serviceIconKeys.includes(rawIcon.trim() as ServiceIconKey) ? (rawIcon.trim() as ServiceIconKey) : "server";
    return { icon, title: title.trim(), description: descriptionParts.join("|").trim() } satisfies ServiceContent;
  }).filter((service) => service.title && service.description);
}

function formatProjects(projects: SiteContent["projects"]) {
  return projects.map((project) => `${project.name}|${project.status}|${project.stack.join(", ")}|${project.description}`).join("\n");
}

function parseProjects(value: string): SiteContent["projects"] {
  return lines(value).map((line) => {
    const [name = "", status = "", stack = "", ...descriptionParts] = line.split("|");
    return {
      name: name.trim(),
      status: status.trim() || "Project",
      stack: splitCsv(stack),
      description: descriptionParts.join("|").trim(),
    };
  }).filter((project) => project.name && project.description);
}

function Field({ label, value, onChange, dir = "rtl", type = "text" }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "rtl" | "ltr";
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-200">{label}</span>
      <input
        type={type}
        value={value}
        dir={dir}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyanBrand/50"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, hint, dir = "rtl", rows = 5 }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  dir?: "rtl" | "ltr";
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-200">{label}</span>
      {hint ? <span className="mb-2 block text-xs leading-6 text-slate-400">{hint}</span> : null}
      <textarea
        value={value}
        dir={dir}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-cyanBrand/50"
      />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between rounded-2xl border p-4 text-right transition ${
        checked ? "border-cyanBrand/40 bg-cyanBrand/10 text-white" : "border-white/10 bg-white/[0.03] text-slate-300"
      }`}
    >
      <span className="font-semibold">{label}</span>
      <span className={`h-6 w-11 rounded-full p-1 transition ${checked ? "bg-cyanBrand" : "bg-slate-700"}`}>
        <span className={`block h-4 w-4 rounded-full bg-white transition ${checked ? "translate-x-[-20px]" : ""}`} />
      </span>
    </button>
  );
}

export function DashboardSettingsPanel() {
  const [token, setToken] = useState("");
  const [settings, setSettings] = useState<DashboardSettings | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [editorLanguage, setEditorLanguage] = useState<SiteLanguage>("ar");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedToken = window.sessionStorage.getItem("admin_token") || "";
    setToken(savedToken);
  }, []);

  async function loadSettings(currentToken = token) {
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/settings", {
        headers: { "x-admin-token": currentToken },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("رمز الإدارة غير صحيح أو لم يتم ضبط ADMIN_TOKEN في Vercel.");
      }

      const data = await response.json();
      setSettings(data.settings);
      window.sessionStorage.setItem("admin_token", currentToken);
      setMessage("تم تحميل إعدادات الموقع.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "فشل تحميل الإعدادات.");
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings(nextSettings = settings) {
    if (!nextSettings) return;
    setMessage("");
    setSaving(true);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(nextSettings),
      });

      if (!response.ok) {
        throw new Error("فشل حفظ الإعدادات. تحقق من ADMIN_TOKEN.");
      }

      const data = await response.json();
      setSettings(data.settings);
      setMessage("تم حفظ الإعدادات بنجاح. سيظهر التغيير في الموقع بعد تحديث الصفحة.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "فشل حفظ الإعدادات.");
    } finally {
      setSaving(false);
    }
  }

  function updateSettings(patch: Partial<DashboardSettings>) {
    setSettings((current) => (current ? { ...current, ...patch } : current));
  }

  function updateContent(patch: Partial<SiteContent>) {
    setSettings((current) => {
      if (!current) return current;
      const key = editorLanguage === "en" ? "contentEn" : "content";
      return { ...current, [key]: { ...current[key], ...patch } };
    });
  }

  function updateArabicContent(patch: Partial<SiteContent>) {
    setSettings((current) => (current ? { ...current, content: { ...current.content, ...patch } } : current));
  }

  function updateSharedProfile(patch: Partial<SiteContent["profile"]>) {
    setSettings((current) => {
      if (!current) return current;
      return {
        ...current,
        content: { ...current.content, profile: { ...current.content.profile, ...patch } },
        contentEn: { ...current.contentEn, profile: { ...current.contentEn.profile, ...patch } },
      };
    });
  }

  function updateProfile(patch: Partial<SiteContent["profile"]>) {
    if (!settings) return;
    updateContent({ profile: { ...content.profile, ...patch } });
  }

  function updateHero(patch: Partial<SiteContent["hero"]>) {
    if (!settings) return;
    updateContent({ hero: { ...content.hero, ...patch } });
  }

  function updateAbout(patch: Partial<SiteContent["about"]>) {
    if (!settings) return;
    updateContent({ about: { ...content.about, ...patch } });
  }

  function updateSectionHeader(key: "servicesHeader" | "skillsHeader" | "projectsHeader", patch: Partial<SiteContent[typeof key]>) {
    if (!settings) return;
    updateContent({ [key]: { ...content[key], ...patch } } as Partial<SiteContent>);
  }

  function updateAI(patch: Partial<SiteContent["ai"]>) {
    if (!settings) return;
    updateContent({ ai: { ...content.ai, ...patch } });
  }

  function updateContact(patch: Partial<SiteContent["contact"]>) {
    if (!settings) return;
    updateContent({ contact: { ...content.contact, ...patch } });
  }

  const content = editorLanguage === "en"
    ? settings?.contentEn ?? englishSiteContent
    : settings?.content ?? defaultSiteContent;
  const sharedContent = settings?.content ?? defaultSiteContent;
  const isEnglishEditor = editorLanguage === "en";

  return (
    <div className="card-border rounded-[2rem] p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-kicker">Full Site Control</p>
          <h2 className="mt-2 text-2xl font-black text-white">لوحة تحكم كاملة بالموقع</h2>
          <p className="mt-3 max-w-3xl leading-8 text-slate-300">
            تحكم في بياناتك، الألوان، شكل العرض، إظهار الأقسام، السيرة الذاتية، المهارات، الخدمات، المشاريع، ونصوص المساعد الذكي بدون تعديل الكود.
          </p>
        </div>
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyanBrand/10 text-cyanBrand">
          <ShieldCheck className="h-7 w-7" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
        <input
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="ضع ADMIN_TOKEN هنا"
          className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyanBrand/50"
          dir="ltr"
          type="password"
          autoComplete="off"
          maxLength={200}
        />
        <button onClick={() => loadSettings()} disabled={loading || !token} className="btn-primary gap-2 disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          تحميل الإعدادات
        </button>
      </div>

      {settings ? (
        <>
          <div className="mt-6 flex flex-wrap gap-2">
            {tabItems.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab.key ? "bg-cyanBrand text-slate-950" : "border border-white/10 text-slate-300 hover:border-cyanBrand/40"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <span className="text-sm font-bold text-white">لغة المحتوى التي تعدّلها الآن:</span>
            <button
              type="button"
              onClick={() => setEditorLanguage("ar")}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${editorLanguage === "ar" ? "bg-cyanBrand text-slate-950" : "border border-white/10 text-slate-300 hover:border-cyanBrand/40"}`}
            >
              العربية
            </button>
            <button
              type="button"
              onClick={() => setEditorLanguage("en")}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${editorLanguage === "en" ? "bg-cyanBrand text-slate-950" : "border border-white/10 text-slate-300 hover:border-cyanBrand/40"}`}
            >
              English
            </button>
            <span className="text-xs leading-6 text-slate-400">يمكنك تعديل العربي والإنجليزي بشكل منفصل. الهاتف والبريد واللوجو يتم تطبيقها على اللغتين.</span>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            {activeTab === "general" ? (
              <div className="grid gap-4 md:grid-cols-2">
                {isEnglishEditor ? (
                  <>
                    <Field label="Name (English)" value={content.profile.nameEn} onChange={(value) => updateProfile({ nameEn: value, nameAr: value })} dir="ltr" />
                    <Field label="Professional Title (English)" value={content.profile.titleEn} onChange={(value) => updateProfile({ titleEn: value, titleAr: value })} dir="ltr" />
                    <Field label="Location (English)" value={content.profile.location} onChange={(value) => updateProfile({ location: value })} dir="ltr" />
                  </>
                ) : (
                  <>
                    <Field label="الاسم بالعربي" value={content.profile.nameAr} onChange={(value) => updateProfile({ nameAr: value })} />
                    <Field label="العنوان المهني بالعربي" value={content.profile.titleAr} onChange={(value) => updateProfile({ titleAr: value })} />
                    <Field label="الموقع بالعربي" value={content.profile.location} onChange={(value) => updateProfile({ location: value })} />
                  </>
                )}
                <Field label="اختصار اللوجو" value={sharedContent.profile.logoText} onChange={(value) => updateSharedProfile({ logoText: value })} dir="ltr" />
                <Field label="رقم الهاتف" value={sharedContent.profile.phone} onChange={(value) => updateSharedProfile({ phone: value })} dir="ltr" />
                <Field label="رقم واتساب بصيغة دولية" value={sharedContent.profile.whatsappNumber} onChange={(value) => updateSharedProfile({ whatsappNumber: value })} dir="ltr" />
                <Field label="البريد الإلكتروني" value={sharedContent.profile.email} onChange={(value) => updateSharedProfile({ email: value })} dir="ltr" />
                <Field label="رابط CV" value={sharedContent.profile.cvUrl} onChange={(value) => updateSharedProfile({ cvUrl: value })} dir="ltr" />
              </div>
            ) : null}

            {activeTab === "design" ? (
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-cyanBrand" />
                    <h3 className="font-bold text-white">ألوان الموقع</h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    اختر اللون الثابت الأساسي. عند تفعيل التغيير التلقائي سيبدأ الموقع من هذا اللون ثم يمر على جميع التصاميم اللونية المتاحة.
                  </p>
                  <div className="mt-4 grid gap-3">
                    {themeVariants.map((theme) => (
                      <button
                        key={theme}
                        onClick={() => updateSettings({ themeVariant: theme })}
                        className={`rounded-2xl border p-4 text-right ${settings.themeVariant === theme ? "border-cyanBrand/50 bg-cyanBrand/10" : "border-white/10 bg-white/[0.03]"}`}
                      >
                        {themeLabels[theme]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="h-5 w-5 text-cyanBrand" />
                    <h3 className="font-bold text-white">شكل عرض الموقع واللغة</h3>
                  </div>
                  <div className="mt-4 grid gap-3">
                    {layoutVariants.map((layout) => (
                      <button
                        key={layout}
                        onClick={() => updateSettings({ layoutVariant: layout })}
                        className={`rounded-2xl border p-4 text-right ${settings.layoutVariant === layout ? "border-cyanBrand/50 bg-cyanBrand/10" : "border-white/10 bg-white/[0.03]"}`}
                      >
                        {layoutLabels[layout]}
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <h4 className="font-bold text-white">اللغة الافتراضية للموقع</h4>
                    <p className="mt-2 text-sm leading-7 text-slate-400">سيظهر زر عربي / EN للزائر، وهذا الخيار يحدد اللغة التي تظهر أولًا.</p>
                    <div className="mt-4 grid gap-3">
                      {languageVariants.map((language) => (
                        <button
                          key={language}
                          type="button"
                          onClick={() => updateSettings({ defaultLanguage: language })}
                          className={`rounded-2xl border p-4 text-right ${settings.defaultLanguage === language ? "border-cyanBrand/50 bg-cyanBrand/10" : "border-white/10 bg-white/[0.03]"}`}
                        >
                          {languageLabels[language]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 lg:col-span-2">
                  <div className="flex items-center gap-3">
                    <RefreshCcw className="h-5 w-5 text-cyanBrand" />
                    <h3 className="font-bold text-white">تغيير الألوان تلقائيًا</h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    هذا الخيار يجعل الموقع يبدّل الألوان تلقائيًا ويمر على كل التصاميم اللونية الموجودة: Cyber Blue، Emerald Green، Royal Purple، Sunset Orange.
                  </p>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <Toggle
                      label="تفعيل دوران الألوان"
                      checked={settings.colorRotationEnabled}
                      onChange={(value) => updateSettings({ colorRotationEnabled: value })}
                    />
                    {[10, 15].map((seconds) => (
                      <button
                        key={seconds}
                        type="button"
                        onClick={() => updateSettings({ colorRotationIntervalSeconds: seconds })}
                        className={`rounded-2xl border p-4 text-right transition ${
                          settings.colorRotationIntervalSeconds === seconds
                            ? "border-cyanBrand/50 bg-cyanBrand/10 text-white"
                            : "border-white/10 bg-white/[0.03] text-slate-300"
                        }`}
                      >
                        <span className="flex items-center gap-2 font-semibold">
                          <Timer className="h-4 w-4 text-cyanBrand" />
                          {colorRotationLabels[seconds]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "sections" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Toggle label="إظهار زر تحميل السيرة الذاتية CV" checked={settings.cvDownloadEnabled} onChange={(value) => updateSettings({ cvDownloadEnabled: value })} />
                <Toggle label="إظهار زر واتساب المباشر" checked={settings.whatsappButtonEnabled} onChange={(value) => updateSettings({ whatsappButtonEnabled: value })} />
                {Object.entries(sharedContent.sections).map(([key, value]) => (
                  <Toggle
                    key={key}
                    label={`إظهار قسم ${key}`}
                    checked={Boolean(value)}
                    onChange={(checked) => updateArabicContent({ sections: { ...sharedContent.sections, [key]: checked } })}
                  />
                ))}
              </div>
            ) : null}

            {activeTab === "content" ? (
              <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Hero Badge" value={content.hero.badge} onChange={(value) => updateHero({ badge: value })} dir="ltr" />
                  <Field label="Hero Highlight Title" value={content.hero.highlightedTitle} onChange={(value) => updateHero({ highlightedTitle: value })} dir="ltr" />
                  <Field label="زر المشاريع" value={content.hero.primaryCta} onChange={(value) => updateHero({ primaryCta: value })} />
                  <Field label="زر AI" value={content.hero.secondaryCta} onChange={(value) => updateHero({ secondaryCta: value })} />
                  <Field label="زر CV" value={content.hero.cvCta} onChange={(value) => updateHero({ cvCta: value })} />
                  <Field label="عنوان بطاقة التركيز" value={content.hero.focusTitle} onChange={(value) => updateHero({ focusTitle: value })} />
                </div>
                <TextArea label="وصف Hero" value={content.hero.description} onChange={(value) => updateHero({ description: value })} rows={3} />
                <TextArea label="عناصر Current Focus" value={content.hero.focusItems.join("\n")} onChange={(value) => updateHero({ focusItems: lines(value) })} hint="اكتب كل عنصر في سطر مستقل." dir="ltr" />

                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="About Kicker" value={content.about.kicker} onChange={(value) => updateAbout({ kicker: value })} dir="ltr" />
                  <Field label="About Title" value={content.about.title} onChange={(value) => updateAbout({ title: value })} />
                  <Field label="About Subtitle" value={content.about.subtitle} onChange={(value) => updateAbout({ subtitle: value })} />
                </div>
                <TextArea label="فقرات About" value={content.about.paragraphs.join("\n")} onChange={(value) => updateAbout({ paragraphs: lines(value) })} hint="كل فقرة في سطر مستقل." rows={4} />
                <TextArea label="إحصائيات About" value={formatStats(content.about.stats)} onChange={(value) => updateAbout({ stats: parseStats(value) })} hint="الصيغة: القيمة|العنوان مثال: 95%|GPA" dir="ltr" rows={4} />

                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Footer Text" value={content.footer.text} onChange={(value) => updateContent({ footer: { text: value } })} dir="ltr" />
                  <Field label="Contact Title" value={content.contact.title} onChange={(value) => updateContact({ title: value })} />
                  <Field label="Contact Subtitle" value={content.contact.subtitle} onChange={(value) => updateContact({ subtitle: value })} />
                  <Field label="تسمية واتساب" value={content.contact.whatsappLabel} onChange={(value) => updateContact({ whatsappLabel: value })} />
                  <Field label="زر واتساب" value={content.contact.whatsappCta} onChange={(value) => updateContact({ whatsappCta: value })} />
                  <Field label="رسالة واتساب الجاهزة" value={content.contact.whatsappMessage} onChange={(value) => updateContact({ whatsappMessage: value })} />
                </div>
              </div>
            ) : null}

            {activeTab === "lists" ? (
              <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Services Kicker" value={content.servicesHeader.kicker} onChange={(value) => updateSectionHeader("servicesHeader", { kicker: value })} dir="ltr" />
                  <Field label="Services Title" value={content.servicesHeader.title} onChange={(value) => updateSectionHeader("servicesHeader", { title: value })} />
                  <Field label="Services Subtitle" value={content.servicesHeader.subtitle} onChange={(value) => updateSectionHeader("servicesHeader", { subtitle: value })} />
                </div>
                <TextArea
                  label="الخدمات"
                  value={formatServices(content.services)}
                  onChange={(value) => updateContent({ services: parseServices(value) })}
                  hint={`الصيغة: icon|title|description. الأيقونات المتاحة: ${serviceIconKeys.join(", ")}`}
                  rows={7}
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Skills Kicker" value={content.skillsHeader.kicker} onChange={(value) => updateSectionHeader("skillsHeader", { kicker: value })} dir="ltr" />
                  <Field label="Skills Title" value={content.skillsHeader.title} onChange={(value) => updateSectionHeader("skillsHeader", { title: value })} />
                  <Field label="Skills Subtitle" value={content.skillsHeader.subtitle} onChange={(value) => updateSectionHeader("skillsHeader", { subtitle: value })} />
                </div>
                <TextArea label="المهارات" value={formatSkills(content.skills)} onChange={(value) => updateContent({ skills: parseSkills(value) })} hint="الصيغة: Group: item1, item2, item3" dir="ltr" rows={7} />

                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Projects Kicker" value={content.projectsHeader.kicker} onChange={(value) => updateSectionHeader("projectsHeader", { kicker: value })} dir="ltr" />
                  <Field label="Projects Title" value={content.projectsHeader.title} onChange={(value) => updateSectionHeader("projectsHeader", { title: value })} />
                  <Field label="Projects Subtitle" value={content.projectsHeader.subtitle} onChange={(value) => updateSectionHeader("projectsHeader", { subtitle: value })} />
                </div>
                <TextArea label="المشاريع" value={formatProjects(content.projects)} onChange={(value) => updateContent({ projects: parseProjects(value) })} hint="الصيغة: name|status|tech1, tech2|description" rows={8} />
              </div>
            ) : null}

            {activeTab === "assistant" ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="AI Kicker" value={content.ai.kicker} onChange={(value) => updateAI({ kicker: value })} dir="ltr" />
                  <Field label="AI Title" value={content.ai.title} onChange={(value) => updateAI({ title: value })} />
                  <Field label="AI Subtitle" value={content.ai.subtitle} onChange={(value) => updateAI({ subtitle: value })} />
                  <Field label="Assistant Card Title" value={content.ai.assistantTitle} onChange={(value) => updateAI({ assistantTitle: value })} dir="ltr" />
                  <Field label="Assistant Card Subtitle" value={content.ai.assistantSubtitle} onChange={(value) => updateAI({ assistantSubtitle: value })} dir="ltr" />
                  <Field label="زر المحادثة" value={content.ai.primaryCta} onChange={(value) => updateAI({ primaryCta: value })} />
                </div>
                <TextArea label="رسالة بداية الشات" value={content.ai.chatGreeting} onChange={(value) => updateAI({ chatGreeting: value })} rows={3} />
                <TextArea label="خطوات AI" value={content.ai.processSteps.join("\n")} onChange={(value) => updateAI({ processSteps: lines(value) })} hint="كل خطوة في سطر مستقل." rows={6} />
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button disabled={saving} onClick={() => saveSettings()} className="btn-primary gap-2 disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              حفظ كل التعديلات
            </button>
            <a href="/" target="_blank" className="btn-secondary gap-2" rel="noreferrer">
              <Eye className="h-4 w-4" /> معاينة الموقع
            </a>
            <a href={content.profile.cvUrl} target="_blank" className="btn-secondary gap-2" rel="noreferrer">
              <Download className="h-4 w-4" /> اختبار تحميل CV
            </a>
          </div>
        </>
      ) : null}

      {message ? (
        <div className="mt-5 rounded-2xl border border-cyanBrand/20 bg-cyanBrand/10 p-4 text-sm leading-7 text-cyan-50">
          {message}
        </div>
      ) : null}
    </div>
  );
}
