# Ninja Sites Boilerplate 🚀

A modern, production-ready Next.js website template with all the essentials built in.

---

## What's Included

### Tech Stack
- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS** + **Shadcn UI**
- **Firebase Auth**
- **Turso** (SQLite for AI/agent data)
- **Framer Motion** (animations)
- **Resend** (email)

### Pages
- Landing page with 8 professional sections
- Dashboard
- Projects
- Tasks
- CRM
- Chat (AI chatbot)
- Analytics
- Accountability
- Settings

### Components
- Hero, Features, Services, Process, Portfolio, Testimonials, CTA, Contact
- Header with navigation
- Footer
- Reusable UI components

---

## Quick Start

### 1. Clone
```bash
git clone https://github.com/bsci83/ninja-sites.git your-project-name
cd your-project-name
```

### 2. Install
```bash
npm install
```

### 3. Configure Env
Copy `.env.example` to `.env` and fill in your keys:
```bash
cp .env.example .env
```

### 4. Run
```bash
npm run dev
```

---

## Customization

### Branding
Replace these to customize for your company:

| File | What to Change |
|------|----------------|
| `src/app/page.tsx` | Company name in hero/CTA |
| `src/components/layout/header.tsx` | Logo and nav links |
| `src/components/layout/footer.tsx` | Footer links and contact |
| `tailwind.config.ts` | Brand colors |
| `src/app/globals.css` | CSS variables |

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication (Email/Password, Google)
3. Add your config to `.env`

### Turso Setup
1. Create a Turso database
2. Add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` to `.env`

### Resend Setup
1. Get API key from resend.com
2. Add to `.env`

---

## Deployment

### Firebase Hosting
```bash
firebase init hosting
# Select your project
firebase deploy --only hosting
```

### Vercel
```bash
vercel --prod
```

---

## Project Structure

```
ninja-sites/
├── src/
│   ├── app/              # Next.js pages
│   │   ├── page.tsx      # Landing page
│   │   ├── dashboard/    # Dashboard pages
│   │   └── ...
│   ├── components/
│   │   ├── sections/     # Landing page sections
│   │   ├── layout/      # Header, Footer
│   │   └── ui/          # Shadcn components
│   └── lib/
│       ├── firebase.ts  # Firebase config
│       ├── turso.ts     # Turso client
│       └── utils.ts     # Utilities
├── public/
├── .env.example
├── package.json
└── next.config.ts
```

---

## License

MIT
