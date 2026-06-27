import { About } from "@/components/About";
import { AIChatWidget } from "@/components/AIChatWidget";
import { AISection } from "@/components/AISection";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Projects } from "@/components/Projects";
import { Services } from "@/components/Services";
import { Skills } from "@/components/Skills";
import { SiteShell } from "@/components/SiteShell";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await getSiteSettings();
  const { content, contentEn, themeVariant, layoutVariant } = settings;

  return (
    <SiteShell
      initialThemeVariant={themeVariant}
      layoutVariant={layoutVariant}
      defaultLanguage={settings.defaultLanguage}
      colorRotationEnabled={settings.colorRotationEnabled}
      colorRotationIntervalSeconds={settings.colorRotationIntervalSeconds}
    >
      <Navbar cvDownloadEnabled={settings.cvDownloadEnabled} content={content} contentEn={contentEn} defaultLanguage={settings.defaultLanguage} />
      <Hero cvDownloadEnabled={settings.cvDownloadEnabled} content={content} contentEn={contentEn} layoutVariant={layoutVariant} />
      {content.sections.about ? <About content={content} contentEn={contentEn} layoutVariant={layoutVariant} /> : null}
      {content.sections.services ? <Services content={content} contentEn={contentEn} layoutVariant={layoutVariant} /> : null}
      {content.sections.skills ? <Skills content={content} contentEn={contentEn} layoutVariant={layoutVariant} /> : null}
      {content.sections.projects ? <Projects content={content} contentEn={contentEn} layoutVariant={layoutVariant} /> : null}
      {content.sections.assistant ? <AISection content={content} contentEn={contentEn} layoutVariant={layoutVariant} /> : null}
      {content.sections.contact ? <Contact content={content} contentEn={contentEn} layoutVariant={layoutVariant} /> : null}
      <Footer content={content} contentEn={contentEn} />
      {content.sections.chatWidget ? <AIChatWidget greeting={content.ai.chatGreeting} greetingEn={contentEn.ai.chatGreeting} /> : null}
    </SiteShell>
  );
}
