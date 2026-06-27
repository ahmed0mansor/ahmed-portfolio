import { prisma } from "@/lib/prisma";
import {
  defaultSiteContent,
  layoutVariants,
  languageVariants,
  normalizeSiteContent,
  themeVariants,
  type LayoutVariant,
  type SiteContent,
  type SiteLanguage,
  type ThemeVariant,
} from "@/lib/site-content";
import { englishSiteContent } from "@/lib/site-translations";

export type SiteSettings = {
  cvDownloadEnabled: boolean;
  whatsappButtonEnabled: boolean;
  themeVariant: ThemeVariant;
  layoutVariant: LayoutVariant;
  defaultLanguage: SiteLanguage;
  colorRotationEnabled: boolean;
  colorRotationIntervalSeconds: number;
  content: SiteContent;
  contentEn: SiteContent;
};

export const defaultSiteSettings: SiteSettings = {
  cvDownloadEnabled: true,
  whatsappButtonEnabled: true,
  themeVariant: "cyber",
  layoutVariant: "classic",
  defaultLanguage: "ar",
  colorRotationEnabled: false,
  colorRotationIntervalSeconds: 10,
  content: defaultSiteContent,
  contentEn: englishSiteContent,
};

const SETTING_KEYS = {
  cvDownloadEnabled: "cvDownloadEnabled",
  whatsappButtonEnabled: "whatsappButtonEnabled",
  themeVariant: "themeVariant",
  layoutVariant: "layoutVariant",
  defaultLanguage: "defaultLanguage",
  colorRotationEnabled: "colorRotationEnabled",
  colorRotationIntervalSeconds: "colorRotationIntervalSeconds",
  siteContent: "siteContent",
  siteContentEn: "siteContentEn",
} as const;

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function parseTheme(value: string | undefined): ThemeVariant {
  return themeVariants.includes(value as ThemeVariant) ? (value as ThemeVariant) : defaultSiteSettings.themeVariant;
}

function parseLayout(value: string | undefined): LayoutVariant {
  return layoutVariants.includes(value as LayoutVariant) ? (value as LayoutVariant) : defaultSiteSettings.layoutVariant;
}

function parseLanguage(value: string | undefined): SiteLanguage {
  return languageVariants.includes(value as SiteLanguage) ? (value as SiteLanguage) : defaultSiteSettings.defaultLanguage;
}

function parseRotationInterval(value: string | undefined): number {
  const parsed = Number(value);
  return parsed === 10 || parsed === 15 ? parsed : defaultSiteSettings.colorRotationIntervalSeconds;
}

