"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { languageVariants, themeVariants, type LayoutVariant, type SiteLanguage, type ThemeVariant } from "@/lib/site-content";

type SiteShellProps = {
  initialThemeVariant: ThemeVariant;
  layoutVariant: LayoutVariant;
  defaultLanguage: SiteLanguage;
  colorRotationEnabled: boolean;
  colorRotationIntervalSeconds: number;
  children: ReactNode;
};

const allowedIntervals = [10, 15] as const;

function normalizeInterval(value: number) {
  return allowedIntervals.includes(value as (typeof allowedIntervals)[number]) ? value : 10;
}

function normalizeTheme(value: ThemeVariant) {
  return themeVariants.includes(value) ? value : themeVariants[0];
}

function normalizeLanguage(value: SiteLanguage) {
  return languageVariants.includes(value) ? value : "ar";
}

function getSavedLanguage(defaultLanguage: SiteLanguage) {
  if (typeof window === "undefined") return defaultLanguage;
  const saved = window.localStorage.getItem("site_language");
  return saved === "en" || saved === "ar" ? saved : defaultLanguage;
}

export function SiteShell({
  initialThemeVariant,
  layoutVariant,
  defaultLanguage,
  colorRotationEnabled,
  colorRotationIntervalSeconds,
  children,
}: SiteShellProps) {
  const safeInitialTheme = useMemo(() => normalizeTheme(initialThemeVariant), [initialThemeVariant]);
  const safeInterval = useMemo(() => normalizeInterval(colorRotationIntervalSeconds), [colorRotationIntervalSeconds]);
  const safeDefaultLanguage = useMemo(() => normalizeLanguage(defaultLanguage), [defaultLanguage]);
  const [activeTheme, setActiveTheme] = useState<ThemeVariant>(safeInitialTheme);
  const [activeLanguage, setActiveLanguage] = useState<SiteLanguage>(safeDefaultLanguage);

  useEffect(() => {
    setActiveTheme(safeInitialTheme);
  }, [safeInitialTheme]);

  useEffect(() => {
    const nextLanguage = getSavedLanguage(safeDefaultLanguage);
    setActiveLanguage(nextLanguage);
  }, [safeDefaultLanguage]);

  useEffect(() => {
    const dir = activeLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = activeLanguage;
    document.documentElement.dir = dir;
  }, [activeLanguage]);

  useEffect(() => {
    function handleLanguageChange(event: Event) {
      const nextLanguage = (event as CustomEvent<SiteLanguage>).detail;
      if (nextLanguage === "ar" || nextLanguage === "en") {
        setActiveLanguage(nextLanguage);
      }
    }

    window.addEventListener("site-language-change", handleLanguageChange);
    return () => window.removeEventListener("site-language-change", handleLanguageChange);
  }, []);

  useEffect(() => {
    if (!colorRotationEnabled) {
      setActiveTheme(safeInitialTheme);
      return undefined;
    }

    setActiveTheme(safeInitialTheme);

    const timer = window.setInterval(() => {
      setActiveTheme((currentTheme) => {
        const currentIndex = themeVariants.indexOf(currentTheme);
        const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % themeVariants.length : 0;
        return themeVariants[nextIndex];
      });
    }, safeInterval * 1000);

    return () => window.clearInterval(timer);
  }, [colorRotationEnabled, safeInitialTheme, safeInterval]);

  return (
    <main
      className={`site-root theme-${activeTheme} layout-${layoutVariant}`}
      data-theme-mode={colorRotationEnabled ? "auto" : "static"}
      data-theme-interval={safeInterval}
      data-language={activeLanguage}
      dir={activeLanguage === "ar" ? "rtl" : "ltr"}
    >
      {children}
    </main>
  );
}
