import type { LayoutVariant, SiteContent } from "@/lib/site-content";
import { LocalizedText } from "./LocalizedText";
import { SectionHeader } from "./SectionHeader";

type SkillsProps = {
  content: SiteContent;
  contentEn: SiteContent;
  layoutVariant: LayoutVariant;
};

export function Skills({ content, contentEn, layoutVariant }: SkillsProps) {
  const isCompact = layoutVariant === "compact";
  const english = contentEn;

  return (
    <section id="skills" className={isCompact ? "py-12" : "py-20"}>
      <div className="container-shell">
        <SectionHeader
          {...content.skillsHeader}
          kickerEn={english.skillsHeader.kicker}
          titleEn={english.skillsHeader.title}
          subtitleEn={english.skillsHeader.subtitle}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {content.skills.map((skill, index) => {
            const skillEn = english.skills[index];
            return (
              <div key={`${skill.group}-${index}`} className="card-border rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white"><LocalizedText ar={skill.group} en={skillEn?.group || skill.group} /></h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {skill.items.map((item, itemIndex) => (
                    <span key={`${item}-${itemIndex}`} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200">
                      <LocalizedText ar={item} en={skillEn?.items[itemIndex] || item} />
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
