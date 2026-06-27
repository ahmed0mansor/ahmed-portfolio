export const themeVariants = ["cyber", "emerald", "royal", "sunset"] as const;
export type ThemeVariant = (typeof themeVariants)[number];

export const layoutVariants = ["classic", "compact", "showcase"] as const;
export type LayoutVariant = (typeof layoutVariants)[number];

export const languageVariants = ["ar", "en"] as const;
export type SiteLanguage = (typeof languageVariants)[number];

export const serviceIconKeys = ["server", "code", "smartphone", "database", "bot", "workflow"] as const;
export type ServiceIconKey = (typeof serviceIconKeys)[number];

export type ProfileContent = {
  nameAr: string;
  nameEn: string;
  logoText: string;
  titleAr: string;
  titleEn: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  location: string;
  cvUrl: string;
};

export type HeroContent = {
  badge: string;
  highlightedTitle: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  cvCta: string;
  focusKicker: string;
  focusTitle: string;
  focusItems: string[];
};

export type AboutContent = {
  kicker: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  stats: { value: string; label: string }[];
};

export type SectionHeaderContent = {
  kicker: string;
  title: string;
  subtitle: string;
};

export type ServiceContent = {
  icon: ServiceIconKey;
  title: string;
  description: string;
};

export type SkillGroupContent = {
  group: string;
  items: string[];
};

export type ProjectContent = {
  name: string;
  status: string;
  stack: string[];
  description: string;
};

export type AIContent = SectionHeaderContent & {
  assistantTitle: string;
  assistantSubtitle: string;
  primaryCta: string;
  dashboardCta: string;
  processSteps: string[];
  chatGreeting: string;
};

export type ContactContent = SectionHeaderContent & {
  emailLabel: string;
  phoneLabel: string;
  locationLabel: string;
  whatsappLabel: string;
  whatsappCta: string;
  whatsappMessage: string;
};

export type SiteContent = {
  profile: ProfileContent;
  hero: HeroContent;
  about: AboutContent;
  servicesHeader: SectionHeaderContent;
  services: ServiceContent[];
  skillsHeader: SectionHeaderContent;
  skills: SkillGroupContent[];
  projectsHeader: SectionHeaderContent;
  projects: ProjectContent[];
  ai: AIContent;
  contact: ContactContent;
  footer: {
    text: string;
  };
  sections: {
    about: boolean;
    services: boolean;
    skills: boolean;
    projects: boolean;
    assistant: boolean;
    contact: boolean;
    chatWidget: boolean;
  };
};

