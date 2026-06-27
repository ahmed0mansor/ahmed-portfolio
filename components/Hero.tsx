import { ArrowLeft, Download, Sparkles } from "lucide-react";
import type { LayoutVariant, SiteContent } from "@/lib/site-content";
import { LocalizedText } from "./LocalizedText";

type HeroProps = {
  cvDownloadEnabled: boolean;
  content: SiteContent;
  contentEn: SiteContent;
  layoutVariant: LayoutVariant;
};

export function Hero({ cvDownloadEnabled, content, contentEn, layoutVariant }: HeroProps) {
  const { profile, hero } = content;
  const english = contentEn;
  const isCompact = layoutVariant === "compact";
  const isShowcase = layoutVariant === "showcase";

  return (
    <section id="home" className={`relative overflow-hidden ${isCompact ? "py-14 md:py-18" : "py-20 md:py-28"}`}>
      <div className="absolute inset-0 -z-10 bg-grid bg-[size:36px_36px] opacity-40" />
      <div className={`container-shell grid items-center gap-12 ${isShowcase ? "lg:grid-cols-[0.85fr_1.15fr]" : "lg:grid-cols-[1.1fr_0.9fr]"}`}>
        <div className={isShowcase ? "order-2 lg:order-1" : ""}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyanBrand/30 bg-cyanBrand/10 px-4 py-2 text-sm text-cyan-100">
            <Sparkles className="h-4 w-4" />
            <LocalizedText ar={hero.badge} en={english.hero.badge} />
          </div>
          <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
            <LocalizedText ar={profile.nameAr} en={english.profile.nameEn || profile.nameEn} />
            <span className="mt-3 block text-3xl md:text-5xl gradient-text">
              <LocalizedText ar={hero.highlightedTitle} en={english.hero.highlightedTitle} />
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-300">
            <LocalizedText ar={profile.titleAr} en={english.profile.titleEn || profile.titleEn} />
          </p>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
            <LocalizedText ar={hero.description} en={english.hero.description} />
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="btn-primary gap-2">
              <LocalizedText ar={hero.primaryCta} en={english.hero.primaryCta} /> <ArrowLeft className="h-4 w-4 rtl-icon" />
            </a>
            {content.sections.assistant ? (
              <a href="#assistant" className="btn-secondary gap-2">
                <LocalizedText ar={hero.secondaryCta} en={english.hero.secondaryCta} />
              </a>
            ) : null}
            {cvDownloadEnabled ? (
              <a href={profile.cvUrl} className="btn-secondary gap-2" target="_blank" rel="noreferrer">
                <Download className="h-4 w-4" /> <LocalizedText ar={hero.cvCta} en={english.hero.cvCta} />
              </a>
            ) : null}
          </div>
        </div>

        {!isCompact ? (
          <div className={`card-border relative rounded-[2rem] p-6 shadow-glow ${isShowcase ? "order-1 lg:order-2" : ""}`}>
            <div className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-cyanBrand/20 blur-3xl" />
            <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-violetBrand/20 blur-3xl" />
            <div className="relative rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-6">
              <p className="text-sm text-cyanBrand"><LocalizedText ar={hero.focusKicker} en={english.hero.focusKicker} /></p>
              <h2 className="mt-3 text-2xl font-bold text-white"><LocalizedText ar={hero.focusTitle} en={english.hero.focusTitle} /></h2>
              <div className="mt-6 space-y-4">
                {hero.focusItems.map((item, index) => (
                  <div key={`${item}-${index}`} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-start">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-cyanBrand" />
                    <span className="text-sm text-slate-200"><LocalizedText ar={item} en={english.hero.focusItems[index] || item} /></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
