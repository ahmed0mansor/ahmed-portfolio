-- Initial schema for Ahmed AI Portfolio
-- Generated for PostgreSQL / Neon / Prisma

CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'REVIEWED', 'CONTACTED', 'ACCEPTED', 'REJECTED');
CREATE TYPE "MessageRole" AS ENUM ('user', 'assistant', 'system');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT,
  "role" TEXT NOT NULL DEFAULT 'admin',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "ClientLead" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "companyName" TEXT,
  "projectType" TEXT NOT NULL,
  "budgetRange" TEXT,
  "timeline" TEXT,
  "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientLead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChatSession" (
  "id" TEXT NOT NULL,
  "clientLeadId" TEXT,
  "openaiConversationId" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChatMessage" (
  "id" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "role" "MessageRole" NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProjectBrief" (
  "id" TEXT NOT NULL,
  "clientLeadId" TEXT NOT NULL,
  "projectType" TEXT NOT NULL,
  "mainGoal" TEXT,
  "targetUsers" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "requiredPages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "requiredFeatures" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "preferredStyle" TEXT,
  "language" TEXT,
  "budgetRange" TEXT,
  "timeline" TEXT,
  "aiSummary" TEXT NOT NULL,
  "rawJson" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProjectBrief_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ChatSession"
  ADD CONSTRAINT "ChatSession_clientLeadId_fkey"
  FOREIGN KEY ("clientLeadId") REFERENCES "ClientLead"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ChatMessage"
  ADD CONSTRAINT "ChatMessage_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectBrief"
  ADD CONSTRAINT "ProjectBrief_clientLeadId_fkey"
  FOREIGN KEY ("clientLeadId") REFERENCES "ClientLead"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "ClientLead_createdAt_idx" ON "ClientLead"("createdAt");
CREATE INDEX "ClientLead_status_idx" ON "ClientLead"("status");
CREATE INDEX "ChatSession_clientLeadId_idx" ON "ChatSession"("clientLeadId");
CREATE INDEX "ChatMessage_sessionId_idx" ON "ChatMessage"("sessionId");
CREATE INDEX "ProjectBrief_clientLeadId_idx" ON "ProjectBrief"("clientLeadId");
