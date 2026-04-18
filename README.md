# Guidely

**Lebanon's University Major Guidance Platform**

> The goal is not just to inform — but to guide real decisions.

| | |
|---|---|
| **Team** | 7 members |
| **Duration** | 37 days (1 month + 6 days) |
| **Frontend** | Next.js 14+ (App Router) |
| **Backend** | Laravel 11+ PHP (API-only) |
| **Database** | MySQL 8.0 (utf8mb4) |

---

## 📖 Documentation Index

| Document | What's inside |
|---|---|
| [`FEATURES.md`](./FEATURES.md) | Complete feature set — core features, admin panel, recommended additions, premium tier, smart recommendations engine |
| [`ROADMAP.md`](./ROADMAP.md) | Sprint roadmap (6 sprints), task assignments, parallel work strategy, milestones, priority order |
| [`DATABASE.md`](./DATABASE.md) | Full database schema (22 tables), entity relationships, indexes, API endpoints reference |

---

## 1. The Problem

Many students in Lebanon face real challenges when choosing a university major. The decision of what to study is one of the most consequential choices a young person makes, yet the support systems available are severely lacking. This leads to poor decisions, dropped programs, wasted years, and significant financial loss for families already under economic pressure.

### Key challenges students face

- **Lack of understanding** — Students don't fully understand what each major actually involves day-to-day. They choose based on vague perceptions, parental pressure, or what their friends are doing — not informed understanding.
- **No connection to the job market** — There is no clear, accessible connection between university majors and the Lebanese job market. Students graduate without knowing whether their degree is in demand locally or internationally.
- **Missing salary and demand data** — Students lack insights about realistic salaries, hiring demand, and career growth specific to Lebanon. Most available data reflects Western markets.
- **Surface-level existing platforms** — Existing platforms mainly list universities and their programs without offering real guidance, comparison tools, or personalized recommendations. They are directories, not advisors.
- **Cultural and family pressure** — Lebanese parents are heavily involved in major decisions, often pushing students toward traditional "safe" fields (medicine, engineering, law) without understanding the evolving job landscape.
- **Economic crisis impact** — The ongoing crisis has dramatically shifted which careers are viable locally versus which require emigration. Students need up-to-date guidance that reflects this reality.

### The consequences

Without proper guidance, students frequently switch majors after one or two years, losing tuition money and time. Some drop out entirely. Others graduate with degrees that have little market value in Lebanon, forcing them into unrelated jobs or emigration without preparation. The ripple effects impact families, universities, and the broader economy.

---

## 2. The Solution

Guidely is a complete guidance platform tailored specifically for Lebanon. It helps students understand:

- What each major actually involves
- What career opportunities exist locally and internationally
- What the market demand and trends look like in Lebanon
- What skills are required for each path
- The honest pros, cons, and challenges

Guidely is designed for **12th grade students (Baccalaureate / Terminale)** and all prospective university students in Lebanon who are confused about what to major in. The platform combines comprehensive data, intelligent matching, and human mentorship to give every student the clarity they need.

---

## 3. Architecture Overview

Guidely has two distinct frontends sharing the same backend API:

```
┌─────────────────────────────────────────────────────────────┐
│                      NEXT.JS APP                            │
│                                                             │
│  /                    ← Public pages (browse, detail, etc.) │
│  /auth/*              ← Login, register, verify             │
│  /dashboard/*         ← Student dashboard (favorites, etc.) │
│  /test/*              ← Personality test flow                │
│  /compare/*           ← Comparison tool                     │
│  /mentorship/*        ← Mentor directory & booking          │
│                                                             │
│  /admin/*             ← ADMIN-ONLY ROUTES (separate layout) │
│  /admin/majors        ← Admin majors CRUD page              │
│  /admin/universities  ← Admin universities CRUD page        │
│  /admin/faqs          ← Admin FAQ management                │
│  /admin/test-bank     ← Admin test questions management     │
│  /admin/users         ← Admin user management               │
│  /admin/analytics     ← Admin platform analytics            │
├─────────────────────────────────────────────────────────────┤
│                    LARAVEL API                              │
│                                                             │
│  /api/v1/*            ← Public + Auth endpoints             │
│  /api/v1/admin/*      ← Admin-only endpoints (middleware)   │
│                                                             │
│  Middleware: role:admin gates all /admin/* routes            │
│  Admin sign-up: only via invite code or manual DB seed      │
└─────────────────────────────────────────────────────────────┘
```

### How the admin panel works

The admin panel is **not** a separate project — it lives inside the same Next.js app under the `/admin` route group. It uses a completely different layout, different UI components, and different navigation. When an admin logs in, they are redirected to `/admin/majors` as their landing page.

Key architectural decisions:
- **Separate route group** — `/admin/*` has its own layout (`AdminLayout`) with sidebar navigation, distinct from the student-facing layout
- **Separate UI/UX** — Admin pages use data tables with inline editing, bulk actions, and management-focused design. The student-facing majors page is a visual, card-based browsing experience. The admin majors page is a dense, sortable, filterable data table with CRUD modals.
- **Role-based middleware** — Both frontend (Next.js middleware checking user role) and backend (Laravel `role:admin` middleware) enforce access control
- **Admin accounts are not self-registered** — Admins are created via database seeder or by another admin through the user management page. There is no public admin registration.

