import { Bot, CheckCircle2 } from "lucide-react";
import type { LayoutVariant, SiteContent } from "@/lib/site-content";
import { LocalizedText } from "./LocalizedText";
import { SectionHeader } from "./SectionHeader";

type AISectionProps = {
  content: SiteContent;
  contentEn: SiteContent;
  layoutVariant: LayoutVariant;
};

export function AISection({ content, contentEn, layoutVariant }: AISectionProps) {
  const ai = content.ai;
  const english = contentEn.ai;
  const isCompact = layoutVariant === "compact";

  return (
    <section id="assistant" className={isCompact ? "py-12" : "py-20"}>
      <div className="container-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <SectionHeader kicker={ai.kicker} title={ai.title} subtitle={ai.subtitle} kickerEn={english.kicker} titleEn={english.title} subtitleEn={english.subtitle} />
          <div className="mt-8 flex gap-3">
            <a href="#chat" className="btn-primary"><LocalizedText ar={ai.primaryCta} en={english.primaryCta} /></a>
          </div>
        </div>
        <div className="github-panel rounded-[2rem] p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-[1.15rem] border border-white/10 bg-cyanBrand/10 text-cyanBrand">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-white"><LocalizedText ar={ai.assistantTitle} en={english.assistantTitle} /></h3>
              <p className="text-sm text-slate-400"><LocalizedText ar={ai.assistantSubtitle} en={english.assistantSubtitle} /></p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {ai.processSteps.map((step, index) => (
              <div key={`${step}-${index}`} className="repo-row flex gap-3 p-4">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-cyanBrand" />
                <p className="leading-7 text-slate-300">
                  <span className="font-semibold text-white">{index + 1}. </span>
                  <LocalizedText ar={step} en={english.processSteps[index] || step} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
