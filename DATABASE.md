# Daleel — Database Schema & API Reference

> 22 tables. Full relational schema. All Laravel conventions. utf8mb4 for Arabic.

---

## Table of Contents

- [Schema Overview](#schema-overview)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Table Definitions](#table-definitions)
- [Key Indexes](#key-indexes)
- [API Endpoints Reference](#api-endpoints-reference)

---

## Schema Overview

All tables follow Laravel conventions:
- Auto-incrementing `BIGINT UNSIGNED` primary keys
- `created_at` / `updated_at` timestamps
- Foreign key constraints with `ON DELETE CASCADE` where appropriate
- Database charset: `utf8mb4` (supports Arabic, emoji, special characters)
- Every text field has `_en` and `_ar` variants for bilingual support

```
┌──────────────────────────────────────────────────────────────────┐
│                        CORE CONTENT                              │
│  categories ──1:N──► majors ──1:N──► major_pros                  │
│                        │              major_cons                  │
│                        │              faqs                        │
│                        │              job_opportunities           │
│                        │              hiring_companies            │
│                        │              market_trends               │
│                        │                                          │
│                        ├──N:N──► skills      (via major_skills)   │
│                        └──N:N──► universities (via uni_majors)    │
├──────────────────────────────────────────────────────────────────┤
│                         USERS                                    │
│  users ──1:N──► user_favorites                                   │
│    │             comparison_history                               │
│    │             test_results                                     │
│    │             ai_conversations                                 │
│    │             subscriptions                                    │
│    │                                                              │
│    └──1:0..1──► mentors ──1:N──► mentor_sessions                 │
├──────────────────────────────────────────────────────────────────┤
│                    PERSONALITY TEST                               │
│  test_questions ──1:N──► test_options                             │
└──────────────────────────────────────────────────────────────────┘
```

---

## Entity Relationship Diagram

```
categories 1 ──► N majors
majors     1 ──► N major_pros
majors     1 ──► N major_cons
majors     1 ──► N faqs
majors     1 ──► N job_opportunities
majors     1 ──► N hiring_companies
majors     1 ──► N market_trends
majors     N ◄──► N skills           (pivot: major_skills)
majors     N ◄──► N universities     (pivot: university_majors + extra fields)

users      1 ──► N user_favorites
users      1 ──► N comparison_history
users      1 ──► N test_results
users      1 ──► N ai_conversations
users      1 ──► N subscriptions
users      1 ──► N mentor_sessions   (as student)
users      1 ──► 0..1 mentors

mentors    1 ──► N mentor_sessions

test_questions 1 ──► N test_options
```

---

## Table Definitions

### `users`

*User accounts for students, mentors, and administrators*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | Auto-increment primary key |
| `name` | VARCHAR(255) | Full name |
| `email` | VARCHAR(255) UNIQUE | Login email |
| `password` | VARCHAR(255) | Bcrypt hashed password |
| `role` | ENUM(`student`, `mentor`, `admin`) | Default: `student` |
| `avatar_url` | VARCHAR(500) NULL | Profile picture URL |
| `phone` | VARCHAR(20) NULL | Phone number |
| `school` | VARCHAR(255) NULL | Current school name |
| `grade` | VARCHAR(50) NULL | Grade/class (e.g., Terminale) |
| `preferred_language` | ENUM(`en`, `ar`, `fr`) DEFAULT `en` | Interface language |
| `is_premium` | BOOLEAN DEFAULT false | Premium subscription active |
| `premium_expires_at` | TIMESTAMP NULL | Premium expiry |
| `onboarding_data` | JSON NULL | Quick quiz answers |
| `email_verified_at` | TIMESTAMP NULL | Verification timestamp |
| `remember_token` | VARCHAR(100) NULL | Laravel remember me |
| `created_at` / `updated_at` | TIMESTAMPS | Auto-managed |

---

### `categories`

*Broad groupings: Tech, Business, Health, Arts, Engineering, Sciences, etc.*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | |
| `name_en` | VARCHAR(255) | English name |
| `name_ar` | VARCHAR(255) NULL | Arabic name |
| `slug` | VARCHAR(255) UNIQUE | URL slug |
| `description_en` | TEXT NULL | Description (EN) |
| `description_ar` | TEXT NULL | Description (AR) |
| `icon` | VARCHAR(100) NULL | Icon identifier (Lucide) |
| `color` | VARCHAR(7) NULL | Hex color for badges |
| `sort_order` | INT DEFAULT 0 | Display order |
| `created_at` / `updated_at` | TIMESTAMPS | |

---

### `majors`

*All university majors with comprehensive details*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | |
| `category_id` | FK → `categories` | ON DELETE CASCADE |
| `name_en` | VARCHAR(255) | English name |
| `name_ar` | VARCHAR(255) NULL | Arabic name |
| `slug` | VARCHAR(255) UNIQUE | URL slug |
| `overview_en` | TEXT | What this major is about (EN) |
| `overview_ar` | TEXT NULL | What this major is about (AR) |
| `duration_years` | DECIMAL(2,1) | Study duration (3.0, 4.0, 5.0) |
| `difficulty_level` | ENUM(`easy`, `medium`, `hard`, `very_hard`) | Perceived difficulty |
| `salary_range_min` | INT NULL | Min expected salary (USD/year) |
| `salary_range_max` | INT NULL | Max expected salary (USD/year) |
| `local_demand` | ENUM(`low`, `medium`, `high`, `very_high`) | Lebanon demand |
| `international_demand` | ENUM(`low`, `medium`, `high`, `very_high`) | Global demand |
| `future_outlook` | ENUM(`declining`, `stable`, `growing`, `booming`) | 5-year forecast |
| `day_in_life_en` | TEXT NULL | Typical day narrative (EN) |
| `day_in_life_ar` | TEXT NULL | Typical day narrative (AR) |
| `challenges_en` | TEXT NULL | Key challenges (EN) |
| `challenges_ar` | TEXT NULL | Key challenges (AR) |
| `is_featured` | BOOLEAN DEFAULT false | Homepage featured flag |
| `image_url` | VARCHAR(500) NULL | Cover image |
| `created_at` / `updated_at` | TIMESTAMPS | |

---

### `major_pros`

*Advantages of each major*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | |
| `major_id` | FK → `majors` | ON DELETE CASCADE |
| `content_en` | VARCHAR(500) | Pro text (EN) |
| `content_ar` | VARCHAR(500) NULL | Pro text (AR) |
| `sort_order` | INT DEFAULT 0 | Display order |

---

### `major_cons`

*Disadvantages of each major (identical structure to `major_pros`)*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | |
| `major_id` | FK → `majors` | ON DELETE CASCADE |
| `content_en` | VARCHAR(500) | Con text (EN) |
| `content_ar` | VARCHAR(500) NULL | Con text (AR) |
| `sort_order` | INT DEFAULT 0 | Display order |

---

### `skills`

*Skills linked to majors (many-to-many)*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | |
| `name_en` | VARCHAR(255) | e.g., "Critical Thinking" |
| `name_ar` | VARCHAR(255) NULL | Arabic name |
| `type` | ENUM(`hard`, `soft`) | Classification |
| `icon` | VARCHAR(100) NULL | Icon identifier |
| `created_at` / `updated_at` | TIMESTAMPS | |

---

### `major_skills` *(pivot)*

| Column | Type | Description |
|---|---|---|
| `major_id` | FK → `majors` | ON DELETE CASCADE |
| `skill_id` | FK → `skills` | ON DELETE CASCADE |
| `importance` | ENUM(`essential`, `recommended`, `optional`) | How critical |
| | PRIMARY KEY (`major_id`, `skill_id`) | Composite PK |

---

### `universities`

*All Lebanese universities (public and private)*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | |
| `name_en` | VARCHAR(255) | English name |
| `name_ar` | VARCHAR(255) NULL | Arabic name |
| `slug` | VARCHAR(255) UNIQUE | URL slug |
| `type` | ENUM(`public`, `private`) | Institution type |
| `location` | VARCHAR(255) | City/region in Lebanon |
| `website` | VARCHAR(500) NULL | Official website |
| `logo_url` | VARCHAR(500) NULL | Logo image |
| `description_en` | TEXT NULL | About (EN) |
| `description_ar` | TEXT NULL | About (AR) |
| `founded_year` | INT NULL | Year established |
| `accreditation` | VARCHAR(255) NULL | Accreditation bodies |
| `created_at` / `updated_at` | TIMESTAMPS | |

---

### `university_majors` *(pivot with extra data)*

*Which universities offer which majors, with program-specific details*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | Own PK for extra data |
| `university_id` | FK → `universities` | ON DELETE CASCADE |
| `major_id` | FK → `majors` | ON DELETE CASCADE |
| `credit_price_usd` | DECIMAL(10,2) NULL | Price per credit (USD) |
| `total_credits` | INT NULL | Credits required |
| `admission_requirements` | TEXT NULL | Entry requirements |
| `language_of_instruction` | VARCHAR(50) DEFAULT 'English' | Teaching language |
| `has_scholarship` | BOOLEAN DEFAULT false | Scholarship available |
| `campus` | VARCHAR(255) NULL | Which campus |
| | UNIQUE (`university_id`, `major_id`) | One entry per pair |

---

### `job_opportunities`

*Career paths linked to each major*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | |
| `major_id` | FK → `majors` | ON DELETE CASCADE |
| `title_en` | VARCHAR(255) | Job title (EN) |
| `title_ar` | VARCHAR(255) NULL | Job title (AR) |
| `description_en` | TEXT NULL | What this role involves |
| `avg_salary_usd` | INT NULL | Average annual salary |
| `scope` | ENUM(`local`, `international`, `both`) | Where it exists |
| `demand_level` | ENUM(`low`, `medium`, `high`) | Hiring demand |
| `created_at` / `updated_at` | TIMESTAMPS | |

---

### `hiring_companies`

*Companies hiring graduates from specific majors*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | |
| `major_id` | FK → `majors` | ON DELETE CASCADE |
| `company_name` | VARCHAR(255) | Company name |
| `industry` | VARCHAR(255) NULL | Sector |
| `location` | VARCHAR(255) | HQ location |
| `logo_url` | VARCHAR(500) NULL | Logo |
| `website_url` | VARCHAR(500) NULL | Website |
| `is_local` | BOOLEAN DEFAULT true | Lebanese company |
| `created_at` / `updated_at` | TIMESTAMPS | |

---

### `faqs`

*Per-major frequently asked questions*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | |
| `major_id` | FK → `majors` | ON DELETE CASCADE |
| `question_en` | TEXT | Question (EN) |
| `question_ar` | TEXT NULL | Question (AR) |
| `answer_en` | TEXT | Answer (EN) |
| `answer_ar` | TEXT NULL | Answer (AR) |
| `sort_order` | INT DEFAULT 0 | Display order |
| `created_at` / `updated_at` | TIMESTAMPS | |

---

### `user_favorites`

*Bookmarked majors*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | |
| `user_id` | FK → `users` | ON DELETE CASCADE |
| `major_id` | FK → `majors` | ON DELETE CASCADE |
| `created_at` | TIMESTAMP | When saved |
| | UNIQUE (`user_id`, `major_id`) | No duplicates |

---

### `comparison_history`

*Log of comparisons*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | |
| `user_id` | FK → `users` | ON DELETE CASCADE |
| `major_ids` | JSON | e.g., `[1, 5, 12]` |
| `created_at` | TIMESTAMP | When compared |

---

### `test_questions`

*Personality/skills assessment questions*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | |
| `question_text_en` | TEXT | Question (EN) |
| `question_text_ar` | TEXT NULL | Question (AR) |
| `question_type` | ENUM(`single`, `multiple`, `scale`) | Answer format |
| `section` | VARCHAR(100) NULL | Grouping (Interests, Strengths) |
| `sort_order` | INT DEFAULT 0 | Display order |
| `is_active` | BOOLEAN DEFAULT true | In active bank? |
| `created_at` / `updated_at` | TIMESTAMPS | |

---

### `test_options`

*Answer options with scoring weights*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | |
| `question_id` | FK → `test_questions` | ON DELETE CASCADE |
| `option_text_en` | VARCHAR(500) | Label (EN) |
| `option_text_ar` | VARCHAR(500) NULL | Label (AR) |
| `category_scores` | JSON | Level 1: `{"tech": 3, "business": -1, "health": 2}` |
| `major_scores` | JSON NULL | Level 2: `{"cs": 2, "se": 3}` |
| `sort_order` | INT DEFAULT 0 | Display order |

---

### `test_results`

*Stored results from each test attempt*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | |
| `user_id` | FK → `users` | ON DELETE CASCADE |
| `answers` | JSON | `[{question_id, option_ids}]` |
| `category_scores` | JSON | `{"tech": 45, "health": 30}` |
| `recommended_majors` | JSON | `[{major_id, score, rank}]` |
| `created_at` | TIMESTAMP | When completed |

---

### `mentors`

*Extended profile for mentor users*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | |
| `user_id` | FK → `users` UNIQUE | One per user |
| `bio_en` | TEXT NULL | Biography (EN) |
| `bio_ar` | TEXT NULL | Biography (AR) |
| `expertise_major_ids` | JSON | Major IDs they advise on |
| `type` | ENUM(`student`, `expert`) | Peer vs professional |
| `hourly_rate_usd` | DECIMAL(10,2) NULL | NULL = free |
| `rating` | DECIMAL(3,2) DEFAULT 0.00 | Average rating |
| `total_sessions` | INT DEFAULT 0 | Completed count |
| `is_verified` | BOOLEAN DEFAULT false | Admin verified |
| `created_at` / `updated_at` | TIMESTAMPS | |

---

### `mentor_sessions`

*Booked mentorship sessions*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | |
| `mentor_id` | FK → `mentors` | Mentor |
| `student_id` | FK → `users` | Student |
| `scheduled_at` | TIMESTAMP | Date/time |
| `duration_minutes` | INT DEFAULT 30 | Length |
| `status` | ENUM(`pending`, `confirmed`, `completed`, `cancelled`) | State |
| `meeting_link` | VARCHAR(500) NULL | Video call URL |
| `notes` | TEXT NULL | Mentor's notes |
| `rating` | TINYINT NULL | 1–5 from student |
| `feedback` | TEXT NULL | Student feedback |
| `created_at` / `updated_at` | TIMESTAMPS | |

---

### `ai_conversations`

*AI chatbot history (Premium)*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | |
| `user_id` | FK → `users` | ON DELETE CASCADE |
| `title` | VARCHAR(255) NULL | Auto-generated title |
| `messages` | JSON | `[{role, content, timestamp}]` |
| `context_major_id` | FK → `majors` NULL | If about a specific major |
| `created_at` / `updated_at` | TIMESTAMPS | |

---

### `market_trends`

*Market research data over time*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | |
| `major_id` | FK → `majors` | ON DELETE CASCADE |
| `year` | INT | Data year (2024, 2025) |
| `demand_score` | INT | 1–100 |
| `avg_starting_salary_usd` | INT NULL | Starting salary |
| `employment_rate` | DECIMAL(5,2) NULL | % employed within 1 year |
| `top_sectors` | JSON NULL | Sector names |
| `source` | VARCHAR(255) NULL | Data source |
| `created_at` / `updated_at` | TIMESTAMPS | |

---

### `subscriptions`

*Premium subscription records*

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK AI | |
| `user_id` | FK → `users` | ON DELETE CASCADE |
| `plan` | ENUM(`monthly`, `yearly`, `lifetime`) | Plan type |
| `status` | ENUM(`active`, `cancelled`, `expired`) | Current status |
| `stripe_subscription_id` | VARCHAR(255) NULL | Stripe sub ID |
| `stripe_customer_id` | VARCHAR(255) NULL | Stripe customer ID |
| `starts_at` | TIMESTAMP | Start date |
| `ends_at` | TIMESTAMP NULL | End date |
| `amount_usd` | DECIMAL(10,2) | Amount paid |
| `created_at` / `updated_at` | TIMESTAMPS | |

---

## Key Indexes

```sql
-- Majors (most queried table)
CREATE INDEX idx_majors_category ON majors(category_id);
CREATE INDEX idx_majors_demand ON majors(local_demand);
CREATE INDEX idx_majors_difficulty ON majors(difficulty_level);
CREATE INDEX idx_majors_featured ON majors(is_featured);
CREATE FULLTEXT INDEX idx_majors_search ON majors(name_en, overview_en);

-- University-Major lookups (both directions)
CREATE INDEX idx_unimajors_uni ON university_majors(university_id);
CREATE INDEX idx_unimajors_major ON university_majors(major_id);

-- User features (fast per-user queries)
CREATE INDEX idx_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_comparisons_user ON comparison_history(user_id);
CREATE INDEX idx_test_results_user ON test_results(user_id, created_at);

-- Mentorship
CREATE INDEX idx_sessions_mentor ON mentor_sessions(mentor_id, status);
CREATE INDEX idx_sessions_student ON mentor_sessions(student_id, status);
```

---

## API Endpoints Reference

All endpoints prefixed with `/api/v1/`. Auth via Laravel Sanctum bearer tokens.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register with optional onboarding data |
| `POST` | `/auth/login` | Public | Login, returns Sanctum token |
| `POST` | `/auth/logout` | Auth | Revoke current token |
| `POST` | `/auth/forgot-password` | Public | Send reset email |
| `POST` | `/auth/reset-password` | Public | Reset password with token |
| `GET` | `/auth/verify-email/{id}/{hash}` | Public | Verify email |
| `GET` | `/auth/user` | Auth | Get current user profile |
| `PUT` | `/auth/user` | Auth | Update profile |

### Majors

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/majors` | Public | List with filters (category, demand, difficulty, search, paginate) |
| `GET` | `/majors/featured` | Public | Featured majors for homepage |
| `GET` | `/majors/{slug}` | Public | Full detail with all relations |
| `GET` | `/majors/compare?ids=1,2,3` | Public | Compare up to 3 side by side |
| `GET` | `/majors/{id}/suggest-third` | Auth | Suggest third major from two similar ones |
| `GET` | `/majors/{id}/compatibility` | Auth | User's compatibility score (needs test results) |
| `GET` | `/majors/{id}/universities` | Public | Universities offering this major |

### Categories

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/categories` | Public | All categories with major count |
| `GET` | `/categories/{slug}` | Public | Category detail with majors |

### Universities

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/universities` | Public | List with filters (type, location, major) |
| `GET` | `/universities/{slug}` | Public | Detail with all programs |

### User Features

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/favorites` | Auth | List saved majors |
| `POST` | `/favorites/{major_id}` | Auth | Save a major |
| `DELETE` | `/favorites/{major_id}` | Auth | Remove from favorites |
| `GET` | `/comparisons/history` | Auth | Past comparisons |

### Personality Test

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/test/questions` | Public | All active questions + options |
| `POST` | `/test/submit` | Auth | Submit answers → scoring → ranked results |
| `GET` | `/test/results` | Auth | Test result history |
| `GET` | `/test/results/{id}` | Auth | Specific result with details |

### Mentorship

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/mentors` | Auth | List with filters (type, expertise, rating) |
| `GET` | `/mentors/{id}` | Auth | Mentor profile |
| `POST` | `/sessions` | Auth | Book a session |
| `PUT` | `/sessions/{id}` | Auth | Update (confirm, cancel) |
| `POST` | `/sessions/{id}/rate` | Auth | Rate + review completed session |
| `GET` | `/sessions` | Auth | List user's sessions (mentor or student) |

### AI Chatbot (Premium)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/ai/conversations` | Premium | Start new conversation |
| `POST` | `/ai/conversations/{id}/messages` | Premium | Send message (3/day free) |
| `GET` | `/ai/conversations` | Premium | Conversation history |

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST/PUT/DELETE` | `/admin/majors` | Admin | CRUD majors + related data |
| `POST/PUT/DELETE` | `/admin/universities` | Admin | CRUD universities |
| `POST/PUT/DELETE` | `/admin/test-questions` | Admin | Manage test bank |
| `GET` | `/admin/users` | Admin | List and search users |
| `PUT` | `/admin/users/{id}/role` | Admin | Change user role |
| `GET` | `/admin/analytics` | Admin | Platform stats (signups, popular majors, test completion) |

---

*→ Back to [`README.md`](./README.md) for project overview and team structure.*