---

## 4. Team Structure

| Role | Count | Responsibilities |
|---|---|---|
| **Frontend Lead** | 1 | Next.js architecture, routing, state management, code reviews. Owns the design system, component library, responsive behavior. Builds admin panel layout and pages. |
| **Frontend Dev** | 1 | UI implementation across all student-facing pages, responsive design, animations, API integration. |
| **Backend Lead** | 1 | Laravel architecture, auth system, API design, code reviews. Owns the API contract document. Builds admin API endpoints with role middleware. |
| **Backend Dev** | 1 | API endpoints, business logic (scoring engine, comparison algorithm, recommendation engine), third-party integrations. |
| **DB & DevOps** | 1 | Schema design, migrations, seeders (including admin user seed), query optimization, indexing. Deployment pipeline, CI/CD, server setup, monitoring. |
| **Data Researcher** | 1 | Full-time research and data entry for first 3 weeks. Majors, universities, salary data, market trends, hiring companies, FAQs. |
| **Full-Stack Flex** | 1 | Fills gaps wherever needed. QA testing, bug triage, documentation, data entry support → then feature development. |

---

## 5. Tech Stack

### Frontend (Next.js)

- Next.js 14+ with App Router — SSR and SEO
- Tailwind CSS — utility-first, mobile-first responsive design
- React Query (TanStack Query) — server state, caching, background refetching
- Zustand — client-side state (preferences, UI)
- React Hook Form + Zod — type-safe form validation
- Recharts — data visualizations (radar charts, salary graphs, demand trends)
- Framer Motion — page transitions, skeleton loaders, micro-interactions
- next-intl — future Arabic/French localization

### Backend (Laravel PHP)

- Laravel 11+ — API-only configuration (no Blade, JSON only)
- Laravel Sanctum — stateless token-based authentication
- MySQL 8.0 — utf8mb4 encoding for Arabic text
- Redis — caching hot data (majors list, categories, search results)
- Laravel Scout + Meilisearch — full-text search
- Laravel Cashier + Stripe — premium subscriptions
- OpenAI / Anthropic Claude API — AI career advisor chatbot
- Laravel Queues (Redis) — background jobs (email, AI responses, data processing)

### Infrastructure & DevOps

- **Frontend hosting**: Vercel (automatic SSL, CDN, preview deployments per branch)
- **Backend hosting**: DigitalOcean Droplet or AWS Lightsail
- **Database**: Managed MySQL (PlanetScale or DigitalOcean Managed Database)
- **CDN/Security**: Cloudflare (DNS, edge caching, DDoS protection)
- **CI/CD**: GitHub Actions (test on PR, deploy on merge to main)
- **Error tracking**: Sentry (both frontend and backend)
- **File storage**: DigitalOcean Spaces or AWS S3

---

## 6. Strategic Advice

> Read this before you start coding. Seriously.

1. **Data quality is everything.** Your platform lives or dies by the accuracy and depth of major information. Assign 1–2 dedicated team members to data research for the first 3 weeks. Bad data = useless platform. Every major page should feel like it was written by someone who actually studied that field.

2. **Build the scoring engine correctly from day one.** The two-level scoring system (categories → majors) is your core intellectual property. Spend real time designing the question bank and score weights. Test with actual students before launch. Wrong recommendations will destroy trust instantly.

3. **Mobile-first design is non-negotiable.** Lebanese students will primarily use this on their phones. Every page must work perfectly on mobile. Test on actual Android and iOS devices, not just browser dev tools. Many students have older, lower-end devices.

4. **Architect for Arabic from day one.** Even if V1 is English-only, design the database and UI for bilingual content from the start. Every text field has `_en` and `_ar` variants in the schema. Adding Arabic later is 10x harder.

5. **Don't over-scope premium at launch.** Launch premium with exactly 3 features: AI chatbot + detailed test results + expert mentorship. Fewer polished features > many half-built ones.

6. **Parallel workstreams are essential.** With 7 people and 37 days, sequential work guarantees failure. Frontend and backend must work in parallel from Day 1, connected by the API contract document. That document is Sprint 0's most important deliverable.

7. **Content is the moat.** Any developer can build a comparison tool. What can't be easily replicated is 300+ thoroughly researched major profiles with honest, Lebanon-specific data. Invest heavily in content quality.

8. **Build the admin panel early, not late.** The admin CRUD for majors is how your Data Researcher will enter content. If the admin panel isn't ready until Sprint 4, your researcher is blocked or entering data through raw SQL for 3 weeks. Move admin majors CRUD to Sprint 1 so data entry can use the real system.

---

## Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd guidely

# Frontend
cd frontend
npm install
cp .env.example .env.local
npm run dev

# Backend (separate terminal)
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed    # Seeds categories, skills, and admin user
php artisan serve
```

**Default admin credentials (from seeder):**
```
Email: admin@guidely.com
Password: change-me-on-first-login
```

---

*Guidely — Guiding Lebanon's students toward the future they deserve.*
