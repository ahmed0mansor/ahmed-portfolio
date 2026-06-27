# Security Hardening Notes

This version adds practical security protections for the public portfolio, AI chat, lead intake, dashboard, and CV download.

## Added protections

- Rate limiting for `/api/chat`, `/api/leads`, `/api/settings`, and `/api/cv`.
- Maximum request body sizes before JSON parsing.
- Same-origin checks for public POST endpoints and admin mutations.
- Stronger admin authorization using constant-time token comparison.
- Admin APIs now fail closed if `ADMIN_TOKEN` is missing or too short.
- Admin token is no longer stored in `localStorage`; it uses `sessionStorage` only.
- Honeypot field for the lead form to reject basic bots.
- Server-side validation and sanitization for chat, lead, and editable site content.
- Security headers: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- `robots.ts` blocks indexing of `/dashboard` and `/api`.
- Generic server error messages to avoid leaking infrastructure details.
- Private CV download remains behind `/api/cv` and is rate limited.

## Required environment variables

Use a strong `ADMIN_TOKEN` with at least 16 characters.

Recommended:

```env
ADMIN_TOKEN="use-a-long-random-admin-token"
NEXT_PUBLIC_SITE_URL="https://your-vercel-domain.vercel.app"
SITE_URL="https://your-vercel-domain.vercel.app"
```

`NEXT_PUBLIC_SITE_URL` and `SITE_URL` help strict origin checks after deployment.

## Remaining production recommendations

For higher traffic, replace the in-memory rate limiter with a persistent serverless rate limiter such as Upstash Redis. The current rate limiter is suitable for MVP/Vercel hobby deployments but can reset when serverless instances restart.
