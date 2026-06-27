import type { LayoutVariant, SiteContent } from "@/lib/site-content";
import { LocalizedText } from "./LocalizedText";
import { SectionHeader } from "./SectionHeader";
import { serviceIconMap } from "./icon-map";

type ServicesProps = {
  content: SiteContent;
  contentEn: SiteContent;
  layoutVariant: LayoutVariant;
};

export function Services({ content, contentEn, layoutVariant }: ServicesProps) {
  const isCompact = layoutVariant === "compact";
  const isShowcase = layoutVariant === "showcase";
  const english = contentEn;

  return (
    <section id="services" className={isCompact ? "py-12" : "py-20"}>
      <div className="container-shell">
        <SectionHeader
          {...content.servicesHeader}
          kickerEn={english.servicesHeader.kicker}
          titleEn={english.servicesHeader.title}
          subtitleEn={english.servicesHeader.subtitle}
        />
        <div className={`mt-10 grid gap-5 md:grid-cols-2 ${isShowcase ? "xl:grid-cols-4" : "lg:grid-cols-3"}`}>
          {content.services.map((service, index) => {
            const Icon = serviceIconMap[service.icon] ?? serviceIconMap.server;
            const serviceEn = english.services[index];
            return (
              <article key={`${service.title}-${index}`} className="repo-card group rounded-3xl p-6 transition hover:-translate-y-1 hover:border-cyanBrand/40">
                <div className="grid h-12 w-12 place-items-center rounded-[1.15rem] border border-white/10 bg-cyanBrand/10 text-cyanBrand transition group-hover:scale-105">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyanBrand" />
                  <span><LocalizedText ar={`خدمة ${String(index + 1).padStart(2, "0")}`} en={`Service ${String(index + 1).padStart(2, "0")}`} /></span>
                </div>
                <h3 className="mt-2 text-xl font-black text-white"><LocalizedText ar={service.title} en={serviceEn?.title || service.title} /></h3>
                <p className="mt-3 leading-8 text-slate-300/95"><LocalizedText ar={service.description} en={serviceEn?.description || service.description} /></p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