export const defaultSiteContent: SiteContent = {
  profile: {
    nameAr: "أحمد شوقي منصور",
    nameEn: "AHMED SHAWQI MANSOUR",
    logoText: "AQ",
    titleAr: "مهندس برمجيات | مطور Backend وFull-Stack | مهتم بالذكاء الاصطناعي والأتمتة",
    titleEn: "Software Engineer | Backend & Full-Stack Developer | AI & Automation Enthusiast",
    phone: "735013640",
    whatsappNumber: "967735013640",
    email: "ahmed0qaid@gmail.com",
    location: "تعز - الحوبان",
    cvUrl: "/api/cv",
  },
  hero: {
    badge: "معرض أعمال + نظام استقبال طلبات ذكي",
    highlightedTitle: "مهندس برمجيات",
    description:
      "أطور تطبيقات ويب وموبايل، أصمم قواعد بيانات علائقية، وأبني حلولاً مدعومة بالذكاء الاصطناعي والأتمتة لتحويل الأفكار إلى أنظمة عملية قابلة للاستخدام.",
    primaryCta: "عرض المشاريع",
    secondaryCta: "ابدأ مع المساعد الذكي",
    cvCta: "تحميل السيرة",
    focusKicker: "التركيز الحالي",
    focusTitle: "منتجات رقمية ذكية",
    focusItems: [
      "واجهات برمجية ومنطق أعمال",
      "تطبيقات موبايل باستخدام Flutter",
      "تصميم قواعد البيانات العلائقية",
      "مساعد ذكي لجمع متطلبات المشاريع",
      "مسارات أتمتة المحتوى باستخدام n8n",
    ],
  },
  about: {
    kicker: "نبذة",
    title: "نبذة مهنية مختصرة",
    subtitle: "الهدف من هذا القسم هو تقديم صورة واضحة عن الخبرة العملية بدون إطالة أو مبالغة.",
    paragraphs: [
      "أنا مهندس برمجيات وخريج تقنية معلومات بخبرة عملية في تطوير الباك اند، تطبيقات الويب والموبايل، تصميم قواعد البيانات العلائقية، وبناء حلول أولية مدعومة بالذكاء الاصطناعي.",
      "عملت على بناء واجهات برمجية، تنظيم بنية قواعد البيانات، تحسين الاستعلامات، وكتابة كود منظم وقابل للصيانة. تشمل اهتماماتي التقنية Laravel وFlutter وReact وPostgreSQL وSupabase وTensorFlow وأتمتة العمليات باستخدام n8n.",
    ],
    stats: [
      { value: "95%", label: "المعدل التراكمي" },
      { value: "2026", label: "خريج تقنية معلومات" },
      { value: "Full-Stack", label: "التركيز التقني" },
    ],
  },
  servicesHeader: {
    kicker: "الخدمات",
    title: "الخدمات التي يقدمها الموقع",
    subtitle:
      "خدمات تقنية متكاملة لتحويل الأفكار إلى مواقع، تطبيقات، وأنظمة ذكية عملية.",
  },
  services: [
    {
      icon: "server",
      title: "تطوير الباك اند",
      description: "بناء واجهات برمجية APIs، منطق أعمال، وربط قواعد البيانات باستخدام Laravel وPHP وPython وSQL.",
    },
    {
      icon: "code",
      title: "تطبيقات الويب",
      description: "تطوير تطبيقات ويب حديثة بواجهات منظمة، أداء جيد، وبنية قابلة للتوسع والصيانة.",
    },
    {
      icon: "smartphone",
      title: "تطبيقات الموبايل",
      description: "بناء تطبيقات موبايل باستخدام Flutter وDart مع تنظيم الكود وفق Clean Architecture.",
    },
    {
      icon: "database",
      title: "تصميم قواعد البيانات",
      description: "تصميم قواعد بيانات علائقية، تنظيم الجداول، وتحسين الاستعلامات لتقليل التعقيد ورفع الأداء.",
    },
    {
      icon: "bot",
      title: "حلول مدعومة بالذكاء الاصطناعي",
      description: "بناء نماذج أولية وحلول مدعومة بالذكاء الاصطناعي لتجميع المتطلبات وتحليل البيانات.",
    },
    {
      icon: "workflow",
      title: "الأتمتة باستخدام n8n",
      description: "إنشاء أوتوميشن لتحليل المحتوى، إعادة إنتاجه، وربطه بأنظمة النشر أو أدوات العمل.",
    },
  ],
  skillsHeader: {
    kicker: "المهارات",
    title: "المهارات التقنية",
    subtitle: "تم تقسيم المهارات بحسب الاستخدام العملي حتى لا تظهر كقائمة طويلة غير موجهة.",
  },
  skills: [
    { group: "الباك اند", items: ["PHP", "Laravel", "Python", "SQL", "API Development"] },
    { group: "الواجهات الأمامية", items: ["JavaScript", "React", "Bootstrap", "Responsive UI"] },
    { group: "الموبايل", items: ["Flutter", "Dart", "GetX", "Clean Architecture"] },
    { group: "قواعد البيانات", items: ["PostgreSQL", "MySQL", "SQLite", "Oracle", "Supabase"] },
    { group: "الذكاء الاصطناعي والأتمتة", items: ["TensorFlow", "AI Prototypes", "n8n", "Content Automation"] },
    { group: "الأنظمة والأدوات", items: ["Windows Server", "Office", "Database Optimization"] },
  ],
  projectsHeader: {
    kicker: "المشاريع",
    title: "مشاريع مختارة",
    subtitle: "يتم عرض المشاريع بطريقة تسويقية واضحة: المشكلة، التقنيات، والقيمة العملية.",
  },
  projects: [
    {
      name: "نظام حجز فندقي",
      status: "مشروع مميز",
      stack: ["Flutter", "Supabase", "Clean Architecture", "GetX"],
      description:
        "نظام حجز فندقي لتطبيق ويب وموبايل، مربوط بقاعدة بيانات، مع تنظيم البيانات وتحسين الاستعلامات وبنية كود نظيفة.",
    },
    {
      name: "نظام محاسبي مدعوم بالذكاء الاصطناعي",
      status: "قيد التنفيذ",
      stack: ["AI", "Database", "Business Logic"],
      description: "نظام محاسبي متقدم مدمج بأدوات الذكاء الاصطناعي لدعم التحليل وتقليل المهام المتكررة.",
    },
    {
      name: "تطبيق موبايل لرعاية الأطفال",
      status: "قيد التنفيذ",
      stack: ["Flutter", "Mobile", "Healthcare Concept"],
      description: "تطبيق موبايل مخصص لرعاية الأطفال وتنظيم المعلومات اليومية المتعلقة بهم.",
    },
    {
      name: "أتمتة المحتوى باستخدام n8n",
      status: "قيد التنفيذ",
      stack: ["n8n", "Automation", "Content Analysis"],
      description: "أوتوميشن لتحليل المحتوى، صناعة محتوى جديد، ونشره على منصات التواصل الاجتماعي.",
    },
  ],
  ai: {
    kicker: "المساعد الذكي",
    title: "مساعد ذكي لتحويل كلام العميل إلى طلب مشروع جاهز",
    subtitle:
      "المساعد لا يعطي سعرًا نهائيًا. وظيفته جمع المتطلبات، تنظيمها، وتحويلها إلى Project Brief يصل إلى لوحة التحكم للمراجعة.",
    assistantTitle: "المساعد الذكي للمشاريع",
    assistantSubtitle: "جمع متطلبات العملاء وإرسال الطلبات",
    primaryCta: "جرّب المحادثة الآن",
    dashboardCta: "لوحة التحكم",
    processSteps: [
      "العميل يبدأ المحادثة مع المساعد الذكي.",
      "المساعد يسأل عن نوع المشروع والهدف والجمهور.",
      "يتم تحديد الصفحات، الخصائص، اللغة، والميزانية التقريبية.",
      "المساعد يحوّل الإجابات إلى ملخص مشروع منظم.",
      "الطلب يصل إلى لوحة التحكم للمراجعة والتواصل مع العميل.",
    ],
    chatGreeting:
      "مرحبًا، أنا مساعد أحمد الذكي. سأساعدك في تحويل فكرتك إلى طلب مشروع واضح. هل تريد موقعًا، تطبيقًا، نظامًا، متجرًا، أم أتمتة؟",
  },
  contact: {
    kicker: "تواصل",
    title: "تواصل أو ابدأ طلبك عبر المساعد الذكي",
    subtitle: "للطلبات التقنية، الأفضل استخدام المساعد الذكي حتى يصل الطلب منظمًا ومختصرًا.",
    emailLabel: "البريد الإلكتروني",
    phoneLabel: "الهاتف",
    locationLabel: "الموقع",
    whatsappLabel: "واتساب",
    whatsappCta: "راسلني على واتساب",
    whatsappMessage: "مرحبًا أحمد، أريد الاستفسار عن بناء موقع أو تطبيق.",
  },
  footer: {
    text: "© 2026 أحمد شوقي منصور. موقع شخصي ذكي ونظام استقبال طلبات العملاء.",
  },
  sections: {
    about: true,
    services: true,
    skills: true,
    projects: true,
    assistant: true,
    contact: true,
    chatWidget: true,
  },
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deepMerge<T>(fallback: T, incoming: unknown): T {
  if (Array.isArray(fallback)) {
    return Array.isArray(incoming) ? (incoming as T) : fallback;
  }

  if (isObject(fallback)) {
    const output: Record<string, unknown> = { ...fallback };
    const source = isObject(incoming) ? incoming : {};

    for (const key of Object.keys(fallback)) {
      output[key] = deepMerge((fallback as Record<string, unknown>)[key], source[key]);
    }

    return output as T;
  }

  return typeof incoming === typeof fallback ? (incoming as T) : fallback;
}

function cleanString(value: string, maxLength: number) {
  return value
    .normalize("NFKC")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

function cleanStringArray(values: string[], maxItems: number, maxText: number) {
  return values
    .slice(0, maxItems)
    .map((item) => cleanString(item, maxText))
    .filter(Boolean);
}


const legacyArabicText: Record<string, string> = {
  "أحمد شوقي محمد قائد": "أحمد شوقي منصور",
  "Ahmed Qaid": "AHMED SHAWQI MANSOUR",
  "Portfolio + AI Client Intake System": "معرض أعمال + نظام استقبال طلبات ذكي",
  "Software Engineer": "مهندس برمجيات",
  "ابدأ مع AI Assistant": "ابدأ مع المساعد الذكي",
  "Current Focus": "التركيز الحالي",
  "Smart Digital Products": "منتجات رقمية ذكية",
  "Backend APIs and business logic": "واجهات برمجية ومنطق أعمال",
  "Flutter mobile applications": "تطبيقات موبايل باستخدام Flutter",
  "Relational database design": "تصميم قواعد البيانات العلائقية",
  "AI project requirement assistant": "مساعد ذكي لجمع متطلبات المشاريع",
  "n8n content automation workflows": "مسارات أتمتة المحتوى باستخدام n8n",
  "About": "نبذة",
  "Services": "الخدمات",
  "Skills": "المهارات",
  "Projects": "المشاريع",
  "Contact": "تواصل",
  "AI Assistant": "المساعد الذكي",
  "AI Project Requirement Assistant": "المساعد الذكي للمشاريع",
  "Client intake workflow": "جمع متطلبات العملاء وإرسال الطلبات",
  "Email": "البريد الإلكتروني",
  "Phone": "الهاتف",
  "Location": "الموقع",
  "GPA": "المعدل التراكمي",
  "IT Graduate": "خريج تقنية معلومات",
  "Focus": "التركيز التقني",
  "Backend Development": "تطوير الباك اند",
  "Web Applications": "تطبيقات الويب",
  "Mobile Applications": "تطبيقات الموبايل",
  "Database Design": "تصميم قواعد البيانات",
  "AI-Based Solutions": "حلول مدعومة بالذكاء الاصطناعي",
  "n8n Automation": "الأتمتة باستخدام n8n",
  "Backend": "الباك اند",
  "Frontend": "الواجهات الأمامية",
  "Mobile": "الموبايل",
  "Databases": "قواعد البيانات",
  "AI & Automation": "الذكاء الاصطناعي والأتمتة",
  "Systems": "الأنظمة والأدوات",
  "Hotel Booking System": "نظام حجز فندقي",
  "Featured": "مشروع مميز",
  "In Progress": "قيد التنفيذ",
  "AI-Powered Accounting System": "نظام محاسبي مدعوم بالذكاء الاصطناعي",
  "Child Care Mobile App": "تطبيق موبايل لرعاية الأطفال",
  "n8n Content Automation": "أتمتة المحتوى باستخدام n8n",
  "© 2026 Ahmed Qaid. Built as a smart portfolio and AI client intake system.": "© 2026 أحمد شوقي منصور. موقع شخصي ذكي ونظام استقبال طلبات العملاء.",
  "الخدمات مبنية على المهارات الموجودة في السيرة الذاتية، مع إبراز المجالات الأقوى: Backend، قواعد البيانات، Flutter، والذكاء الاصطناعي التطبيقي.": "خدمات تقنية متكاملة لتحويل الأفكار إلى مواقع، تطبيقات، وأنظمة ذكية عملية.",
  "The services are aligned with the strongest areas in the CV: backend development, databases, Flutter, applied AI, and automation.": "Integrated digital services to transform ideas into practical websites, applications, and smart systems.",
  "© 2026 AHMED SHAWQI MANSOUR. Built as a smart portfolio and AI client intake system.": "© 2026 أحمد شوقي منصور. موقع شخصي ذكي ونظام استقبال طلبات العملاء."
};

function replaceLegacyArabicStrings(value: unknown): unknown {
  if (typeof value === "string") return legacyArabicText[value] || value;
  if (Array.isArray(value)) return value.map((item) => replaceLegacyArabicStrings(item));
  if (isObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceLegacyArabicStrings(item)]));
  }
  return value;
}

