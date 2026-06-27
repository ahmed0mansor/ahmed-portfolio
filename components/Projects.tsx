import type { LayoutVariant, SiteContent } from "@/lib/site-content";
import { LocalizedText } from "./LocalizedText";
import { SectionHeader } from "./SectionHeader";

type ProjectsProps = {
  content: SiteContent;
  contentEn: SiteContent;
  layoutVariant: LayoutVariant;
};

export function Projects({ content, contentEn, layoutVariant }: ProjectsProps) {
  const isCompact = layoutVariant === "compact";
  const isShowcase = layoutVariant === "showcase";
  const english = contentEn;

  return (
    <section id="projects" className={isCompact ? "py-12" : "py-20"}>
      <div className="container-shell">
        <SectionHeader
          {...content.projectsHeader}
          kickerEn={english.projectsHeader.kicker}
          titleEn={english.projectsHeader.title}
          subtitleEn={english.projectsHeader.subtitle}
        />
        <div className={`mt-10 grid gap-5 ${isShowcase ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
          {content.projects.map((project, index) => {
            const projectEn = english.projects[index];
            return (
              <article key={`${project.name}-${index}`} className="card-border rounded-3xl p-6 transition hover:-translate-y-1 hover:border-violetBrand/50">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-bold text-white"><LocalizedText ar={project.name} en={projectEn?.name || project.name} /></h3>
                  <span className="rounded-full bg-violetBrand/15 px-3 py-1 text-xs font-semibold text-violet-200">
                    <LocalizedText ar={project.status} en={projectEn?.status || project.status} />
                  </span>
                </div>
                <p className="mt-4 leading-8 text-slate-300"><LocalizedText ar={project.description} en={projectEn?.description || project.description} /></p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span key={tech} className="rounded-full border border-cyanBrand/20 bg-cyanBrand/10 px-3 py-1.5 text-xs text-cyan-100">
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
