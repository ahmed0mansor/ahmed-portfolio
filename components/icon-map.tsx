import { Bot, Code2, Database, Server, Smartphone, Workflow } from "lucide-react";
import type { ServiceIconKey } from "@/lib/site-content";

export const serviceIconMap = {
  server: Server,
  code: Code2,
  smartphone: Smartphone,
  database: Database,
  bot: Bot,
  workflow: Workflow,
} satisfies Record<ServiceIconKey, typeof Server>;
