import type { SiteContent } from "@/lib/site-content";

export const englishSiteContent: SiteContent = {
  profile: {
    nameAr: "AHMED SHAWQI MANSOUR",
    nameEn: "AHMED SHAWQI MANSOUR",
    logoText: "AQ",
    titleAr: "Software Engineer | Backend & Full-Stack Developer | AI & Automation Enthusiast",
    titleEn: "Software Engineer | Backend & Full-Stack Developer | AI & Automation Enthusiast",
    phone: "735013640",
    whatsappNumber: "967735013640",
    email: "ahmed0qaid@gmail.com",
    location: "Taiz, Yemen",
    cvUrl: "/api/cv",
  },
  hero: {
    badge: "Portfolio + AI Client Intake System",
    highlightedTitle: "Software Engineer",
    description:
      "I build web and mobile applications, design relational databases, and develop AI-powered automation solutions that turn ideas into practical digital systems.",
    primaryCta: "View Projects",
    secondaryCta: "Start with AI Assistant",
    cvCta: "Download CV",
    focusKicker: "Current Focus",
    focusTitle: "Smart Digital Products",
    focusItems: [
      "Backend APIs and business logic",
      "Flutter mobile applications",
      "Relational database design",
      "AI project requirement assistant",
      "n8n content automation workflows",
    ],
  },
  about: {
    kicker: "About",
    title: "Professional Summary",
    subtitle: "A concise overview of practical software engineering experience without unnecessary exaggeration.",
    paragraphs: [
      "I am a Software Engineer and Information Technology graduate with practical experience in backend development, web and mobile applications, relational database design, and AI-based prototypes.",
      "I work on building APIs, organizing database structures, improving queries, and writing clean, maintainable code. My technical interests include Laravel, Flutter, React, PostgreSQL, Supabase, TensorFlow, and n8n automation workflows.",
    ],
    stats: [
      { value: "95%", label: "GPA" },
      { value: "2026", label: "IT Graduate" },
      { value: "Full-Stack", label: "Focus" },
    ],
  },
  servicesHeader: {
    kicker: "Services",
    title: "Services I Provide",
    subtitle:
      "Integrated digital services to transform ideas into practical websites, applications, and smart systems.",
  },
  services: [
    {
      icon: "server",
      title: "Backend Development",
      description: "Building APIs, business logic, and database-driven systems using Laravel, PHP, Python, and SQL.",
    },
    {
      icon: "code",
      title: "Web Applications",
      description: "Developing modern web applications with organized interfaces, solid performance, and scalable structure.",
    },
    {
      icon: "smartphone",
      title: "Mobile Applications",
      description: "Building mobile applications using Flutter and Dart with clean architecture and maintainable code.",
    },
    {
      icon: "database",
      title: "Database Design",
      description: "Designing relational databases, organizing tables, and optimizing queries for better performance.",
    },
    {
      icon: "bot",
      title: "AI-Based Solutions",
      description: "Creating AI-based prototypes and tools for requirement collection, analysis, and workflow support.",
    },
    {
      icon: "workflow",
      title: "n8n Automation",
      description: "Designing automation workflows for content analysis, content generation, and publishing processes.",
    },
  ],
  skillsHeader: {
    kicker: "Skills",
    title: "Technical Skills",
    subtitle: "Skills are grouped by practical use to avoid a long and unfocused list.",
  },
  skills: [
    { group: "Backend", items: ["PHP", "Laravel", "Python", "SQL", "API Development"] },
    { group: "Frontend", items: ["JavaScript", "React", "Bootstrap", "Responsive UI"] },
    { group: "Mobile", items: ["Flutter", "Dart", "GetX", "Clean Architecture"] },
    { group: "Databases", items: ["PostgreSQL", "MySQL", "SQLite", "Oracle", "Supabase"] },
    { group: "AI & Automation", items: ["TensorFlow", "AI Prototypes", "n8n", "Content Automation"] },
    { group: "Systems", items: ["Windows Server", "Office", "Database Optimization"] },
  ],
  projectsHeader: {
    kicker: "Projects",
    title: "Selected Projects",
    subtitle: "Projects are presented with a practical focus: value, technologies, and implementation direction.",
  },
  projects: [
    {
      name: "Hotel Booking System",
      status: "Featured",
      stack: ["Flutter", "Supabase", "Clean Architecture", "GetX"],
      description:
        "A hotel booking system for web and mobile, connected to a database with organized data handling, query optimization, and clean code structure.",
    },
    {
      name: "AI-Powered Accounting System",
      status: "In Progress",
      stack: ["AI", "Database", "Business Logic"],
      description: "An advanced accounting system integrated with AI tools to support analysis and reduce repetitive work.",
    },
    {
      name: "Child Care Mobile App",
      status: "In Progress",
      stack: ["Flutter", "Mobile", "Healthcare Concept"],
      description: "A mobile application concept for child care and organizing daily child-related information.",
    },
    {
      name: "n8n Content Automation",
      status: "In Progress",
      stack: ["n8n", "Automation", "Content Analysis"],
      description: "An automation workflow for analyzing content, generating new content, and publishing it to social platforms.",
    },
  ],
  ai: {
    kicker: "AI Assistant",
    title: "AI Assistant that turns client ideas into project briefs",
    subtitle:
      "The assistant does not provide a final price. It collects requirements, organizes them, and sends a structured project brief to the dashboard for review.",
    assistantTitle: "AI Project Requirement Assistant",
    assistantSubtitle: "Client intake workflow",
    primaryCta: "Try the Assistant",
    dashboardCta: "Dashboard",
    processSteps: [
      "The client starts a conversation with the AI assistant.",
      "The assistant asks about the project type, goal, and target users.",
      "Pages, features, language, budget range, and timeline are collected.",
      "The answers are converted into a structured project brief.",
      "The request appears in the dashboard for review and follow-up.",
    ],
    chatGreeting:
      "Hello, I am Ahmed's AI assistant. I will help turn your idea into a clear project request. Do you need a website, mobile app, management system, online store, or automation workflow?",
  },
  contact: {
    kicker: "Contact",
    title: "Contact or start your request with the AI Assistant",
    subtitle: "For technical requests, the AI Assistant is the best way to send a clear and organized project request.",
    emailLabel: "Email",
    phoneLabel: "Phone",
    locationLabel: "Location",
    whatsappLabel: "WhatsApp",
    whatsappCta: "Chat on WhatsApp",
    whatsappMessage: "Hello Ahmed, I would like to ask about building a website or application.",
  },
  footer: {
    text: "© 2026 AHMED SHAWQI MANSOUR. Built as a smart portfolio and AI client intake system.",
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
