# CoachHub Lite 🎓

![CoachHub Lite Banner](public/banner.png)

A premium, white-labeled SaaS platform for tutors and educators to create stunning public coaching pages. Manage your educational brand, share study materials, and post announcements from a centralized dashboard.

---

## ✨ Features

- **🛡️ Multi-tenant Architecture** — Each tutor gets a fully isolated coaching page.
- **🚀 Public Profile Page (`/c/{slug}`)** — Features a beautiful hero section, contact information, social links, and study resources.
- **⚙️ Admin Dashboard (`/admin`)** — A clean interface for profile management, notes upload, and notice publishing.
- **📁 Integrated File Storage** — Seamless management of logos, banners, and study PDFs via Supabase Storage.
- **🔐 Row-Level Security** — Robust PostgreSQL RLS policies ensuring data privacy for every user.
- **📅 Calendly Integration** — Let your students book sessions directly from your public page.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + TypeScript + [Vite](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Backend & Auth** | [Supabase](https://supabase.com) (PostgreSQL + Auth + Storage) |
| **Data Fetching** | [TanStack React Query v5](https://tanstack.com/query/latest) |
| **Form Management** | React Hook Form + Zod |

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: v18.0 or higher
- **Supabase**: A free Supabase account and project

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Deepak619261/coachconnect-hub.git
cd coachconnect-hub
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### 4. Database Setup

1. Go to your **Supabase Dashboard** -> **SQL Editor**.
2. Copy the content from the latest migration file in `supabase/migrations/`.
3. Run the SQL to set up the necessary tables (`profiles`, `coaching`, `notes`, `notices`) and RLS policies.
4. Create a storage bucket named `coaching-assets` in **Supabase Storage**.

### 5. Running the Application

```bash
npm run dev
```

The application will be available at [http://localhost:8080](http://localhost:8080).

---

## 📂 Project Structure

```text
src/
├── components/          # Reusable UI components
│   ├── admin/           # Dashboard-specific logic
│   ├── public/          # Public-facing page views
│   └── ui/              # shadcn/ui primitives
├── hooks/               # Custom React hooks (Auth, Coaching data)
├── integrations/        # Supabase client and auto-generated types
├── lib/                 # Shared helper functions
└── pages/               # Application routes and main views
```

---

## 🛡️ Security Note

> [!IMPORTANT]
> This project has been audited for sensitive information. `.env` and other secret files are excluded from version control to prevent unauthorized access to your Supabase instance. Always keep your `VITE_SUPABASE_ANON_KEY` private if possible, though it is intended for client-side use in Supabase architectures.

---

## 📄 License

This project is licensed under the MIT License.
