import { Mail, MapPin, Phone } from "lucide-react";
import type { LayoutVariant, SiteContent } from "@/lib/site-content";
import { LocalizedText } from "./LocalizedText";
import { SectionHeader } from "./SectionHeader";

type ContactProps = {
  content: SiteContent;
  contentEn: SiteContent;
  layoutVariant: LayoutVariant;
};

export function Contact({ content, contentEn, layoutVariant }: ContactProps) {
  const { profile, contact } = content;
  const english = contentEn;
  const isCompact = layoutVariant === "compact";

  return (
    <section id="contact" className={isCompact ? "py-12" : "py-20"}>
      <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeader
          kicker={contact.kicker}
          title={contact.title}
          subtitle={contact.subtitle}
          kickerEn={english.contact.kicker}
          titleEn={english.contact.title}
          subtitleEn={english.contact.subtitle}
        />
        <div className="card-border rounded-[2rem] p-7">
          <div className="grid gap-4 sm:grid-cols-3">
            <a href={`mailto:${profile.email}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-cyanBrand/40">
              <Mail className="h-5 w-5 text-cyanBrand" />
              <p className="mt-3 text-sm text-slate-400"><LocalizedText ar={contact.emailLabel} en={english.contact.emailLabel} /></p>
              <p className="mt-1 break-all text-sm font-semibold text-white">{profile.email}</p>
            </a>
            <a href={`tel:${profile.phone}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-cyanBrand/40">
              <Phone className="h-5 w-5 text-cyanBrand" />
              <p className="mt-3 text-sm text-slate-400"><LocalizedText ar={contact.phoneLabel} en={english.contact.phoneLabel} /></p>
              <p className="mt-1 text-sm font-semibold text-white">{profile.phone}</p>
            </a>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <MapPin className="h-5 w-5 text-cyanBrand" />
              <p className="mt-3 text-sm text-slate-400"><LocalizedText ar={contact.locationLabel} en={english.contact.locationLabel} /></p>
              <p className="mt-1 text-sm font-semibold text-white"><LocalizedText ar={profile.location} en={english.profile.location} /></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