function parseContent(value: string | undefined, fallback: SiteContent): SiteContent {
  if (!value) return fallback;

  try {
    return normalizeSiteContent(JSON.parse(value), fallback);
  } catch (error) {
    console.error("Failed to parse site content", error);
    return fallback;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = (await prisma.siteSetting.findMany({
      where: { key: { in: Object.values(SETTING_KEYS) } },
    })) as Array<{ key: string; value: string }>;

    const map = new Map<string, string>(rows.map((row) => [row.key, row.value]));

    return {
      cvDownloadEnabled: parseBoolean(
        map.get(SETTING_KEYS.cvDownloadEnabled),
        defaultSiteSettings.cvDownloadEnabled,
      ),
      whatsappButtonEnabled: parseBoolean(
        map.get(SETTING_KEYS.whatsappButtonEnabled),
        defaultSiteSettings.whatsappButtonEnabled,
      ),
      themeVariant: parseTheme(map.get(SETTING_KEYS.themeVariant)),
      layoutVariant: parseLayout(map.get(SETTING_KEYS.layoutVariant)),
      defaultLanguage: parseLanguage(map.get(SETTING_KEYS.defaultLanguage)),
      colorRotationEnabled: parseBoolean(
        map.get(SETTING_KEYS.colorRotationEnabled),
        defaultSiteSettings.colorRotationEnabled,
      ),
      colorRotationIntervalSeconds: parseRotationInterval(map.get(SETTING_KEYS.colorRotationIntervalSeconds)),
      content: parseContent(map.get(SETTING_KEYS.siteContent), defaultSiteContent),
      contentEn: parseContent(map.get(SETTING_KEYS.siteContentEn), englishSiteContent),
    };
  } catch (error) {
    console.error("Failed to read site settings", error);
    return defaultSiteSettings;
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>) {
  const writes = [];

  if (typeof settings.cvDownloadEnabled === "boolean") {
    writes.push(
      prisma.siteSetting.upsert({
        where: { key: SETTING_KEYS.cvDownloadEnabled },
        update: { value: String(settings.cvDownloadEnabled) },
        create: {
          key: SETTING_KEYS.cvDownloadEnabled,
          value: String(settings.cvDownloadEnabled),
        },
      }),
    );
  }

  if (typeof settings.whatsappButtonEnabled === "boolean") {
    writes.push(
      prisma.siteSetting.upsert({
        where: { key: SETTING_KEYS.whatsappButtonEnabled },
        update: { value: String(settings.whatsappButtonEnabled) },
        create: {
          key: SETTING_KEYS.whatsappButtonEnabled,
          value: String(settings.whatsappButtonEnabled),
        },
      }),
    );
  }

  if (settings.themeVariant && themeVariants.includes(settings.themeVariant)) {
    writes.push(
      prisma.siteSetting.upsert({
        where: { key: SETTING_KEYS.themeVariant },
        update: { value: settings.themeVariant },
        create: { key: SETTING_KEYS.themeVariant, value: settings.themeVariant },
      }),
    );
  }

  if (settings.layoutVariant && layoutVariants.includes(settings.layoutVariant)) {
    writes.push(
      prisma.siteSetting.upsert({
        where: { key: SETTING_KEYS.layoutVariant },
        update: { value: settings.layoutVariant },
        create: { key: SETTING_KEYS.layoutVariant, value: settings.layoutVariant },
      }),
    );
  }

  if (settings.defaultLanguage && languageVariants.includes(settings.defaultLanguage)) {
    writes.push(
      prisma.siteSetting.upsert({
        where: { key: SETTING_KEYS.defaultLanguage },
        update: { value: settings.defaultLanguage },
        create: { key: SETTING_KEYS.defaultLanguage, value: settings.defaultLanguage },
      }),
    );
  }

  if (typeof settings.colorRotationEnabled === "boolean") {
    writes.push(
      prisma.siteSetting.upsert({
        where: { key: SETTING_KEYS.colorRotationEnabled },
        update: { value: String(settings.colorRotationEnabled) },
        create: { key: SETTING_KEYS.colorRotationEnabled, value: String(settings.colorRotationEnabled) },
      }),
    );
  }

  if (typeof settings.colorRotationIntervalSeconds === "number" && [10, 15].includes(settings.colorRotationIntervalSeconds)) {
    writes.push(
      prisma.siteSetting.upsert({
        where: { key: SETTING_KEYS.colorRotationIntervalSeconds },
        update: { value: String(settings.colorRotationIntervalSeconds) },
        create: {
          key: SETTING_KEYS.colorRotationIntervalSeconds,
          value: String(settings.colorRotationIntervalSeconds),
        },
      }),
    );
  }

  if (settings.content) {
    const normalized = normalizeSiteContent(settings.content, defaultSiteContent);
    writes.push(
      prisma.siteSetting.upsert({
        where: { key: SETTING_KEYS.siteContent },
        update: { value: JSON.stringify(normalized) },
        create: { key: SETTING_KEYS.siteContent, value: JSON.stringify(normalized) },
      }),
    );
  }

  if (settings.contentEn) {
    const normalized = normalizeSiteContent(settings.contentEn, englishSiteContent);
    writes.push(
      prisma.siteSetting.upsert({
        where: { key: SETTING_KEYS.siteContentEn },
        update: { value: JSON.stringify(normalized) },
        create: { key: SETTING_KEYS.siteContentEn, value: JSON.stringify(normalized) },
      }),
    );
  }

  if (writes.length > 0) {
    await prisma.$transaction(writes);
  }

  return getSiteSettings();
}

export async function isCvDownloadEnabled() {
  const settings = await getSiteSettings();
  return settings.cvDownloadEnabled;
}
