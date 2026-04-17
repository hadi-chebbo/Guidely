# Daleel — Sprint Roadmap

> 6 sprints over 37 days. 7 team members. Every task assigned, every dependency mapped.

---

## Table of Contents

- [Sprint Overview](#sprint-overview)
- [Sprint 0 — Foundation & Setup (Days 1–3)](#sprint-0--foundation--setup-days-13)
- [Sprint 1 — Core Data & Auth (Days 4–10)](#sprint-1--core-data--auth-days-410)
- [Sprint 2 — Comparison, Universities & User Features (Days 11–18)](#sprint-2--comparison-universities--user-features-days-1118)
- [Sprint 3 — Personality Test, Recommendations & Mentorship (Days 19–27)](#sprint-3--personality-test-recommendations--mentorship-days-1927)
- [Sprint 4 — Premium Features, AI & Admin (Days 28–34)](#sprint-4--premium-features-ai--admin-days-2834)
- [Sprint 5 — Testing, Deployment & Launch (Days 35–37)](#sprint-5--testing-deployment--launch-days-3537)
- [Parallel Work Strategy](#parallel-work-strategy)
- [Priority Order — If Time Runs Short](#priority-order--if-time-runs-short)
- [Key Milestones](#key-milestones)

---

## Sprint Overview

```
Days  1 ──── 3 ──── 10 ──── 18 ──── 27 ──── 34 ──── 37
      │      │       │       │       │       │       │
      ▼      ▼       ▼       ▼       ▼       ▼       ▼
   Sprint 0  │  Sprint 1 │ Sprint 2 │ Sprint 3│Sprint4│S5│
   Setup &   │  Core     │ Compare  │ Test &  │Premium│QA│
   Foundation│  Data &   │ Unis &   │ Recos & │AI &   │& │
             │  Auth     │ Users    │ Mentors │Admin  │🚀│
```

**Priority key:**
- 🔴 `CRITICAL` — Must complete or sprint fails. Blocks downstream work.
- 🟠 `HIGH` — Important for sprint goals. Should complete.
- 🔵 `MEDIUM` — Valuable but can slip to next sprint if needed.
- ⚪ `LOW` — Nice to have. Cut first if time is tight.

---

## Sprint 0 — Foundation & Setup (Days 1–3)

**Goal:** Every team member can run the project locally. Database exists. API contract documented.

| Who | Task | Days | Priority |
|---|---|---|---|
| **ALL (7)** | Environment setup: Git repo, branching strategy (GitFlow: `main`, `develop`, `feature/*`), CI/CD with GitHub Actions, dev/staging environments | 1 | 🔴 CRITICAL |
| **Backend Lead** | Laravel scaffold: install Laravel 11, Sanctum auth, CORS config for Next.js, API versioning (`/api/v1/`), folder structure (Controllers → Services → Repositories) | 1–2 | 🔴 CRITICAL |
| **Frontend Lead** | Next.js scaffold: initialize Next.js 14+ App Router, Tailwind config with custom theme, layout components (Navbar, Footer, Sidebar), routing structure, React Query setup | 1–2 | 🔴 CRITICAL |
| **DB & DevOps** | Create ALL database migrations (see [`DATABASE.md`](./DATABASE.md)), write seeders for categories, skills, sample majors. MySQL with utf8mb4 | 1–3 | 🔴 CRITICAL |
| **Backend Dev** | Design and document complete REST API contract (OpenAPI/Swagger). Every endpoint, request/response shape, auth requirements, error codes. **This is the bridge between FE and BE teams.** | 2–3 | 🔴 CRITICAL |
| **Data Researcher + Flex** | Begin data collection: compile full list of majors in Lebanon, all universities (public/private), tuition info, admission requirements. Sources: university websites, Ministry of Education, direct outreach | 1–3 | 🔴 CRITICAL |

**Sprint 0 Definition of Done:**
- [ ] Both projects run locally for all 7 members
- [ ] All database tables migrated with seed data
- [ ] API contract document published and reviewed by frontend team
- [ ] Git repo with branch protection rules active
- [ ] Initial data spreadsheet with 20+ majors outlined

---

## Sprint 1 — Core Data & Auth (Days 4–10)

**Goal:** Users can register, log in, browse majors, and view full major details with real data.

| Who | Task | Days | Priority |
|---|---|---|---|
| **Backend Lead + Dev** | CRUD APIs for all core resources: majors (with full details), categories, universities, skills, job opportunities, hiring companies. Filtering, full-text search (Scout), pagination | 4–8 | 🔴 CRITICAL |
| **Backend Lead** | Auth system: registration + email verification, login (Sanctum JWT), logout, password reset, user profile CRUD, role middleware (`student`, `mentor`, `admin`) | 4–7 | 🔴 CRITICAL |
| **Frontend Lead** | Auth pages: login, register (with onboarding fields), forgot password, email verification. Client-side validation (React Hook Form + Zod), error handling | 4–7 | 🔴 CRITICAL |
| **Frontend Dev** | Majors Explorer page: grid/list toggle, category filter sidebar, debounced search bar, skeleton loaders, empty states, pagination. Mock data first → connect to API | 4–8 | 🔴 CRITICAL |
| **Frontend Dev** | Major Detail page: full layout — overview, pros/cons, skills tags, jobs table, demand indicator, challenges, day-in-life, FAQ accordion, hiring companies, related majors | 6–10 | 🔴 CRITICAL |
| **Data Researcher** | Populate at least **50 majors** with complete data (all fields), validate salary data against real job postings, cross-reference university offerings | 4–10 | 🟠 HIGH |
| **Flex** | Help with data entry (days 4–6) → shift to unit tests for backend APIs + component tests for frontend (days 7–10) | 4–10 | 🟠 HIGH |
| **ALL** | **Sprint 1 Review:** FE-BE integration testing, fix API contract mismatches, mobile responsive check | 9–10 | 🟠 HIGH |

**Sprint 1 Definition of Done:**
- [ ] Auth works end-to-end (register → verify → login → protected routes)
- [ ] Majors Explorer loads real data from API with search/filter
- [ ] Major Detail page renders all sections with real content
- [ ] 50+ majors fully populated in database
- [ ] First successful FE ↔ BE integration verified

---

## Sprint 2 — Comparison, Universities & User Features (Days 11–18)

**Goal:** Students can compare majors, explore universities, save favorites, and see their history.

| Who | Task | Days | Priority |
|---|---|---|---|
| **Backend Lead** | Comparison API: accept up to 3 major IDs, return structured side-by-side data. Smart Third-Major Suggestion algorithm (shared skills analysis) | 11–13 | 🟠 HIGH |
| **Backend Dev** | Universities API: list with filters (public/private, location, major), detail with all programs, credit pricing, admission, scholarships | 11–14 | 🟠 HIGH |
| **Backend Dev** | User features APIs: favorites (toggle, list), comparison history (auto-save, list), user preferences (profile update, onboarding data) | 11–14 | 🟠 HIGH |
| **Frontend Lead** | Comparison page: major selector (search + add up to 3), side-by-side cards, radar chart (Recharts), third-major suggestion card | 11–16 | 🟠 HIGH |
| **Frontend Dev** | University pages: listing with filters, detail page (programs + costs + requirements), "Top universities for this major" on detail pages | 13–17 | 🟠 HIGH |
| **Frontend Dev** | User dashboard: saved majors grid, comparison history timeline, profile settings, account management | 14–18 | 🔵 MEDIUM |
| **Backend Lead** | FAQ system: CRUD API per major, admin endpoints, sorting | 14–16 | 🔵 MEDIUM |
| **Frontend Lead** | FAQ section: collapsible accordion on detail page, search within FAQs | 16–18 | 🔵 MEDIUM |
| **Data Researcher** | Reach **100+ majors** populated. Complete all university listings with accurate tuition and admission data | 11–18 | 🟠 HIGH |
| **ALL** | **Sprint 2 Review:** End-to-end flow testing (browse → detail → compare → save), responsive audit on 3+ devices | 17–18 | 🟠 HIGH |

**Sprint 2 Definition of Done:**
- [ ] Comparison system live with radar chart and third-major suggestion
- [ ] University pages complete with filtering and cost info
- [ ] User dashboard functional (favorites + history + settings)
- [ ] FAQ accordion working on major pages
- [ ] 100+ majors in database
- [ ] Responsive on mobile, tablet, desktop

---

## Sprint 3 — Personality Test, Recommendations & Mentorship (Days 19–27)

**Goal:** Personality test works with scoring engine. Compatibility scores display. Mentorship system operational.

| Who | Task | Days | Priority |
|---|---|---|---|
| **Backend Lead + Dev** | Personality test engine: two-level scoring system, questions bank API (CRUD with category/major scores), submission endpoint (run algorithm → ranked results), results storage | 19–24 | 🟠 HIGH |
| **Frontend Lead** | Test UI: multi-step wizard, progress bar, animated transitions, question type renderers (single, multiple, scale slider), results page with ranked major cards + compatibility % | 19–24 | 🟠 HIGH |
| **Backend Dev** | Smart recommendations: third-major algorithm refinement, compatibility score calculation for any major given test results, "top universities for this major" ranking | 19–22 | 🔵 MEDIUM |
| **Backend Dev** | Mentorship system: mentor profile CRUD, availability/scheduling API, booking + confirmation flow, rating + feedback endpoints | 22–26 | 🔵 MEDIUM |
| **Frontend Dev** | Mentorship pages: mentor directory with search/filters, profile cards, booking flow (select time → confirm → confirmation), session history | 23–27 | 🔵 MEDIUM |
| **Frontend Dev** | Market research section: job trends charts, hiring companies carousel, salary calculator tool, future outlook indicators | 22–25 | 🔵 MEDIUM |
| **Data Researcher** | Finalize ALL data (target: **150+ majors**), market research stats, hiring companies DB, salary ranges validated, test questions written with scored options | 19–25 | 🟠 HIGH |
| **Flex** | Intensive QA: test quiz with varied answers, verify scoring produces sensible results, comparison edge cases, accessibility audit | 24–27 | 🟠 HIGH |
| **ALL** | **Sprint 3 Review:** Full regression test, performance profiling, fix N+1 queries, optimize slow pages | 26–27 | 🟠 HIGH |

**Sprint 3 Definition of Done:**
- [ ] Personality test: questions render → scoring works → results show ranked majors
- [ ] Compatibility % displays on major pages for users who took the test
- [ ] Mentorship directory and booking flow working
- [ ] Market data and salary info visible on major pages
- [ ] 150+ majors complete with all data fields

---

## Sprint 4 — Premium Features, AI & Admin (Days 28–34)

**Goal:** AI chatbot works. Admin dashboard operational. Premium gating in place. Full polish pass.

| Who | Task | Days | Priority |
|---|---|---|---|
| **Backend Dev** | AI chatbot: integrate OpenAI/Claude API, conversation management (create, continue, history), inject major/market data as context, rate limiting (3 msg/day free) | 28–31 | 🔵 MEDIUM |
| **Frontend Lead** | AI chatbot UI: floating widget (expand/collapse), message bubbles, suggested prompts, typing indicator, conversation history, premium gate + upgrade prompt | 28–31 | 🔵 MEDIUM |
| **Backend Lead** | Premium subscriptions: Stripe via Laravel Cashier, plan management, feature-gating middleware, payment webhooks | 28–32 | ⚪ LOW |
| **Frontend Dev** | Premium UI: pricing page, Stripe Elements checkout, upgrade prompts on gated features (blurred + "Unlock with Premium"), subscription management | 30–33 | ⚪ LOW |
| **Backend Lead** | Admin dashboard API: CRUD for all content (majors, universities, FAQs, test questions), user management, platform analytics | 28–32 | 🟠 HIGH |
| **Frontend Lead** | Admin dashboard UI: data tables (sort/filter/paginate), edit forms, analytics charts, user management | 29–33 | 🟠 HIGH |
| **ALL (7)** | **Final polish:** responsive audit (5+ devices), WCAG 2.1 AA accessibility, SEO meta + Open Graph tags, loading states everywhere, error boundaries, 404 page, empty states | 32–34 | 🔴 CRITICAL |

**Sprint 4 Definition of Done:**
- [ ] AI chatbot functional with rate limiting
- [ ] Admin can manage all content through dashboard
- [ ] Premium features gated (if implemented)
- [ ] All pages polished: loading, error, empty states
- [ ] SEO tags on all public pages
- [ ] Accessibility audit passed

---

## Sprint 5 — Testing, Deployment & Launch (Days 35–37)

**Goal:** Ship it. 🚀

| Who | Task | Days | Priority |
|---|---|---|---|
| **Backend Lead + Dev** | Final bug fixes, API performance optimization, DB indexing, Redis caching for hot data | 35–36 | 🔴 CRITICAL |
| **Frontend Lead + Dev** | Final bug fixes, Lighthouse audit (target: 90+), image optimization (WebP), lazy loading, code splitting | 35–36 | 🔴 CRITICAL |
| **DB & DevOps** | Production deployment: server provisioning, SSL, domain config, env variables, production migration, Sentry monitoring, backup strategy | 35–36 | 🔴 CRITICAL |
| **Data Researcher + Flex** | Final data validation: spot-check 50 random majors, verify university links, ensure no placeholder data remains, proofread everything | 35–36 | 🔴 CRITICAL |
| **ALL (7)** | UAT: full end-to-end testing of every user flow, demo rehearsal, user documentation, presentation materials | 36–37 | 🔴 CRITICAL |
| **ALL (7)** | **Launch day:** smoke test production, enable monitoring alerts, present demo, celebrate 🎉 | 37 | 🔴 CRITICAL |

**Sprint 5 Definition of Done:**
- [ ] Production deployed with SSL and monitoring
- [ ] All data validated and proofread
- [ ] UAT passed by full team
- [ ] Lighthouse score 90+
- [ ] Demo rehearsed and ready
- [ ] Documentation complete

---

## Parallel Work Strategy

### What runs in parallel (always)

```
FRONTEND TEAM                          BACKEND TEAM
─────────────                          ────────────
Build pages with mock data     ◄───►   Implement real API endpoints
Use API contract as source             Follow API contract spec
Connect at sprint reviews              Expose endpoints progressively

DATA RESEARCH (Sprints 0–3)
────────────────────────────
Runs continuously alongside development
Platform + data grow simultaneously
```

| Parallel Stream | Sprints | Notes |
|---|---|---|
| Frontend + Backend | All | **Most important.** FE uses mock data / API stubs, BE builds real endpoints. Connect at reviews. |
| Data Research + Development | 0–3 | 1–2 people collecting data non-stop while devs build. |
| UI Polish + New Features | 3–4 | One FE dev polishes existing pages, the other builds new ones. |
| Testing + Development | 4–5 | QA on completed features while remaining features are finalized. |
| Admin Dashboard + User Features | 4 | Admin is independent — doesn't block or depend on user-facing work. |

### What must be sequential (dependencies)

```
DB Schema ──► Backend APIs ──► Frontend Integration
                                    │
API Contract Doc ──► Frontend Dev   │
                                    │
Auth System ──► Favorites, History, Dashboard, Test Results, Mentorship
                                    │
Core Major Pages ──► Comparison ──► Smart Third-Major Suggestion
                                    │
Scoring Engine Design ──► Question Bank ──► Test UI
```

---

## Priority Order — If Time Runs Short

Cut from the bottom, never from the top.

| # | Item | Why |
|---|---|---|
| 1 | Database schema + migrations | Everything depends on this |
| 2 | API contract documentation | Unblocks the entire frontend team |
| 3 | Authentication system | Required for all user features |
| 4 | Majors CRUD + Explorer page | Core value proposition |
| 5 | Major detail page with data | Main content users see |
| 6 | Data collection and entry | Empty platform = useless platform |
| 7 | Personality test + scoring | Key differentiator |
| 8 | Comparison system | High-engagement feature |
| 9 | University integration | Completes the guidance loop |
| 10 | Mentorship system | Valuable, but can be V1.1 |
| 11 | AI chatbot + premium | Can launch without, add post-launch |
| 12 | Admin dashboard | Team can use DB directly at launch |

---

## Key Milestones

| Day | What should be done |
|---|---|
| **Day 3** | Dev environment running for all 7. DB migrated + seeded. API contract published. Both projects scaffolded. 20+ majors outlined in data sheet. |
| **Day 10** | Auth end-to-end. Explorer page live with real data. Detail page rendering all sections. 50+ majors populated. First FE ↔ BE integration working. |
| **Day 18** | Comparison with radar chart + third-major suggestion. University pages done. Dashboard with favorites + history. FAQ working. 100+ majors. Mobile responsive. |
| **Day 27** | Personality test fully functional with scoring. Compatibility % on major pages. Mentorship directory + booking. Market data visible. 150+ majors. |
| **Day 34** | AI chatbot live (rate-limited). Admin dashboard operational. Premium gating done. All pages polished (loading, error, empty states, SEO, accessibility). |
| **Day 37** | Production deployed (SSL + monitoring). Data validated. UAT passed. Lighthouse 90+. Demo ready. **Ship it.** |

---

*→ Next: See [`DATABASE.md`](./DATABASE.md) for complete schema and API reference.*
