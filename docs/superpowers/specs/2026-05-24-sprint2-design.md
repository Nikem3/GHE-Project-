# Sprint 2 Design — GHE Academic Portal

**Date:** 2026-05-24
**Sprint Goal:** Database built and connected, login with role-based access working for all three roles, students can browse and view course pages, authenticated portal shells in place.

---

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend runtime | Node.js + Express | Same JS ecosystem as frontend, low context-switch cost |
| Database | SQLite via `better-sqlite3` | File-based, zero install, full SQL support, swap to PostgreSQL later |
| Auth | JWT in `localStorage` | Stateless, simple to implement, standard for REST/SPA |
| Repo structure | Monorepo — frontend at root, backend at `/server` | No disruption to Sprint 1 files |
| Portal layout | Expanded dark sidebar (220px) + text labels + top bar | Most navigable for 4–6 nav items per role |

---

## Repository Structure

```
/                          ← existing React/Vite frontend (unchanged root)
  src/
  public/
  package.json             ← frontend deps
server/                    ← NEW: Node/Express backend
  package.json
  server.js
  db/
    connection.js
    schema.sql
    seed.js
  middleware/
    auth.js
  routes/
    auth.js
    courses.js
```

---

## Database Schema

### `users`

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PRIMARY KEY AUTOINCREMENT | |
| name | TEXT NOT NULL | |
| email | TEXT UNIQUE NOT NULL | |
| password_hash | TEXT NOT NULL | bcrypt, 10 rounds |
| role | TEXT NOT NULL | `student` \| `staff` \| `admin` |
| created_at | TEXT NOT NULL | ISO 8601, default `CURRENT_TIMESTAMP` |

### `courses`

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PRIMARY KEY AUTOINCREMENT | |
| title | TEXT NOT NULL | |
| level | TEXT NOT NULL | `bachelor` \| `master` \| `diploma` |
| faculty | TEXT NOT NULL | |
| duration_years | REAL NOT NULL | e.g. 3, 1.5 |
| description | TEXT NOT NULL | |
| fee_per_year | INTEGER NOT NULL | AUD |
| intakes | TEXT NOT NULL | JSON array of month strings e.g. `["Feb","Jul"]` |
| is_active | INTEGER NOT NULL DEFAULT 1 | SQLite boolean |
| created_at | TEXT NOT NULL | ISO 8601 |

---

## Seed Data

**Users** (password for all: `Password123!`):

| Name | Email | Role |
|------|-------|------|
| Alex Johnson | student@ghe.edu.au | student |
| Sarah Williams | staff@ghe.edu.au | staff |
| Michael Chen | admin@ghe.edu.au | admin |

**Courses (8 total):**

| Title | Level | Faculty |
|-------|-------|---------|
| Bachelor of Business Administration | bachelor | Business |
| Bachelor of Information Technology | bachelor | Technology |
| Bachelor of Accounting | bachelor | Business |
| Master of Business Administration | master | Business |
| Master of Information Technology | master | Technology |
| Master of Professional Accounting | master | Business |
| Graduate Diploma of Management | diploma | Business |
| Graduate Diploma of Information Technology | diploma | Technology |

---

## API Endpoints

Base URL (local dev): `http://localhost:3001/api`

### `POST /api/auth/login`

**Body:** `{ email, password }`
**Response 200:** `{ token: "<jwt>", user: { id, name, email, role } }`
**Response 401:** `{ error: "Invalid email or password" }`

JWT payload: `{ sub: userId, role, iat, exp }` — expires in 7 days.

### `GET /api/auth/me`

**Headers:** `Authorization: Bearer <token>`
**Response 200:** `{ user: { id, name, email, role } }`
**Response 401:** `{ error: "Unauthorised" }`

### `GET /api/courses`

**Query params:** `?level=bachelor|master|diploma` (optional)
**Response 200:** Array of course objects.
**Auth:** None — public endpoint.

### `GET /api/courses/:id`

**Response 200:** Single course object.
**Response 404:** `{ error: "Course not found" }`
**Auth:** None — public endpoint.

---

