import type { LayoutVariant, SiteContent } from "@/lib/site-content";
import { LocalizedText } from "./LocalizedText";
import { SectionHeader } from "./SectionHeader";

type AboutProps = {
  content: SiteContent;
  contentEn: SiteContent;
  layoutVariant: LayoutVariant;
};

export function About({ content, contentEn, layoutVariant }: AboutProps) {
  const about = content.about;
  const english = contentEn.about;
  const isCompact = layoutVariant === "compact";

  return (
    <section id="about" className={isCompact ? "py-12" : "py-20"}>
      <div className="container-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeader
          kicker={about.kicker}
          title={about.title}
          subtitle={about.subtitle}
          kickerEn={english.kicker}
          titleEn={english.title}
          subtitleEn={english.subtitle}
        />
        <div className="card-border rounded-[2rem] p-7 leading-8 text-slate-300">
          {about.paragraphs.map((paragraph, index) => (
            <p key={`${paragraph}-${index}`} className="mt-5 first:mt-0">
              <LocalizedText ar={paragraph} en={english.paragraphs[index] || paragraph} />
            </p>
          ))}
          {about.stats.length ? (
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {about.stats.map((stat, index) => (
                <div key={`${stat.value}-${stat.label}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="mt-1 text-sm text-slate-400"><LocalizedText ar={stat.label} en={english.stats[index]?.label || stat.label} /></div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
