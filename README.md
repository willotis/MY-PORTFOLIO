# Willis Otis — Personal Portfolio & Admin Dashboard

A production-grade personal portfolio website and secure administration dashboard built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Supabase (PostgreSQL, Auth & Storage)**.

---

## Visual Identity & Design System

- **Deep Navy Base**: `#0d1017`
- **Card Surface**: `#141822` / `#151821`
- **Electric Blue Accent**: `#2563EB`
- **Soft Blue Highlights**: `#93C5FD`
- **Effects**: Accessible contrast, restrained visual accents, responsive touch-friendly targets, and full `prefers-reduced-motion` support.

---

## Key Features

### Public Portfolio
1. **Hero Section (`/`)**:
   - Developer branding and availability status badge
   - High-impact headline: *"Building technology that solves real problems."*
   - Supporting tagline: *"Software Development · Data Analysis · AI Automation"*
   - Portrait frame with clean aspect ratio
   - Quick CTAs: *"Explore My Work"*, *"Let's Work Together"*, and *"Download CV"*
2. **Featured Projects (`/`)**:
   - Consistent `16:10` cards with status pills, category tags, technology badges, live preview, and GitHub links.
   - Initial showcase includes **Salama Link** (Digital Safety) and **Beauty Booker** (Appointment Management).
3. **Capabilities & Skills (`/` and `/about`)**:
   - Categorized skills: Software Development, Web Development, Data Analysis, AI & Automation, Tools & Platforms.
4. **Dedicated Projects Gallery (`/projects`)**:
   - Search by keyword (title, description, or tech stack) and filter by category.
5. **Detailed Project Case Studies (`/projects/[slug]`)**:
   - Problem-solution breakdown, role, contributions, development journey, and screenshots.
6. **Professional Media Gallery (`/media`)**:
   - Image & video gallery with interactive lightbox modal and category filter.
7. **Contact & Hiring (`/contact`)**:
   - Contact form validated with Zod + React Hook Form and persisted to Supabase.
   - Social links and live availability indicators.

---

### Secure Admin Dashboard (`/admin`)
- **Authentication**: Protected via Supabase Auth with server-side middleware and automatic route guarding.
- **Overview Dashboard (`/admin`)**: Real-time stats for projects, unread inquiries, and media files.
- **Profile Manager (`/admin/profile`)**: Update name, title, bio, contact details, social links, availability toggles, and upload avatar to Supabase Storage.
- **Project CMS (`/admin/projects`)**: Create, edit, publish/unpublish, feature on homepage, delete, tag, and write rich case studies.
- **Media Library (`/admin/media`)**: Bulk upload images and videos, manage captions, feature media, or remove assets.
- **CV Manager (`/admin/cv`)**: Upload/replace PDF resume, toggle public download visibility, preview, and download.
- **Messages Inbox (`/admin/messages`)**: Read contact inquiries, mark as read, archive, delete, and 1-click email reply.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React + custom SVG brand icons (GitHub, LinkedIn, Twitter/X, WhatsApp)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + RLS + Auth + Storage)
- **Forms & Validation**: React Hook Form, Zod
- **Notifications**: Sonner

---

## ⚡ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Setup Supabase Database & Storage
1. Go to your **Supabase Project Dashboard** → **SQL Editor**.
2. Create the tables (`profiles`, `projects`, `skills`, `media`, `messages`, `cv_uploads`) and enable Row Level Security (RLS).
3. In **Storage**, create the `avatars`, `projects`, `media`, and `cv` buckets.
4. In **Authentication** → **Users**, add your admin user email and password.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the website.
Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to log in to the admin panel.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🔐 Security & Access Control
- **Row Level Security (RLS)** is enabled on all tables:
  - Public visitors can read published projects, public profiles, skills, media, and post contact inquiries.
  - Full write/update/delete permissions are strictly restricted to authenticated administrators (`auth.role() = 'authenticated'`).
- Route middleware automatically redirects unauthorized visitors trying to access `/admin/*` back to `/admin/login`.
