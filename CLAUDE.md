# SageAAA-26 / AssetHawk-26

**Location:** ~/AppLand/SageAAA-26/
**Package:** sageaaa-2026
**GitHub:** github.com/bsci83/AssetHawk-26

## What This Is
AssetHawk QR code management platform — the QR app, NOT SageAAA.
The folder was formerly called "ninja-sites" but is now correctly identified.

**SageAAA** lives at: `/Volumes/2 TB/SaasLand/V0 built/SageAAA-FinishLine app/`

## Deploy
- **Vercel BETA team** → `bifill83@gmail.com`
- Deploy via: `vercel deploy --yes --prod --token <token>`
- Or push to GitHub → Vercel auto-deploys
- **Token:** (stored in Vercel dashboard, not in files)

## Git Email (CRITICAL)
All commits MUST use `bifill83@gmail.com`:
- Set globally: `git config --global user.email "bifill83@gmail.com"`
- Wrong email = Vercel blocks deployment

## Pages Built (73 total)
- Landing, Auth (/signin, /signup)
- Dashboard, Assets, Scan, Audit, Gallery
- /generator (URL/WiFi/Text QR + logo + colors)
- /bulk (CSV upload + ZIP download)
- /propertypal (WiFi QR for rentals)
- /dynamic-qr (Dynamic QR resolution)
- /integrations (MCP + REST API)
- /organization/* (settings, users, billing, sso)
- /maintenance/* (dashboard, schedules, work orders)
- /reports, /templates

## Connected Services
- **Auth:** NextAuth.js
- **Database:** Turso (assethawk-bifill.turso.io)
- **Hosting:** Vercel BETA team
