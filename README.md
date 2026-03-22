# CoachHub Lite 🎓

A white-labeled SaaS platform for tutors to create beautiful public coaching pages — with branding, study materials, and announcements.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| UI | Tailwind CSS + shadcn/ui + Framer Motion |
| Auth & DB | [Supabase](https://supabase.com) (PostgreSQL + Auth + Storage) |
| State | TanStack React Query v5 |
| Forms | React Hook Form + Zod |

---

## Features

- **Multi-tenant** — each tutor owns one coaching page, fully isolated
- **Public page** at `/c/{slug}` — hero, contact info, notices, notes
- **Admin dashboard** at `/admin` — profile management, notes upload, notice publishing
- **File storage** — logos, banners, PDFs via Supabase Storage
- **Row Level Security** — PostgreSQL RLS policies on all tables

---

## Getting Started

### 1. Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### 2. Clone & Install

```bash
git clone https://github.com/your-username/coachhub-lite.git
cd coachhub-lite
npm install
```

### 3. Environment Variables

```bash
cp .env.example .env
```

Fill in your Supabase credentials (found in **Project Settings → API**):

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-ref
```

### 4. Database Setup

Run the migration in the Supabase SQL editor. The migration file is at:

```
supabase/migrations/*.sql
```

Copy the file contents and run in **Supabase → SQL Editor → New Query**.

This sets up:
- `profiles`, `coaching`, `notes`, `notices` tables
- Row Level Security policies
- `coaching-assets` storage bucket
- Indexes for performance

### 5. Run Locally

```bash
npm run dev
```

App runs at [http://localhost:8080](http://localhost:8080).

---

## Project Structure

```
src/
├── components/
│   ├── admin/           # Dashboard components (ProfileForm, NotesManager, etc.)
│   ├── public/          # Public page components (HeroSection, InfoSection, etc.)
│   ├── ui/              # shadcn/ui primitives
│   └── ProtectedRoute.tsx
├── hooks/
│   ├── useAuth.tsx      # Auth context
│   └── useCoaching.tsx  # All coaching data hooks (React Query)
├── integrations/
│   └── supabase/        # Supabase client & generated types
├── lib/
│   ├── supabase-helpers.ts  # uploadFile, generateSlug
│   └── utils.ts
└── pages/
    ├── Index.tsx         # Landing page
    ├── AuthPage.tsx      # Login / Register
    ├── AdminDashboard.tsx
    └── PublicCoachingPage.tsx  # /c/:slug
```

---

## Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/auth` | Login / Register |
| `/admin` | Tutor dashboard (protected) |
| `/c/:slug` | Public coaching page |

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import into [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy — done!

### Netlify

1. `npm run build`
2. Deploy `dist/` folder to Netlify
3. Add `_redirects` file for SPA routing:
   ```
   /*  /index.html  200
   ```

### Any Static Host

```bash
npm run build
# Upload the dist/ folder
```

---

## License

MIT
