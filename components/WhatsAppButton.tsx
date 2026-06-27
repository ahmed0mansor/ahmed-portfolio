import { MessageCircle } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";
import { buildWhatsAppUrl } from "./Contact";
import { LocalizedText } from "./LocalizedText";
import { WhatsAppLink } from "./WhatsAppLink";

type WhatsAppButtonProps = {
  content: SiteContent;
  contentEn: SiteContent;
};

export function WhatsAppButton({ content, contentEn }: WhatsAppButtonProps) {
  const numberAr = content.profile.whatsappNumber || content.profile.phone;
  const numberEn = contentEn.profile.whatsappNumber || numberAr;
  const whatsappUrlAr = buildWhatsAppUrl(numberAr, content.contact.whatsappMessage);
  const whatsappUrlEn = buildWhatsAppUrl(numberEn, contentEn.contact.whatsappMessage);

  return (
    <WhatsAppLink
      hrefAr={whatsappUrlAr}
      hrefEn={whatsappUrlEn}
      className="whatsapp-widget fixed bottom-6 z-50 grid h-14 w-14 place-items-center rounded-[1.25rem] bg-emerald-400 text-slate-950 shadow-glow transition hover:-translate-y-1 hover:bg-emerald-300"
      ariaLabel="WhatsApp"
      title={content.contact.whatsappCta}
    >
      <span className="sr-only"><LocalizedText ar={content.contact.whatsappCta} en={contentEn.contact.whatsappCta} /></span>
      <MessageCircle className="h-6 w-6" />
    </WhatsAppLink>
  );
}
