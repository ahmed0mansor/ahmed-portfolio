"use client";

import { useEffect, useState } from "react";
import type { SiteLanguage } from "@/lib/site-content";

type LanguageSwitcherProps = {
  defaultLanguage: SiteLanguage;
};

function readLanguage(defaultLanguage: SiteLanguage): SiteLanguage {
  if (typeof window === "undefined") return defaultLanguage;
  const saved = window.localStorage.getItem("site_language");
  return saved === "en" || saved === "ar" ? saved : defaultLanguage;
}

export function LanguageSwitcher({ defaultLanguage }: LanguageSwitcherProps) {
  const [language, setLanguage] = useState<SiteLanguage>(defaultLanguage);

  useEffect(() => {
    setLanguage(readLanguage(defaultLanguage));
  }, [defaultLanguage]);

  function changeLanguage(nextLanguage: SiteLanguage) {
    setLanguage(nextLanguage);
    window.localStorage.setItem("site_language", nextLanguage);
    window.dispatchEvent(new CustomEvent("site-language-change", { detail: nextLanguage }));
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs font-bold text-slate-200">
      <button
        type="button"
        onClick={() => changeLanguage("ar")}
        className={`rounded-full px-3 py-1.5 transition ${language === "ar" ? "bg-cyanBrand text-slate-950" : "hover:text-cyanBrand"}`}
        aria-pressed={language === "ar"}
      >
        عربي
      </button>
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`rounded-full px-3 py-1.5 transition ${language === "en" ? "bg-cyanBrand text-slate-950" : "hover:text-cyanBrand"}`}
        aria-pressed={language === "en"}
      >
        EN
      </button>
    </div>
  );
}
