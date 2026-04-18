# Guidely — Features

> Complete feature specification. Core features, admin panel, recommended additions, premium tier, and smart recommendations engine.

---

## Table of Contents

- [Core Features](#core-features)
  - [Majors Explorer](#1-majors-explorer)
  - [Major Detail Page](#2-major-detail-page)
  - [Comparison System](#3-comparison-system)
  - [Universities Integration](#4-universities-integration)
  - [User Accounts & Personalization](#5-user-accounts--personalization)
  - [Skills & Personality Test](#6-skills--personality-test)
  - [Mentorship System](#7-mentorship-system)
  - [Market Research & Career Insights](#8-market-research--career-insights)
- [Admin Panel](#admin-panel)
- [Recommended Additional Features](#recommended-additional-features)
- [Premium Features](#premium-features)
- [Smart Recommendations Engine](#smart-recommendations-engine)

---

## Core Features

### 1. Majors Explorer

The central hub where students browse and discover majors available in Lebanese universities.

- Browse all majors in a clean, visual **grid or list view** (toggle)
- **Categorized by field**: Technology, Business, Health Sciences, Engineering, Arts & Humanities, Sciences, Social Sciences, Education, Law, Agriculture, etc.
- **Fully searchable** with instant type-ahead and filterable by:
  - Category
  - Difficulty level
  - Duration
  - Market demand level
  - Salary range
- **Featured majors** section on homepage — trending or high-demand fields
- Each major card shows a quick snapshot: name, category icon, difficulty badge, demand indicator, duration

---

### 2. Major Detail Page

Each major has a comprehensive detail page — the core content that differentiates Guidely from a directory.

| Section | Description |
|---|---|
| **Overview & Description** | Clear, honest explanation written in accessible language for 17–18 year olds. No academic jargon. |
| **Study Duration** | Typical years (3, 4, 5+), including whether postgraduate study is typically needed. |
| **Pros & Cons** | Honest, balanced list. Not promotional — genuinely helpful. |
| **Job Opportunities** | Specific career paths in Lebanon and abroad, with titles, descriptions, and demand levels. |
| **Required Skills** | Hard skills + soft skills, categorized: essential, recommended, optional. |
| **Key Challenges** | What makes this major difficult? Common struggles? What to prepare for? |
| **Market Demand** | Current demand (low/medium/high/very high) with trend context and future outlook. |
| **Day in the Life** | Structured narrative of a typical day studying this major or working in the field. *The #1 thing undecided students want.* |
| **Salary Expectations** | Realistic ranges in USD — entry-level, mid-career, senior — Lebanon and international. |
| **Future Outlook** | 5-year forecast: declining, stable, growing, or booming. |
| **FAQ Section** | Collapsible accordion. Addresses common misconceptions and practical concerns. |
| **Top Hiring Companies** | Lebanese and international companies that hire from this major, with logos. |
| **Related Majors** | Similar or complementary majors to explore. |

---

### 3. Comparison System

Side-by-side comparison tool for evaluating multiple options simultaneously.

- Compare **up to 3 majors** side by side
- Comparison criteria:
  - Duration of education
  - Difficulty level
  - Salary expectations
  - Market demand
  - Required skills
  - Job opportunities
  - Future outlook
- **Visual radar chart** showing how majors compare across dimensions
- **Smart Third-Major Suggestion**: If two similar majors are compared, the system automatically recommends a third that combines elements of both (e.g., comparing CS + Business → suggests MIS)
- Comparison history saved to user account

---

### 4. Universities Integration

Complete integration with Lebanese universities, connecting majors to where they can be studied.

- Full listing of universities offering each major
- **Public / Private** classification
- Admission requirements and prerequisites per program
- **Credit pricing** per university and total estimated cost
- Language of instruction (English, French, Arabic, bilingual)
- Scholarship availability indicators
- Campus location information
- **Smart University Recommendation**: When a student picks a major, the platform recommends top universities based on reputation, cost, location, and admission requirements

---

### 5. User Accounts & Personalization

- Registration and login with email verification
- **Save favorite majors** for quick access
- **Track comparison history** across sessions
- Personalized dashboard: saved items, test results, recommendations
- Profile settings: school, grade, language preference
- **Onboarding Form** (optional, can skip): asks about interests, strengths, and preferences to immediately personalize the experience

---

### 6. Skills & Personality Test

A structured assessment that matches students to compatible majors. **This is the platform's key differentiator.**

#### Two-Level Scoring System

The scoring engine uses a two-level approach designed for accuracy and scalability:

```
┌─────────────────────────────────────────────────────────────┐
│                    LEVEL 1: Category Scoring                │
│                                                             │
│  User answers → scores added/subtracted to broad categories │
│  (Tech, Business, Health, Arts, Engineering, Sciences...)   │
│                                                             │
│  After all questions: keep only TOP-SCORING categories      │
├─────────────────────────────────────────────────────────────┤
│                    LEVEL 2: Major Scoring                   │
│                                                             │
│  Only evaluate majors within selected top categories        │
│  (NOT all 300+ majors — much more efficient)                │
│                                                             │
│  Same scoring process ranks individual majors               │
│  Positive scores = supports compatibility                   │
│  Negative scores = reduces compatibility                    │
├─────────────────────────────────────────────────────────────┤
│                    FINAL RANKING                            │
│                                                             │
│  Majors sorted by accumulated scores                        │
│  Highest-scoring majors recommended to the student          │
└─────────────────────────────────────────────────────────────┘
```

**Example scoring data structure:**

```json
// test_options.category_scores (Level 1)
{ "tech": 3, "business": -1, "health": 2, "arts": 0 }

// test_options.major_scores (Level 2)
{ "computer_science": 2, "software_engineering": 3, "data_science": 1 }
```

#### Test Features

- **Multi-step wizard** with progress bar and animated transitions
- Question types: single choice, multiple choice, scale (1–5 rating)
- Results page with ranked major cards + compatibility percentages
- Results saved to account, test can be retaken
- **Major Compatibility Score**: After taking the test, every major page shows a personalized match percentage (e.g., "87% match for you")

---

### 7. Mentorship System

| Tier | Description |
|---|---|
| **Student-to-Student (Free)** | Current university students volunteer to answer questions about their major, university experience, and career outlook. Authentic peer perspectives. |
| **Expert Mentorship (Premium)** | Professional career advisors, industry professionals, and university counselors available for paid one-on-one sessions. |

**Features:**

- Mentor directory with filters (expertise, major, university, type, rating)
- Mentor profile cards: bio, expertise areas, rating, session count
- Session booking flow: select time → confirm → confirmation page
- Post-session rating and feedback system
- Session history for both mentors and students

---

### 8. Market Research & Career Insights

- Market demand trends specific to Lebanon, updated regularly
- Future job opportunity projections
- Top hiring companies per major (local + international)
- Salary data: breakdown by experience level and location (Lebanon vs. abroad)
- **Interactive Salary Calculator**: Pick major + years of experience + location → estimated salary range
- **Alumni Success Map**: Visual timeline/map of real career paths of Lebanese graduates — where they started, where they are now (anonymized)

---

## Admin Panel

The admin panel is a **dedicated route group** (`/admin/*`) within the same Next.js app. It has its own layout, navigation, and UI components — completely separate from the student-facing experience.

### Admin vs Student: Majors Page Comparison

| Aspect | Student Majors Page (`/majors`) | Admin Majors Page (`/admin/majors`) |
|---|---|---|
| **Purpose** | Browse, discover, explore | Create, edit, delete, manage |
| **Layout** | Visual card grid with images | Dense data table with columns |
| **Interaction** | Click to view detail page | Inline edit, modal forms, bulk actions |
| **Search** | Type-ahead with category filters | Full-text search + column sorting + advanced filters |
| **Data shown** | Name, category, difficulty, demand | All fields including IDs, dates, featured flag, data completeness |
| **Actions** | View, save to favorites, compare | Create, Edit, Delete, Duplicate, Toggle Featured, Bulk Delete |
| **Access** | Public (anyone) | Admin role only (middleware protected) |
| **Design** | Colorful, engaging, card-based | Clean, utilitarian, data-focused |

### Admin Route Structure

```
/admin                    → Redirects to /admin/majors
/admin/majors             → Majors data table with CRUD
/admin/majors/create      → Create new major form (all fields)
/admin/majors/[id]/edit   → Edit major form (all fields + pros/cons/skills/jobs)
/admin/universities       → Universities data table with CRUD
/admin/universities/[id]  → Edit university + manage offered majors
/admin/faqs               → FAQ management per major
/admin/test-bank          → Test questions & options with score weights
/admin/users              → User list, search, role management
/admin/mentors            → Mentor verification & management
/admin/analytics          → Platform stats (signups, popular majors, test completion rates)
```

### Admin Majors CRUD Page — Detailed Specification

The admin majors page (`/admin/majors`) is the primary content management interface. It is where the Data Researcher and admins spend most of their time.

**Data Table Features:**
- Sortable columns: Name, Category, Difficulty, Local Demand, International Demand, Duration, Featured, Updated At
- Column filters: category dropdown, difficulty dropdown, demand dropdown, featured toggle
- Full-text search across name and overview
- Pagination (25, 50, 100 per page)
- Row selection with checkboxes for bulk actions
- Quick toggle for `is_featured` directly in the table row
- Color-coded demand badges (green = high, yellow = medium, red = low)
- "Data completeness" indicator — shows which fields are still empty (helps researcher track progress)

**CRUD Operations:**

| Operation | How it works |
|---|---|
| **Create** | Click "Add Major" button → opens full-page form at `/admin/majors/create`. All fields: basic info, overview, pros/cons (dynamic add/remove), skills (tag selector), job opportunities (nested form), hiring companies, FAQ, day-in-life, challenges. Category selected from dropdown. Save creates the major and redirects back to table. |
| **Read** | Table row shows summary. Click row or "View" button → opens detail view showing all data exactly as students will see it (preview mode). |
| **Update** | Click "Edit" button on row → opens full-page form at `/admin/majors/[id]/edit` pre-filled with all current data. All related data (pros, cons, skills, jobs, FAQs, companies) editable on the same page in accordion sections. Auto-save draft every 30 seconds. |
| **Delete** | Click "Delete" button → confirmation modal with major name. Soft delete (can be restored). Bulk delete available via checkboxes. |
| **Duplicate** | Click "Duplicate" → creates a copy with "(Copy)" appended to name. Useful for similar majors. |

**Related Data Management (within major edit page):**
- **Pros & Cons**: Dynamic list — add/remove items, drag to reorder
- **Skills**: Tag-style selector from existing skills pool + create new skill inline
- **Job Opportunities**: Nested form — add/remove job entries with title, salary, scope, demand
- **Hiring Companies**: Search/add existing or create new with logo upload
- **FAQs**: Question/answer pairs — add/remove, reorder
- **Market Trends**: Year-by-year data entry form

### Admin Layout & Navigation

```
┌─────────────────────────────────────────────────┐
│  Guidely Admin            [Admin Name] [Logout] │
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ Sidebar  │   Main Content Area                  │
│          │                                      │
│ 📊 Majors│   [Data Table / Form / Analytics]    │
│ 🏫 Unis  │                                      │
│ ❓ FAQs  │                                      │
│ 📝 Test  │                                      │
│ 👥 Users │                                      │
│ 🧑‍🏫 Mentors│                                      │
│ 📈 Stats │                                      │
│          │                                      │
│──────────│                                      │
│ [Back to │                                      │
│  Site →] │                                      │
└──────────┴──────────────────────────────────────┘
```

- Sidebar is always visible (collapsible on mobile)
- "Back to Site" link at bottom opens student-facing site in new tab
- Admin layout uses a neutral, professional color scheme (gray/blue) distinct from the student-facing design
- No student-facing navigation (navbar, footer) visible in admin routes

### Admin Access Control

**Backend (Laravel):**
```
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::apiResource('majors', AdminMajorController::class);
    Route::apiResource('universities', AdminUniversityController::class);
    Route::apiResource('faqs', AdminFaqController::class);
    Route::apiResource('test-questions', AdminTestQuestionController::class);
    Route::get('users', [AdminUserController::class, 'index']);
    Route::put('users/{id}/role', [AdminUserController::class, 'updateRole']);
    Route::get('analytics', [AdminAnalyticsController::class, 'index']);
});
```

**Frontend (Next.js middleware):**
```
// middleware.ts — protects /admin/* routes
if (pathname.startsWith('/admin')) {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return redirect('/');  // non-admins see nothing
  }
}
```

**Admin creation:**
- No public registration for admins
- Initial admin created via database seeder (`php artisan db:seed --class=AdminSeeder`)
- Additional admins created by existing admins through `/admin/users` → change role to admin

---

## Recommended Additional Features

These are strategic additions that elevate Guidely beyond a simple information platform. Based on analysis of what Lebanese students actually need and what no existing platform provides.

### Quick Onboarding Quiz (3 Questions)

A rapid quiz shown on first visit — separate from the full personality test. Example questions:

1. "What excites you most?" (options: solving problems, helping people, creating things, analyzing data)
2. "Do you prefer working with people or data?"
3. "Indoor or outdoor work?"

Immediately filters the homepage to show relevant majors. Lowers bounce rate and creates instant engagement — the student feels the platform "gets them" within 30 seconds.

### Major Similarity Graph

Interactive visualization showing how majors relate to each other. Data Science sits between CS and Statistics. Graphic Design connects Fine Arts and Marketing. Helps students discover adjacent fields they hadn't considered. Transforms browsing from a linear list into an explorable map.

### Community Q&A per Major

Current university students answer questions from prospective students directly on each major's page. Much more authentic than static FAQs. Start manually curated, then open to verified student submissions. Creates a living, growing knowledge base.

### Parent Mode

A simplified view designed for parents who want to understand what their child is considering. Lebanese parents are heavily involved in major decisions — often they *are* the decision-makers. Parent Mode shows:

- Major overview in simplified language
- Career stability assessment
- Salary expectations
- Comparison with traditionally "safe" fields

**This turns a potential blocker (resistant parents) into a supporter.** No other platform serves this audience.

### Exportable PDF Reports

Generate polished PDF reports of test results, major comparisons, and personalized recommendations. Students share with parents, school counselors, or keep for reference. Includes charts, compatibility scores, and key data points.

### University Application Tracker

After deciding on a major, help with the next step: track application deadlines, required documents, submission status, and important dates per university. Extends Guidely's value beyond the decision phase into the action phase.

---

## Premium Features

Launch with **3 polished premium features**, not 7 half-built ones.

| Feature | Description | Priority |
|---|---|---|
| **AI Career Advisor Chatbot** | Unlimited conversations with an AI that knows Lebanese market data. Can answer: "Is pharmacy worth studying in Lebanon right now?" Free users: 3 messages/day. | 🔴 HIGH |
| **Detailed Test Results & Analytics** | Free: top 3 majors. Premium: full ranking with reasoning, strength/weakness breakdown, personality analysis, 10-year salary projections, demand forecasting, skill gap analysis. | 🔴 HIGH |
| **Expert Mentorship Access** | Free: student-to-student mentorship. Premium: industry professionals, admissions officers, certified career counselors for video sessions. | 🔴 HIGH |
| **Exportable PDF Reports** | Download professional reports of results, comparisons, recommendations. Data visualizations + personalized insights. | 🟡 MEDIUM |
| **University Application Tracker** | Deadline tracking, document checklists, submission status, reminders. | 🟡 MEDIUM |
| **Early Access to Market Data** | See updated market research and hiring trends before public release. | 🔵 LOW |
| **Ad-Free Experience** | Free tier has non-intrusive sponsored university placements. Premium removes all ads. | 🔵 LOW |

---

## Smart Recommendations Engine

The intelligent backbone of Guidely — goes beyond simple filtering.

### AI-Based Major Suggestions

Based on user profile (test results, browsing history, saved favorites, comparison patterns), the AI generates personalized suggestions with explanations of *why* each major is a good fit.

### Smart Third-Major Recommendation

When comparing two similar majors, the system:
1. Identifies shared skills between compared majors
2. Finds majors requiring a superset of those skills
3. Ranks by demand and compatibility score
4. Suggests the best hybrid option

### University Matching

When a student selects a major, recommend top universities based on:
- Reputation / ranking
- Tuition cost relative to student's budget
- Geographic proximity
- Admission requirements relative to student's profile
- Scholarship availability

### Compatibility Score Display

After completing the personality test, every major page shows a personalized compatibility percentage. A student who sees "92% match" on a major they hadn't considered is far more likely to explore it than with a generic description alone.

---

*→ Next: See [`ROADMAP.md`](./ROADMAP.md) for sprint breakdown and task assignments.*
