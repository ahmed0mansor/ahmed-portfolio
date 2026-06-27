import { Bot, BriefcaseBusiness, Home, Layers3, MessageCircle } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";
import { LocalizedText } from "./LocalizedText";

type MobileBottomNavProps = {
  content: SiteContent;
};

const navItems = [
  { key: "home", href: "#home", icon: Home, labelAr: "الرئيسية", labelEn: "Home" },
  { key: "services", href: "#services", icon: Layers3, labelAr: "الخدمات", labelEn: "Services" },
  { key: "projects", href: "#projects", icon: BriefcaseBusiness, labelAr: "المشاريع", labelEn: "Projects" },
  { key: "assistant", href: "#assistant", icon: Bot, labelAr: "المساعد", labelEn: "AI" },
  { key: "contact", href: "#contact", icon: MessageCircle, labelAr: "تواصل", labelEn: "Contact" },
] as const;

export function MobileBottomNav({ content }: MobileBottomNavProps) {
  return (
    <nav className="mobile-bottom-nav xl:hidden" aria-label="Mobile quick navigation">
      {navItems.map((item) => {
        if (item.key !== "home" && !(content.sections as Record<string, boolean>)[item.key]) return null;
        const Icon = item.icon;
        return (
          <a key={item.key} href={item.href} className="mobile-bottom-nav__item">
            <Icon className="h-5 w-5" />
            <span><LocalizedText ar={item.labelAr} en={item.labelEn} /></span>
          </a>
        );
      })}
    </nav>
  );
}
