import type { SiteContent, SiteLanguage } from "@/lib/site-content";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LocalizedText } from "./LocalizedText";

const navItems = [
  { key: "home", labelAr: "الرئيسية", labelEn: "Home", href: "#home" },
  { key: "about", labelAr: "نبذة", labelEn: "About", href: "#about" },
  { key: "services", labelAr: "الخدمات", labelEn: "Services", href: "#services" },
  { key: "projects", labelAr: "المشاريع", labelEn: "Projects", href: "#projects" },
  { key: "assistant", labelAr: "المساعد الذكي", labelEn: "AI Assistant", href: "#assistant" },
  { key: "contact", labelAr: "تواصل", labelEn: "Contact", href: "#contact" },
] as const;

type NavbarProps = {
  cvDownloadEnabled: boolean;
  content: SiteContent;
  contentEn: SiteContent;
  defaultLanguage: SiteLanguage;
};

export function Navbar({ cvDownloadEnabled, content, contentEn, defaultLanguage }: NavbarProps) {
  const { profile, sections, hero } = content;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="container-shell flex h-16 items-center justify-between gap-4">
        <a href="#home" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-cyanBrand text-base font-black text-slate-950 shadow-glow">
            {profile.logoText || "AQ"}
          </span>
          <span className="hidden text-sm font-bold text-white sm:block">
            <LocalizedText ar={profile.nameAr} en={contentEn.profile.nameEn || profile.nameEn} />
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => {
            if (item.key !== "home" && item.key !== "contact" && !(sections as Record<string, boolean>)[item.key]) return null;
            if (item.key === "contact" && !sections.contact) return null;
            return (
              <a key={item.href} href={item.href} className="text-sm text-slate-300 transition hover:text-cyanBrand">
                <LocalizedText ar={item.labelAr} en={item.labelEn} />
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher defaultLanguage={defaultLanguage} />
          {cvDownloadEnabled ? (
            <a href={profile.cvUrl} className="btn-secondary py-2" target="_blank" rel="noreferrer">
              <LocalizedText ar={hero.cvCta || "تحميل CV"} en={contentEn.hero.cvCta || "Download CV"} />
            </a>
          ) : (
            <a href="#contact" className="btn-secondary py-2">
              <LocalizedText ar="تواصل" en="Contact" />
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}