export function normalizeSiteContent(value: unknown, fallback: SiteContent = defaultSiteContent): SiteContent {
  const merged = deepMerge(fallback, value);
  const source = fallback === defaultSiteContent ? (replaceLegacyArabicStrings(merged) as SiteContent) : merged;

  return {
    profile: {
      nameAr: cleanString(source.profile.nameAr, 120),
      nameEn: cleanString(source.profile.nameEn, 120),
      logoText: cleanString(source.profile.logoText, 12),
      titleAr: cleanString(source.profile.titleAr, 200),
      titleEn: cleanString(source.profile.titleEn, 200),
      phone: cleanString(source.profile.phone, 40),
      whatsappNumber: cleanString(source.profile.whatsappNumber || source.profile.phone, 40),
      email: cleanString(source.profile.email, 150),
      location: cleanString(source.profile.location, 120),
      cvUrl: source.profile.cvUrl === "/api/cv" ? "/api/cv" : "/api/cv",
    },
    hero: {
      badge: cleanString(source.hero.badge, 120),
      highlightedTitle: cleanString(source.hero.highlightedTitle, 120),
      description: cleanString(source.hero.description, 600),
      primaryCta: cleanString(source.hero.primaryCta, 60),
      secondaryCta: cleanString(source.hero.secondaryCta, 60),
      cvCta: cleanString(source.hero.cvCta, 60),
      focusKicker: cleanString(source.hero.focusKicker, 80),
      focusTitle: cleanString(source.hero.focusTitle, 120),
      focusItems: cleanStringArray(source.hero.focusItems, 12, 120),
    },
    about: {
      kicker: cleanString(source.about.kicker, 80),
      title: cleanString(source.about.title, 160),
      subtitle: cleanString(source.about.subtitle, 300),
      paragraphs: cleanStringArray(source.about.paragraphs, 6, 800),
      stats: source.about.stats.slice(0, 8).map((stat) => ({
        value: cleanString(stat.value, 40),
        label: cleanString(stat.label, 80),
      })).filter((stat) => stat.value && stat.label),
    },
    servicesHeader: {
      kicker: cleanString(source.servicesHeader.kicker, 80),
      title: cleanString(source.servicesHeader.title, 160),
      subtitle: cleanString(source.servicesHeader.subtitle, 400),
    },
    services: source.services.slice(0, 12).map((service) => ({
      icon: serviceIconKeys.includes(service.icon) ? service.icon : "server",
      title: cleanString(service.title, 120),
      description: cleanString(service.description, 500),
    })).filter((service) => service.title && service.description),
    skillsHeader: {
      kicker: cleanString(source.skillsHeader.kicker, 80),
      title: cleanString(source.skillsHeader.title, 160),
      subtitle: cleanString(source.skillsHeader.subtitle, 400),
    },
    skills: source.skills.slice(0, 15).map((skill) => ({
      group: cleanString(skill.group, 100),
      items: cleanStringArray(skill.items, 30, 60),
    })).filter((skill) => skill.group && skill.items.length),
    projectsHeader: {
      kicker: cleanString(source.projectsHeader.kicker, 80),
      title: cleanString(source.projectsHeader.title, 160),
      subtitle: cleanString(source.projectsHeader.subtitle, 400),
    },
    projects: source.projects.slice(0, 15).map((project) => ({
      name: cleanString(project.name, 140),
      status: cleanString(project.status, 80),
      stack: cleanStringArray(project.stack, 20, 60),
      description: cleanString(project.description, 700),
    })).filter((project) => project.name && project.description),
    ai: {
      kicker: cleanString(source.ai.kicker, 80),
      title: cleanString(source.ai.title, 160),
      subtitle: cleanString(source.ai.subtitle, 400),
      assistantTitle: cleanString(source.ai.assistantTitle, 160),
      assistantSubtitle: cleanString(source.ai.assistantSubtitle, 400),
      primaryCta: cleanString(source.ai.primaryCta, 80),
      dashboardCta: cleanString(source.ai.dashboardCta, 80),
      processSteps: cleanStringArray(source.ai.processSteps, 8, 120),
      chatGreeting: cleanString(source.ai.chatGreeting, 500),
    },
    contact: {
      kicker: cleanString(source.contact.kicker, 80),
      title: cleanString(source.contact.title, 160),
      subtitle: cleanString(source.contact.subtitle, 400),
      emailLabel: cleanString(source.contact.emailLabel, 60),
      phoneLabel: cleanString(source.contact.phoneLabel, 60),
      locationLabel: cleanString(source.contact.locationLabel, 60),
      whatsappLabel: cleanString(source.contact.whatsappLabel, 60),
      whatsappCta: cleanString(source.contact.whatsappCta, 80),
      whatsappMessage: cleanString(source.contact.whatsappMessage, 240),
    },
    footer: {
      text: cleanString(source.footer.text, 200),
    },
    sections: {
      about: Boolean(source.sections.about),
      services: Boolean(source.sections.services),
      skills: Boolean(source.sections.skills),
      projects: Boolean(source.sections.projects),
      assistant: Boolean(source.sections.assistant),
      contact: Boolean(source.sections.contact),
      chatWidget: Boolean(source.sections.chatWidget),
    },
  };
}
