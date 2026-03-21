# SageAAA-2026

White-label SaaS framework for building AI-powered business platforms.

## Quick Start

```bash
cd sageaaa-2026
npm install
npm run dev
```

## Environment

Copy `.env.example` to `.env.local` and configure:

- Turso DB credentials
- Firebase Auth
- Resend API key

## Pages

- `/` - Landing page
- `/dashboard` - Main dashboard
- `/projects` - Project management
- `/tasks` - Task tracking
- `/crm` - Customer relationship management
- `/chat` - AI chatbot (ctrl-a)
- `/analytics` - KPI dashboards
- `/settings` - Account & integrations

## Tech Stack

- Next.js 14 (App Router)
- shadcn/ui + Tailwind
- Firebase Auth
- Turso DB
- Resend (email)

## Agent Integration

Run session logger after work:
```bash
./scripts/log-session.sh "summary" "details"
```
