import { z } from "zod";
import { compactText, sanitizeText } from "@/lib/security";

const trimmedText = (max: number, min = 0) =>
  z
    .string()
    .transform((value) => sanitizeText(value, max))
    .refine((value) => value.length >= min, min > 0 ? `Must be at least ${min} characters.` : undefined);

const compactedText = (max: number, min = 0) =>
  z
    .string()
    .transform((value) => compactText(value, max))
    .refine((value) => value.length >= min, min > 0 ? `Must be at least ${min} characters.` : undefined);

const optionalText = (max: number) => z.union([trimmedText(max), z.literal("")]).optional();
const optionalCompactText = (max: number) => z.union([compactedText(max), z.literal("")]).optional();

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: trimmedText(2000, 1),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(20),
  client: z
    .object({
      name: optionalCompactText(100),
      email: z.string().email().max(150).optional().or(z.literal("")),
      phone: optionalCompactText(30),
    })
    .optional(),
});

const shortArraySchema = (maxItems: number, maxText: number) =>
  z.array(compactedText(maxText, 1)).max(maxItems).optional();

const rawJsonSchema = z
  .object({
    source: optionalCompactText(80),
    submittedAt: optionalCompactText(80),
    messages: z.array(chatMessageSchema).max(30).optional(),
  })
  .passthrough()
  .optional();

export const leadSchema = z.object({
  name: compactedText(100, 2),
  email: z.string().email().max(150).optional().or(z.literal("")),
  phone: optionalCompactText(30),
  companyName: optionalCompactText(120),
  projectType: compactedText(100, 2),
  mainGoal: optionalText(500),
  targetUsers: shortArraySchema(15, 80),
  requiredPages: shortArraySchema(25, 80),
  requiredFeatures: shortArraySchema(35, 120),
  preferredStyle: optionalText(200),
  language: optionalCompactText(100),
  budgetRange: optionalCompactText(100),
  timeline: optionalCompactText(100),
  aiSummary: trimmedText(8000, 10),
  rawJson: rawJsonSchema,
  // Honeypot field. Real users never fill this; bots often do.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;
