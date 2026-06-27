"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { SiteLanguage } from "@/lib/site-content";

type WhatsAppLinkProps = {
  hrefAr: string;
  hrefEn: string;
  className?: string;
  title?: string;
  ariaLabel?: string;
  children: ReactNode;
};

function getLanguage(): SiteLanguage {
  if (typeof window === "undefined") return "ar";
  const rootLanguage = document.documentElement.lang;
  if (rootLanguage === "en" || rootLanguage === "ar") return rootLanguage;
  const saved = window.localStorage.getItem("site_language");
  return saved === "en" || saved === "ar" ? saved : "ar";
}

export function WhatsAppLink({ hrefAr, hrefEn, className, title, ariaLabel, children }: WhatsAppLinkProps) {
  const [language, setLanguage] = useState<SiteLanguage>("ar");

  useEffect(() => {
    setLanguage(getLanguage());

    function handleLanguageChange(event: Event) {
      const nextLanguage = (event as CustomEvent<SiteLanguage>).detail;
      if (nextLanguage === "ar" || nextLanguage === "en") setLanguage(nextLanguage);
    }

    window.addEventListener("site-language-change", handleLanguageChange);
    return () => window.removeEventListener("site-language-change", handleLanguageChange);
  }, []);

  return (
    <a
      href={language === "en" ? hrefEn : hrefAr}
      target="_blank"
      rel="noreferrer"
      className={className}
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
