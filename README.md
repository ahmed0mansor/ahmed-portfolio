# Ahmed AI Portfolio

Next.js portfolio website with AI Project Assistant, Neon PostgreSQL, Prisma, Gemini/Groq failover, full content dashboard, CV toggle, and client lead intake.

## Main features

- Professional Arabic portfolio using Cairo font.
- Full admin dashboard at `/dashboard`.
- Change colors, layout, text, skills, services, projects, contact data, and section visibility from the dashboard.
- Enable/disable CV download from the dashboard.
- AI Chat Widget using Gemini first, then Groq fallback.
- Client lead intake: the visitor chats with the assistant, enters contact data, and clicks **إرسال الطلب الآن**.
- Leads are saved in Neon PostgreSQL and shown in the dashboard.
- Lead statuses: NEW, REVIEWED, CONTACTED, ACCEPTED, REJECTED.
- Optional notifications through Telegram or Resend email.

## Required Vercel environment variables

```env
DATABASE_URL=your_neon_pooled_url
DIRECT_URL=your_neon_direct_url

AI_PROVIDER=gemini
AI_PROVIDER_ORDER=gemini,groq
AI_TIMEOUT_MS=12000

GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-2.5-flash-lite

GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.1-8b-instant

ADMIN_TOKEN=your_strong_admin_token
```

## Optional lead notifications

### Telegram notification

Add these variables in Vercel:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

When a new client lead is saved, the website sends a Telegram message with the client name, phone, project type, timeline, budget, and summary.

### Email notification with Resend

Add these variables in Vercel:

```env
RESEND_API_KEY=your_resend_key
LEADS_NOTIFY_EMAIL=your_email@example.com
LEADS_NOTIFY_FROM=Ahmed Portfolio <onboarding@resend.dev>
```

If notification variables are not set, the system still saves leads and displays them in the dashboard.

## Deploy

The build command is already configured:

```bash
prisma generate && prisma migrate deploy && next build
```

After pushing to GitHub, Vercel will deploy automatically.

## Dashboard usage

1. Open `/dashboard`.
2. Enter your `ADMIN_TOKEN`.
3. Click **تحميل الطلبات** to view AI Chat requests.
4. Click **تحميل الإعدادات** to edit website content/design.
5. Save updates.

## Auto Color Rotation

The dashboard includes an automatic color rotation option:

- Static theme selection remains available.
- Auto rotation can be enabled from `Dashboard → الألوان والشكل`.
- Supported intervals: 10 seconds or 15 seconds.
- The site cycles through all built-in themes: Cyber Blue, Emerald Green, Royal Purple, and Sunset Orange.

## Latest bilingual dashboard update

This version includes:

- Full Arabic/English rendering with RTL/LTR alignment.
- Arabic labels for AI Assistant as `المساعد الذكي`.
- Correct name defaults:
  - Arabic: `أحمد شوقي منصور`
  - English: `AHMED SHAWQI MANSOUR`
- Dashboard editing for Arabic and English content separately.
- `contentEn` settings stored in the existing `SiteSetting` table; no new database is required.
- Legacy Arabic content normalization so older saved defaults are upgraded automatically where possible.

Recommended Vercel settings:

- Node.js: `24.x`
- Install Command: `corepack enable && corepack prepare yarn@1.22.22 --activate && yarn install --ignore-engines --non-interactive`
- Build Command: `yarn build`
- Output Directory: Next.js default
