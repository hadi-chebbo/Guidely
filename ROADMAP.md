# Guidely — Sprint Roadmap

> 6 sprints over 37 days. 7 team members. Admin panel built early so data entry uses the real system.

---

## Table of Contents

- [What Changed from the Previous Plan](#what-changed-from-the-previous-plan)
- [Sprint Overview](#sprint-overview)
- [Sprint 0 — Foundation & Setup (Days 1–3)](#sprint-0--foundation--setup-days-13)
- [Sprint 1 — Core Data, Auth & Admin Majors CRUD (Days 4–10)](#sprint-1--core-data-auth--admin-majors-crud-days-410)
- [Sprint 2 — Comparison, Universities & Admin Expansion (Days 11–18)](#sprint-2--comparison-universities--admin-expansion-days-1118)
- [Sprint 3 — Personality Test, Recommendations & Mentorship (Days 19–27)](#sprint-3--personality-test-recommendations--mentorship-days-1927)
- [Sprint 4 — Premium Features, AI & Polish (Days 28–34)](#sprint-4--premium-features-ai--polish-days-2834)
- [Sprint 5 — Testing, Deployment & Launch (Days 35–37)](#sprint-5--testing-deployment--launch-days-3537)
- [Parallel Work Strategy](#parallel-work-strategy)
- [Priority Order — If Time Runs Short](#priority-order--if-time-runs-short)
- [Key Milestones](#key-milestones)

---

## What Changed from the Previous Plan

The admin panel was originally a single Sprint 4 task. That was a mistake — the Data Researcher needs the admin CRUD interface to enter content efficiently from the beginning, not through raw SQL. Here's what moved:

| What | Before | Now | Why |
|---|---|---|---|
| Admin majors CRUD (backend) | Sprint 4, Day 28–32 | **Sprint 1, Day 4–8** | Data Researcher needs this to enter majors from Day 8 onward |
| Admin majors CRUD (frontend) | Sprint 4, Day 29–33 | **Sprint 1, Day 6–10** | Unblocks data entry through the real UI |
| Admin layout + routing + middleware | Sprint 4 | **Sprint 0, Day 2–3** | `/admin` route group, layout shell, role middleware must exist first |
| Admin universities CRUD | Sprint 4 | **Sprint 2, Day 11–14** | Needed when university data entry begins |
| Admin FAQ management | Sprint 4 | **Sprint 2, Day 15–17** | FAQ content entry starts mid Sprint 2 |
| Admin test bank management | Sprint 4 | **Sprint 3, Day 19–22** | Test questions need admin UI before test UI can be finalized |
| Admin users + analytics | Sprint 4 | **Sprint 4, Day 28–32** | These are genuinely non-urgent — fine to keep late |
| Sprint 4 name | "Premium Features, AI & Admin" | **"Premium Features, AI & Polish"** | Admin work is distributed, Sprint 4 focuses on premium + polish |

**The admin panel is now built incrementally across Sprints 0–3**, with each admin page delivered just before the Data Researcher needs it.

---

## Sprint Overview

```
Days  1 ──── 3 ──── 10 ──── 18 ──── 27 ──── 34 ──── 37
      │      │       │       │       │       │       │
      ▼      ▼       ▼       ▼       ▼       ▼       ▼
   Sprint 0  │  Sprint 1 │ Sprint 2 │ Sprint 3│Sprint4│S5│
   Setup &   │  Core     │ Compare  │ Test &  │Premium│QA│
   Foundation│  Data,    │ Unis,    │ Recos & │AI &   │& │
   + Admin   │  Auth &   │ Users &  │ Mentors │Polish │🚀│
   Layout    │  Admin    │ Admin    │ + Admin │       │  │
             │  Majors   │ Expand   │ TestBank│       │  │
```

**Priority key:**
- 🔴 `CRITICAL` — Must complete or sprint fails. Blocks downstream work.
- 🟠 `HIGH` — Important for sprint goals. Should complete.
- 🔵 `MEDIUM` — Valuable but can slip to next sprint if needed.
- ⚪ `LOW` — Nice to have. Cut first if time is tight.

---

## Sprint 0 — Foundation & Setup (Days 1–3)

**Goal:** Every team member can run the project locally. Database exists. API contract documented. Admin route shell ready.

| Who | Task | Days | Priority |
|---|---|---|---|
| **ALL (7)** | Environment setup: Git repo, branching strategy (GitFlow: `main`, `develop`, `feature/*`), CI/CD with GitHub Actions, dev/staging environments | 1 | 🔴 CRITICAL |
| **Backend Lead** | Laravel scaffold: install Laravel 11, Sanctum auth, CORS for Next.js, API versioning (`/api/v1/`), folder structure (Controllers → Services → Repositories). **Create `role:admin` middleware and admin route group** (`/api/v1/admin/*`) | 1–2 | 🔴 CRITICAL |
| **Frontend Lead** | Next.js scaffold: initialize Next.js 14+ App Router, Tailwind config, layout components (Navbar, Footer, Sidebar), routing structure, React Query setup. **Create `/admin` route group with `AdminLayout` (sidebar, separate nav), admin middleware in `middleware.ts`** | 1–3 | 🔴 CRITICAL |
| **DB & DevOps** | Create ALL database migrations (see [`DATABASE.md`](./DATABASE.md)), write seeders for categories, skills, sample majors, **and admin user** (`admin@guidely.com`). MySQL with utf8mb4 | 1–3 | 🔴 CRITICAL |
| **Backend Dev** | Design and document complete REST API contract (OpenAPI/Swagger). Every endpoint, request/response shape, auth requirements, error codes. **Include all `/admin/*` endpoints in the contract.** | 2–3 | 🔴 CRITICAL |
| **Data Researcher + Flex** | Begin data collection: compile full list of majors in Lebanon, all universities (public/private), tuition info, admission requirements. Sources: university websites, Ministry of Education, direct outreach | 1–3 | 🔴 CRITICAL |

**Sprint 0 Definition of Done:**
- [ ] Both projects run locally for all 7 members
- [ ] All database tables migrated with seed data (including admin user)
- [ ] API contract document published (including admin endpoints)
- [ ] `/admin` route group exists with `AdminLayout` shell (sidebar, header, empty pages)
- [ ] Admin middleware working: non-admins redirected away from `/admin/*`
- [ ] Git repo with branch protection rules active
- [ ] Initial data spreadsheet with 20+ majors outlined

---

## Sprint 1 — Core Data, Auth & Admin Majors CRUD (Days 4–10)

**Goal:** Users can register, log in, browse majors, and view details. Admin can create, edit, and delete majors through a dedicated admin interface. Data Researcher starts using admin panel by Day 8.

| Who | Task | Days | Priority |
|---|---|---|---|
| **Backend Lead** | Auth system: registration + email verification, login (Sanctum JWT), logout, password reset, user profile CRUD, role middleware (`student`, `mentor`, `admin`) | 4–7 | 🔴 CRITICAL |
| **Backend Lead** | **Admin Majors API**: full CRUD endpoints under `/api/v1/admin/majors` — create major with all fields, update, delete (soft), list with sorting/filtering/pagination, toggle featured. **Include nested CRUD for pros, cons, skills, job opportunities, hiring companies, FAQs within the major endpoints.** | 4–8 | 🔴 CRITICAL |
| **Backend Dev** | Public APIs for core resources: majors list (with filters, search, pagination), major detail (with all relations), categories list, universities list, skills list | 4–8 | 🔴 CRITICAL |
| **Frontend Lead** | **Admin Majors Page** (`/admin/majors`): data table with sortable columns (name, category, difficulty, demand, duration, featured, updated_at), column filters, search, pagination, row selection. Quick toggle for `is_featured`. "Data completeness" indicator per row. "Add Major" button. | 5–8 | 🔴 CRITICAL |
| **Frontend Lead** | **Admin Major Create/Edit Form** (`/admin/majors/create`, `/admin/majors/[id]/edit`): full-page form with all fields organized in sections — basic info, overview, pros/cons (dynamic add/remove), skills (tag selector), job opportunities (nested form), hiring companies, FAQs, day-in-life, challenges. Auto-save draft. | 7–10 | 🔴 CRITICAL |
| **Frontend Dev** | Auth pages: login, register (with onboarding fields), forgot password, email verification. Client-side validation (React Hook Form + Zod), error handling | 4–7 | 🔴 CRITICAL |
| **Frontend Dev** | Student-facing Majors Explorer page: grid/list toggle, category filter sidebar, debounced search bar, skeleton loaders, empty states, pagination | 5–9 | 🔴 CRITICAL |
| **Frontend Dev** | Student-facing Major Detail page: full layout — overview, pros/cons, skills tags, jobs table, demand indicator, challenges, day-in-life, FAQ accordion, hiring companies, related majors | 7–10 | 🔴 CRITICAL |
| **Data Researcher** | Collect data in spreadsheet (days 4–7), then **switch to admin panel for data entry from Day 8 onward**. Target: 30+ majors entered through admin UI by end of sprint. Validate salary data against real job postings. | 4–10 | 🟠 HIGH |
| **Flex** | Help Data Researcher with data collection (days 4–6), then shift to QA: test admin CRUD operations, test auth flow, test public API responses | 4–10 | 🟠 HIGH |
| **ALL** | **Sprint 1 Review:** FE-BE integration testing, admin CRUD working end-to-end, mobile responsive check on student pages | 9–10 | 🟠 HIGH |

**Sprint 1 Definition of Done:**
- [ ] Auth works end-to-end (register → verify → login → protected routes)
- [ ] **Admin can create, edit, delete, and list majors through `/admin/majors`**
- [ ] **Admin major form handles all nested data (pros, cons, skills, jobs, FAQs)**
- [ ] **Data Researcher is actively using admin panel for data entry**
- [ ] Student-facing Majors Explorer loads real data with search/filter
- [ ] Student-facing Major Detail page renders all sections
- [ ] 30+ majors entered through admin UI
- [ ] First FE ↔ BE integration verified

---

## Sprint 2 — Comparison, Universities & Admin Expansion (Days 11–18)

**Goal:** Comparison system live. University pages complete. Admin panel expanded with universities and FAQ management.

| Who | Task | Days | Priority |
|---|---|---|---|
| **Backend Lead** | Comparison API: accept up to 3 major IDs, return structured side-by-side data. Smart Third-Major Suggestion algorithm (shared skills analysis) | 11–13 | 🟠 HIGH |
| **Backend Lead** | **Admin Universities API**: full CRUD under `/api/v1/admin/universities` — create, update, delete, list with filters. Manage `university_majors` pivot (which majors a university offers, with credit pricing, admission requirements). | 11–14 | 🟠 HIGH |
| **Backend Dev** | Public Universities API: list with filters (public/private, location, major), detail with all programs, credit pricing, admission, scholarships | 11–14 | 🟠 HIGH |
| **Backend Dev** | User features APIs: favorites (toggle, list), comparison history (auto-save, list), user preferences (profile update, onboarding data) | 12–15 | 🟠 HIGH |
| **Backend Lead** | **Admin FAQ API**: CRUD for FAQ entries per major. Admin can bulk-add FAQs, reorder them. | 15–17 | 🔵 MEDIUM |
| **Frontend Lead** | **Admin Universities Page** (`/admin/universities`): data table with CRUD, similar pattern to majors admin page. Edit form includes managing offered majors (add/remove majors to university with program-specific details). | 12–16 | 🟠 HIGH |
| **Frontend Lead** | **Admin FAQ Page** (`/admin/faqs`): select major → manage Q&A pairs. Add/remove/reorder. Preview how FAQs appear to students. | 16–18 | 🔵 MEDIUM |
| **Frontend Dev** | Student-facing Comparison page: major selector (search + add up to 3), side-by-side cards, radar chart (Recharts), third-major suggestion card | 11–16 | 🟠 HIGH |
| **Frontend Dev** | Student-facing University pages: listing with filters, detail page (programs + costs + requirements), "Top universities for this major" on detail pages | 13–17 | 🟠 HIGH |
| **Frontend Dev** | User dashboard: saved majors grid, comparison history timeline, profile settings, account management | 15–18 | 🔵 MEDIUM |
| **Data Researcher** | **Using admin panel full-time**: enter university data through admin UI, enter FAQ content per major, reach **80+ majors** with complete data | 11–18 | 🟠 HIGH |
| **ALL** | **Sprint 2 Review:** End-to-end flow testing (browse → detail → compare → save), admin CRUD for universities working, responsive audit | 17–18 | 🟠 HIGH |

**Sprint 2 Definition of Done:**
- [ ] Comparison system live with radar chart and third-major suggestion
- [ ] **Admin universities CRUD fully operational**
- [ ] **Admin FAQ management working**
- [ ] Student-facing university pages complete with filtering and cost info
- [ ] User dashboard functional (favorites + history + settings)
- [ ] 80+ majors and all universities entered through admin UI
- [ ] Responsive on mobile, tablet, desktop

---

## Sprint 3 — Personality Test, Recommendations & Mentorship (Days 19–27)

**Goal:** Personality test works with scoring engine. Compatibility scores display. Admin test bank management complete. Mentorship system operational.

| Who | Task | Days | Priority |
|---|---|---|---|
| **Backend Lead** | Personality test engine: two-level scoring system, questions bank API, submission endpoint (run algorithm → ranked results), results storage | 19–24 | 🟠 HIGH |
| **Backend Lead** | **Admin Test Bank API**: CRUD for test questions and options under `/api/v1/admin/test-questions`. Each option has `category_scores` and `major_scores` JSON fields. Activate/deactivate questions. Preview scoring simulation. | 19–22 | 🟠 HIGH |
| **Frontend Lead** | **Admin Test Bank Page** (`/admin/test-bank`): manage questions — create/edit/delete with inline option editing, score weight inputs for each option (JSON editor or structured form), activate/deactivate toggle, reorder questions. **Scoring preview**: enter sample answers → see which majors would be recommended. | 19–24 | 🟠 HIGH |
| **Frontend Dev** | Student-facing Test UI: multi-step wizard, progress bar, animated transitions, question type renderers (single, multiple, scale slider), results page with ranked major cards + compatibility percentages | 20–25 | 🟠 HIGH |
| **Backend Dev** | Smart recommendations: third-major algorithm refinement, compatibility score calculation for any major given test results, "top universities for this major" ranking | 19–22 | 🔵 MEDIUM |
| **Backend Dev** | Mentorship system: mentor profile CRUD, availability/scheduling API, booking + confirmation flow, rating + feedback endpoints | 22–26 | 🔵 MEDIUM |
| **Frontend Dev** | Mentorship pages: mentor directory with search/filters, profile cards, booking flow (select time → confirm → confirmation), session history | 23–27 | 🔵 MEDIUM |
| **Frontend Dev** | Market research section: job trends charts, hiring companies carousel, salary calculator tool, future outlook indicators | 22–25 | 🔵 MEDIUM |
| **Data Researcher** | **Using admin test bank**: enter all test questions with scored options. Finalize ALL major data (target: **120+ majors**), market research stats, hiring companies, salary ranges. Test the scoring with sample answers. | 19–25 | 🟠 HIGH |
| **Flex** | Intensive QA: test quiz with varied answers and verify scoring, test admin CRUD edge cases (empty fields, duplicate slugs, bulk delete), comparison edge cases, accessibility audit | 24–27 | 🟠 HIGH |
| **ALL** | **Sprint 3 Review:** Full regression test, scoring engine validation with real data, performance profiling, fix N+1 queries | 26–27 | 🟠 HIGH |

**Sprint 3 Definition of Done:**
- [ ] Personality test: questions render → scoring works → results show ranked majors
- [ ] **Admin test bank: questions and options manageable with scoring weights**
- [ ] **Scoring preview works in admin (enter answers → see results)**
- [ ] Compatibility % displays on major pages for users who took the test
- [ ] Mentorship directory and booking flow working
- [ ] Market data and salary info visible on major pages
- [ ] 120+ majors complete with all data fields
- [ ] All admin CRUD pages complete (majors, universities, FAQs, test bank)

---

## Sprint 4 — Premium Features, AI & Polish (Days 28–34)

**Goal:** AI chatbot works. Admin users + analytics pages. Premium gating in place. Full polish pass.

| Who | Task | Days | Priority |
|---|---|---|---|
| **Backend Dev** | AI chatbot: integrate OpenAI/Claude API, conversation management (create, continue, history), inject major/market data as context, rate limiting (3 msg/day free) | 28–31 | 🔵 MEDIUM |
| **Frontend Dev** | AI chatbot UI: floating widget (expand/collapse), message bubbles, suggested prompts, typing indicator, conversation history, premium gate + upgrade prompt | 28–31 | 🔵 MEDIUM |
| **Backend Lead** | Premium subscriptions: Stripe via Laravel Cashier, plan management, feature-gating middleware, payment webhooks | 28–32 | ⚪ LOW |
| **Frontend Dev** | Premium UI: pricing page, Stripe Elements checkout, upgrade prompts on gated features (blurred + "Unlock with Premium"), subscription management | 30–33 | ⚪ LOW |
| **Backend Lead** | **Admin Users Page API**: list users with search/filter/pagination, change user role, view user activity. **Admin Analytics API**: platform stats (signups over time, popular majors, test completion rates, most compared majors). | 28–31 | 🟠 HIGH |
| **Frontend Lead** | **Admin Users Page** (`/admin/users`): data table with search, role badges, change role dropdown (student/mentor/admin). **Admin Mentors Page** (`/admin/mentors`): verify/reject mentors, view sessions. | 28–31 | 🟠 HIGH |
| **Frontend Lead** | **Admin Analytics Page** (`/admin/analytics`): line charts (signups over time), bar charts (popular majors, test completion), stats cards (total users, total majors, total comparisons). | 31–33 | 🔵 MEDIUM |
| **ALL (7)** | **Final polish:** responsive audit (5+ devices), WCAG 2.1 AA accessibility, SEO meta + Open Graph tags, loading states everywhere, error boundaries, 404 page, empty states | 32–34 | 🔴 CRITICAL |

**Sprint 4 Definition of Done:**
- [ ] AI chatbot functional with rate limiting
- [ ] **Admin users page operational (list, search, change roles)**
- [ ] **Admin analytics page showing real platform data**
- [ ] **All admin pages complete and polished**
- [ ] Premium features gated (if implemented)
- [ ] All student-facing pages polished: loading, error, empty states
- [ ] SEO tags on all public pages
- [ ] Accessibility audit passed

---

## Sprint 5 — Testing, Deployment & Launch (Days 35–37)

**Goal:** Ship it. 🚀

| Who | Task | Days | Priority |
|---|---|---|---|
| **Backend Lead + Dev** | Final bug fixes, API performance optimization, DB indexing, Redis caching for hot data | 35–36 | 🔴 CRITICAL |
| **Frontend Lead + Dev** | Final bug fixes, Lighthouse audit (target: 90+), image optimization (WebP), lazy loading, code splitting | 35–36 | 🔴 CRITICAL |
| **DB & DevOps** | Production deployment: server provisioning, SSL, domain config, env variables, production migration + seed (admin user), Sentry monitoring, backup strategy | 35–36 | 🔴 CRITICAL |
| **Data Researcher + Flex** | Final data validation: spot-check 50 random majors for accuracy, verify university links, ensure no placeholder data, proofread everything. Test all admin CRUD one final time. | 35–36 | 🔴 CRITICAL |
| **ALL (7)** | UAT: full end-to-end testing of every user flow AND admin flow, demo rehearsal, user documentation, presentation materials | 36–37 | 🔴 CRITICAL |
| **ALL (7)** | **Launch day:** smoke test production, enable monitoring alerts, present demo, celebrate 🎉 | 37 | 🔴 CRITICAL |

**Sprint 5 Definition of Done:**
- [ ] Production deployed with SSL and monitoring
- [ ] Admin user seeded in production and working
- [ ] All data validated and proofread
- [ ] UAT passed by full team (student flows + admin flows)
- [ ] Lighthouse score 90+
- [ ] Demo rehearsed and ready
- [ ] Documentation complete

---

## Parallel Work Strategy

### What runs in parallel (always)

```
FRONTEND LEAD                          BACKEND LEAD
─────────────                          ────────────
Admin pages (Sprint 1–3)       ◄───►   Admin APIs (Sprint 1–3)
                                       Role middleware, CRUD endpoints

FRONTEND DEV                           BACKEND DEV
────────────                           ───────────
Student-facing pages           ◄───►   Public API endpoints
Mock data → connect at reviews         Filtering, search, pagination

DATA RESEARCHER (Sprints 0–3)
────────────────────────────────
Uses admin panel from Day 8 onward
Enters majors, universities, FAQs, test questions through the UI
Platform + data grow simultaneously
```

| Parallel Stream | Sprints | Notes |
|---|---|---|
| Frontend Lead (admin) + Frontend Dev (student) | 1–3 | **FE Lead builds admin pages while FE Dev builds student pages.** They share the component library but work on separate route groups. |
| Backend Lead (admin APIs) + Backend Dev (public APIs) | 1–3 | **BE Lead builds admin CRUD while BE Dev builds public endpoints.** Same models, different controllers. |
| Data Research + Admin Development | 1–3 | Data Researcher starts using admin UI as soon as it's ready (Day 8). If admin page isn't ready yet, they prepare data in spreadsheets. |
| UI Polish + New Features | 3–4 | One FE dev polishes existing pages, the other builds new ones. |
| Testing + Development | 4–5 | QA on completed features while remaining features are finalized. |

### What must be sequential (dependencies)

```
DB Schema ──► Admin APIs ──► Admin Frontend ──► Data Entry via Admin
                                                       │
Public APIs ──► Student Frontend Integration           │
                                                       │
Auth System ──► Favorites, History, Dashboard           │
                                                       │
Admin Majors CRUD ──► Data Researcher uses it ──► Real data in DB
                                                       │
Real data in DB ──► Student pages show real content     │
                                                       │
Core Major Pages ──► Comparison ──► Smart Third-Major   │
                                                       │
Admin Test Bank ──► Test Questions entered ──► Test UI works with real data
                                                       │
Scoring Engine Design ──► Question Bank ──► Test UI
```

Key change: **Admin CRUD is now on the critical path** because the Data Researcher depends on it. The admin majors page must be functional by Day 8 for data entry to proceed through the UI.

---

## Priority Order — If Time Runs Short

Cut from the bottom, never from the top.

| # | Item | Why |
|---|---|---|
| 1 | Database schema + migrations | Everything depends on this |
| 2 | API contract documentation | Unblocks the entire frontend team |
| 3 | Authentication system + admin middleware | Required for all user features + admin access |
| 4 | **Admin majors CRUD** | **Unblocks Data Researcher — without this, no real content** |
| 5 | Majors public APIs + Explorer page | Core value proposition for students |
| 6 | Major detail page with data | Main content users see |
| 7 | Data collection and entry via admin | Empty platform = useless platform |
| 8 | **Admin universities CRUD** | Unblocks university data entry |
| 9 | Comparison system | High-engagement feature |
| 10 | University integration (student-facing) | Completes the guidance loop |
| 11 | **Admin test bank** | Required before personality test can use real questions |
| 12 | Personality test + scoring | Key differentiator |
| 13 | Mentorship system | Valuable, but can be V1.1 |
| 14 | Admin users + analytics | Team can use DB directly at launch |
| 15 | AI chatbot + premium | Can launch without, add post-launch |

---

## Key Milestones

| Day | What should be done |
|---|---|
| **Day 3** | Dev environment running for all 7. DB migrated + seeded (with admin user). API contract published. Both projects scaffolded. Admin route group with layout shell exists. 20+ majors outlined in data sheet. |
| **Day 10** | Auth end-to-end. **Admin majors CRUD fully operational** (create, edit, delete, list). Data Researcher entering content through admin UI. Student-facing Explorer + Detail pages live with real data. 30+ majors entered via admin. |
| **Day 18** | Comparison with radar chart + third-major suggestion. **Admin universities CRUD operational. Admin FAQ management working.** University pages done for students. Dashboard with favorites + history. 80+ majors. Mobile responsive. |
| **Day 27** | Personality test fully functional with scoring. **Admin test bank operational with scoring preview.** Compatibility % on major pages. Mentorship directory + booking. 120+ majors. **All admin CRUD pages complete.** |
| **Day 34** | AI chatbot live (rate-limited). **Admin users + analytics pages done.** Premium gating done. All pages polished (loading, error, empty states, SEO, accessibility). |
| **Day 37** | Production deployed (SSL + monitoring). Admin user seeded in production. Data validated. UAT passed (student + admin flows). Lighthouse 90+. Demo ready. **Ship it.** |

---

*→ Next: See [`DATABASE.md`](./DATABASE.md) for complete schema and API reference.*