## Frontend Changes

### `src/context/AuthContext.jsx`

Replace current stub. Responsibilities:
- On mount: read JWT from `localStorage`, call `GET /api/auth/me` to rehydrate user. If token invalid/expired, clear and set user to null.
- `login(email, password)`: POST to `/api/auth/login`, store token, set user state.
- `logout()`: clear `localStorage` token, set user to null, redirect to `/`.
- Expose: `{ user, token, login, logout, loading }`.

### `src/components/ProtectedRoute.jsx` (new)

Props: `allowedRoles: string[]`
- If `loading` → render nothing (avoids flash of redirect).
- If no `user` → redirect to `/login`.
- If `user.role` not in `allowedRoles` → redirect to role home.
- Otherwise → render `<Outlet />`.

Wrap all three portal route groups in `App.jsx` with this component.

### `src/pages/public/Login.jsx`

Split layout:
- **Left panel (40%):** Orange gradient background, GHE logo, tagline "Your Academic Journey Starts Here", trust badges.
- **Right panel (60%):** White, centered form. Email field, password field (toggle visibility), submit button, inline error message.
- On submit: calls `AuthContext.login()`, shows error on failure, redirects on success by role (`/student/dashboard`, `/staff/dashboard`, `/admin/dashboard`).
- No role selector — role determined server-side from credentials.

### `src/layouts/StudentLayout.jsx` / `StaffLayout.jsx` / `AdminLayout.jsx`

Implement layout C (expanded sidebar):
- **Sidebar (220px, `#1C1C2E`):** GHE logo + wordmark; nav items with icon + label; user name + role badge + logout at bottom.
- **Top bar:** Page title, right-aligned user avatar with initials.
- **Content area:** `<Outlet />` with consistent padding.

Nav items per role:

| Role | Nav Items |
|------|-----------|
| Student | Dashboard, Browse Courses, My Enquiries, Profile |
| Staff | Dashboard, Enquiries, Courses, Reports, Profile |
| Admin | Dashboard, Staff, Courses, Reports, Activity, Settings |

### `src/pages/public/Courses.jsx`

- Fetch `GET /api/courses` on mount.
- Filter bar: pill buttons — All / Bachelor's / Master's / Diploma.
- Search input: client-side filter on course title.
- Course cards: title, level badge, faculty, duration, fee, "View Details" link.
- Loading skeleton while fetching. Empty state if no results.

### `src/pages/public/CourseDetail.jsx`

- Fetch `GET /api/courses/:id` using `useParams`.
- Hero: course title, level badge, faculty tag.
- Details grid: Duration, Annual Fee, Intake Months, Faculty.
- Full description paragraph.
- CTA: "Submit an Enquiry" → `/login?next=/student/enquiries/new` if not authed, or `/student/enquiries/new?course=:id` if logged in as student.
- 404 state if course not found.

### Dashboard stubs

Welcome banner (`Hello, {name}`) + placeholder metric cards.

| Role | Placeholder metrics |
|------|-------------------|
| Student | My Enquiries, Pending Responses, Courses Browsed, Last Active |
| Staff | Open Enquiries, Responded Today, Avg. Response Time, Total Students |
| Admin | Total Staff, Active Courses, Enquiries This Month, System Status |

---

## Error Handling

- API 4xx/5xx: inline error message — never a blank screen.
- Network error on login: "Unable to connect to server. Is the backend running?"
- JWT expiry: `AuthContext` catches 401 from `/api/auth/me` on mount, silently clears session.
- Protected route with expired token: `ProtectedRoute` redirects to `/login`.

---

## Local Dev Setup

After Sprint 2, running the project requires two terminals:

```bash
# Terminal 1 — backend
cd server && npm install && npm run seed && npm run dev
# Runs on http://localhost:3001

# Terminal 2 — frontend
npm run dev
# Runs on http://localhost:5173
```

CORS allows `http://localhost:5173`.

---

## Out of Scope (Sprint 3+)

- Enquiry submission and tracking
- Staff responding to enquiries
- Admin course management CRUD
- Report generation
- Password reset
- Email notifications
