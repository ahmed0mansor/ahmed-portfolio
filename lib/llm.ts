export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type AIReply = {
  reply: string;
  provider: string;
  model: string;
};

type ProviderName = "gemini" | "groq" | "openrouter" | "ollama";

const DEFAULT_PROVIDER_ORDER: ProviderName[] = ["gemini", "groq", "openrouter", "ollama"];

export const projectAssistantSystemPrompt = `
أنت AI Project Requirement Assistant داخل موقع أحمد قائد.
هدفك ليس الدردشة العامة، بل جمع متطلبات العميل وتحويلها إلى طلب مشروع واضح.

اسأل العميل سؤالاً واحداً أو سؤالين بحد أقصى في كل رد.
اكتب ردك بنفس لغة العميل: إذا كتب بالعربية فرد بالعربية، وإذا كتب بالإنجليزية فرد بالإنجليزية. استخدم المصطلحات التقنية الإنجليزية عند الحاجة.
لا تعطِ سعراً نهائياً ولا وعداً نهائياً. يمكنك ذكر أن التقدير يحتاج مراجعة بشرية.

يجب جمع هذه المعلومات تدريجياً:
1. نوع المشروع: موقع، تطبيق، نظام، متجر، أو أتمتة.
2. هدف المشروع.
3. الجمهور المستهدف.
4. الصفحات أو الشاشات المطلوبة.
5. الخصائص المطلوبة: تسجيل دخول، لوحة تحكم، دفع، AI Chat، رفع ملفات، إشعارات، تعدد لغات.
6. الأسلوب البصري المطلوب.
7. الميزانية التقريبية.
8. المدة المتوقعة.
9. بيانات التواصل.

عندما تبدو المتطلبات كافية، اختم بملخص Project Brief منظم بعناوين واضحة.
`;

function cleanMessages(messages: ChatMessage[]) {
  return messages
    .filter((message, index) => {
      const isInitialAssistantMessage =
        index === 0 &&
        message.role === "assistant" &&
        message.content.includes("أنا مساعد أحمد الذكي");
      return !isInitialAssistantMessage;
    })
    .slice(-12);
}

function getProviderOrder(): ProviderName[] {
  const configuredOrder = process.env.AI_PROVIDER_ORDER;
  const preferred = (process.env.AI_PROVIDER || "gemini").toLowerCase();

  const requested = configuredOrder
    ? configuredOrder.split(",").map((item) => item.trim().toLowerCase())
    : [preferred, ...DEFAULT_PROVIDER_ORDER];

  return requested.filter((provider, index, array): provider is ProviderName => {
    const isSupported = DEFAULT_PROVIDER_ORDER.includes(provider as ProviderName);
    const isDuplicate = array.indexOf(provider) !== index;
    return isSupported && !isDuplicate;
  });
}

function getTimeoutMs() {
  const rawValue = Number(process.env.AI_TIMEOUT_MS || 12000);
  return Number.isFinite(rawValue) && rawValue > 0 ? rawValue : 12000;
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = getTimeoutMs()) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function parseProviderError(provider: ProviderName, response: Response) {
  const body = await response.text().catch(() => "");
  const retryableCodes = [402, 408, 409, 429, 500, 502, 503, 504];
  const isRetryable = retryableCodes.includes(response.status);
  const reason = isRetryable ? "retryable" : "non_retryable";
  throw new Error(`${provider} ${reason} error: ${response.status} ${body}`);
}

async function askGemini(messages: ChatMessage[]): Promise<AIReply> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: projectAssistantSystemPrompt }],
      },
      contents: cleanMessages(messages).map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      })),
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 700,
      },
    }),
  });

  if (!response.ok) await parseProviderError("gemini", response);

  const data = await response.json();
  const reply = data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text || "")
    .join("")
    .trim();

  if (!reply) throw new Error("Gemini returned empty response");
  return { reply, provider: "gemini", model };
}

async function askGroq(messages: ChatMessage[]): Promise<AIReply> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is missing");

  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  const response = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 700,
      messages: [
        { role: "system", content: projectAssistantSystemPrompt },
        ...cleanMessages(messages),
      ],
    }),
  });

  if (!response.ok) await parseProviderError("groq", response);

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error("Groq returned empty response");
  return { reply, provider: "groq", model };
}

async function askOpenRouter(messages: ChatMessage[]): Promise<AIReply> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is missing");

  const model = process.env.OPENROUTER_MODEL || "openrouter/free";
  const response = await fetchWithTimeout("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
      "X-Title": process.env.SITE_NAME || "Ahmed AI Portfolio",
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 700,
      messages: [
        { role: "system", content: projectAssistantSystemPrompt },
        ...cleanMessages(messages),
      ],
    }),
  });

  if (!response.ok) await parseProviderError("openrouter", response);

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error("OpenRouter returned empty response");
  return { reply, provider: "openrouter", model };
}

async function askOllama(messages: ChatMessage[]): Promise<AIReply> {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "llama3.1:8b";

  const response = await fetchWithTimeout(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      options: {
        temperature: 0.35,
        num_predict: 700,
      },
      messages: [
        { role: "system", content: projectAssistantSystemPrompt },
        ...cleanMessages(messages),
      ],
    }),
  });

  if (!response.ok) await parseProviderError("ollama", response);

  const data = await response.json();
  const reply = data?.message?.content?.trim();
  if (!reply) throw new Error("Ollama returned empty response");
  return { reply, provider: "ollama", model };
}

export async function generateAIReply(messages: ChatMessage[]): Promise<AIReply> {
  const providers: Record<ProviderName, () => Promise<AIReply>> = {
    gemini: () => askGemini(messages),
    groq: () => askGroq(messages),
    openrouter: () => askOpenRouter(messages),
    ollama: () => askOllama(messages),
  };

  const errors: string[] = [];

  for (const provider of getProviderOrder()) {
    try {
      return await providers[provider]();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[AI failover] ${provider} failed:`, message);
      errors.push(`${provider}: ${message}`);
    }
  }

  throw new Error(errors.join(" | "));
}
