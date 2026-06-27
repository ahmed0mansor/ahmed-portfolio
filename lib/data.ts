import { Code2, Database, Bot, Smartphone, Server, Workflow } from "lucide-react";

export const profile = {
  nameAr: "أحمد شوقي منصور",
  nameEn: "AHMED SHAWQI MANSOUR",
  titleAr: "مهندس برمجيات | مطور Backend وFull-Stack | مهتم بالذكاء الاصطناعي والأتمتة",
  titleEn: "Software Engineer | Backend & Full-Stack Developer | AI & Automation Enthusiast",
  phone: "735013640",
  email: "ahmed0qaid@gmail.com",
  location: "تعز - الحوبان",
  cvUrl: "/api/cv",
};

export const skills = [
  {
    group: "Backend",
    items: ["PHP", "Laravel", "Python", "SQL", "API Development"],
  },
  {
    group: "Frontend",
    items: ["JavaScript", "React", "Bootstrap", "Responsive UI"],
  },
  {
    group: "Mobile",
    items: ["Flutter", "Dart", "GetX", "Clean Architecture"],
  },
  {
    group: "Databases",
    items: ["PostgreSQL", "MySQL", "SQLite", "Oracle", "Supabase"],
  },
  {
    group: "AI & Automation",
    items: ["TensorFlow", "AI Prototypes", "n8n", "Content Automation"],
  },
  {
    group: "Systems",
    items: ["Windows Server", "Office", "Database Optimization"],
  },
];

export const services = [
  {
    icon: Server,
    title: "Backend Development",
    description:
      "بناء واجهات برمجية APIs، منطق أعمال، وربط قواعد البيانات باستخدام Laravel وPHP وPython وSQL.",
  },
  {
    icon: Code2,
    title: "Web Applications",
    description:
      "تطوير تطبيقات ويب حديثة بواجهات منظمة، أداء جيد، وبنية قابلة للتوسع والصيانة.",
  },
  {
    icon: Smartphone,
    title: "Mobile Applications",
    description:
      "بناء تطبيقات موبايل باستخدام Flutter وDart مع تنظيم الكود وفق Clean Architecture.",
  },
  {
    icon: Database,
    title: "Database Design",
    description:
      "تصميم قواعد بيانات علائقية، تنظيم الجداول، وتحسين الاستعلامات لتقليل التعقيد ورفع الأداء.",
  },
  {
    icon: Bot,
    title: "AI-Based Solutions",
    description:
      "بناء نماذج أولية وحلول مدعومة بالذكاء الاصطناعي لتجميع المتطلبات وتحليل البيانات.",
  },
  {
    icon: Workflow,
    title: "n8n Automation",
    description:
      "إنشاء أوتوميشن لتحليل المحتوى، إعادة إنتاجه، وربطه بأنظمة النشر أو أدوات العمل.",
  },
];

export const projects = [
  {
    name: "Hotel Booking System",
    status: "Featured",
    stack: ["Flutter", "Supabase", "Clean Architecture", "GetX"],
    description:
      "نظام حجز فندقي لتطبيق ويب وموبايل، مربوط بقاعدة بيانات، مع تنظيم البيانات وتحسين الاستعلامات وبنية كود نظيفة.",
  },
  {
    name: "AI-Powered Accounting System",
    status: "In Progress",
    stack: ["AI", "Database", "Business Logic"],
    description:
      "نظام محاسبي متقدم مدمج بأدوات الذكاء الاصطناعي لدعم التحليل وتقليل المهام المتكررة.",
  },
  {
    name: "Child Care Mobile App",
    status: "In Progress",
    stack: ["Flutter", "Mobile", "Healthcare Concept"],
    description:
      "تطبيق موبايل مخصص لرعاية الأطفال وتنظيم المعلومات اليومية المتعلقة بهم.",
  },
  {
    name: "n8n Content Automation",
    status: "In Progress",
    stack: ["n8n", "Automation", "Content Analysis"],
    description:
      "أوتوميشن لتحليل المحتوى، صناعة محتوى جديد، ونشره على منصات التواصل الاجتماعي.",
  },
];

export const processSteps = [
  "العميل يبدأ المحادثة مع مساعد AI.",
  "المساعد يسأل عن نوع المشروع والهدف والجمهور.",
  "يتم تحديد الصفحات، الخصائص، اللغة، والميزانية التقريبية.",
  "المساعد يحوّل الإجابات إلى Project Brief منظم.",
  "الطلب يصل إلى لوحة التحكم للمراجعة والتواصل مع العميل.",
];
