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
              <article key={`${service.title}-${index}`} className="card-border rounded-3xl p-6 transition hover:-translate-y-1 hover:border-cyanBrand/40">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyanBrand/10 text-cyanBrand">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white"><LocalizedText ar={service.title} en={serviceEn?.title || service.title} /></h3>
                <p className="mt-3 leading-8 text-slate-300"><LocalizedText ar={service.description} en={serviceEn?.description || service.description} /></p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
