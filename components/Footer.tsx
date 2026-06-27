import type { SiteContent } from "@/lib/site-content";
import { LocalizedText } from "./LocalizedText";

type FooterProps = {
  content: SiteContent;
  contentEn: SiteContent;
};

export function Footer({ content, contentEn }: FooterProps) {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="container-shell flex flex-col gap-3 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <p><LocalizedText ar={content.footer.text} en={contentEn.footer.text} /></p>
        <a href="#home" className="text-cyanBrand hover:text-cyan-200"><LocalizedText ar="العودة للأعلى" en="Back to top" /></a>
      </div>
    </footer>
  );
}
