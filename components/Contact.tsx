import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { LayoutVariant, SiteContent } from "@/lib/site-content";
import { LocalizedText } from "./LocalizedText";
import { SectionHeader } from "./SectionHeader";
import { WhatsAppLink } from "./WhatsAppLink";

type ContactProps = {
  content: SiteContent;
  contentEn: SiteContent;
  layoutVariant: LayoutVariant;
  whatsappButtonEnabled: boolean;
};

export function buildWhatsAppUrl(number: string, message: string) {
  const digits = number.replace(/\D/g, "");
  if (!digits) return "#contact";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message || "Hello")}`;
}

export function Contact({ content, contentEn, layoutVariant, whatsappButtonEnabled }: ContactProps) {
  const { profile, contact } = content;
  const english = contentEn;
  const isCompact = layoutVariant === "compact";
  const whatsappUrlAr = buildWhatsAppUrl(profile.whatsappNumber || profile.phone, contact.whatsappMessage);
  const whatsappUrlEn = buildWhatsAppUrl(english.profile.whatsappNumber || profile.whatsappNumber || profile.phone, english.contact.whatsappMessage);

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
        <div className="github-panel rounded-[2rem] p-6">
          <div className={`grid gap-4 ${whatsappButtonEnabled ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"}`}>
            <a href={`mailto:${profile.email}`} className="repo-card rounded-2xl p-4 transition hover:border-cyanBrand/40">
              <Mail className="h-5 w-5 text-cyanBrand" />
              <p className="mt-3 text-sm text-slate-400"><LocalizedText ar={contact.emailLabel} en={english.contact.emailLabel} /></p>
              <p className="mt-1 break-all text-sm font-semibold text-white">{profile.email}</p>
            </a>
            <a href={`tel:${profile.phone}`} className="repo-card rounded-2xl p-4 transition hover:border-cyanBrand/40">
              <Phone className="h-5 w-5 text-cyanBrand" />
              <p className="mt-3 text-sm text-slate-400"><LocalizedText ar={contact.phoneLabel} en={english.contact.phoneLabel} /></p>
              <p className="mt-1 text-sm font-semibold text-white">{profile.phone}</p>
            </a>
            {whatsappButtonEnabled ? (
              <WhatsAppLink
                hrefAr={whatsappUrlAr}
                hrefEn={whatsappUrlEn}
                className="whatsapp-link rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-50 transition hover:border-emerald-300/50"
                ariaLabel={contact.whatsappCta}
              >
                <MessageCircle className="h-5 w-5 text-emerald-300" />
                <p className="mt-3 text-sm text-emerald-200"><LocalizedText ar={contact.whatsappLabel} en={english.contact.whatsappLabel} /></p>
                <p className="mt-1 text-sm font-black text-white"><LocalizedText ar={contact.whatsappCta} en={english.contact.whatsappCta} /></p>
              </WhatsAppLink>
            ) : null}
            <div className="repo-card rounded-2xl p-4">
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
