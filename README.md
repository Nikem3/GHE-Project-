# GHE Academic Portal

Web portal for Global Higher Education (GHE). Students browse courses and submit enquiries; staff answer them; admins manage staff, students, courses, announcements and reports. Built for ITECH 3208 (Federation University) by Team Nirmaan.

## Roles

| Role | Can do |
|------|--------|
| Public (no login) | Browse courses and course detail, read About/Blog, send a contact message, self-register as a student, request a password reset |
| Student | Dashboard, submit enquiries (optionally tied to a course), view own enquiries and message threads, reply, edit profile, change password |
| Staff | Dashboard (with per-staff reply stats), view all enquiries, reply, change status (`open` / `in_progress` / `resolved`), assign an enquiry to any active staff/admin, create and edit courses, enquiry reports (date range, CSV download, print), profile |
| Admin | Everything staff can do via the API, plus: create/edit/deactivate staff and reset their passwords, list/deactivate students and reset their passwords, announcements (create/edit), activity log (filter by date and role in the UI; the API also accepts an action filter), contact-form messages, enquiry reports |

Notes:
- Self-registration (`POST /api/auth/register`) always creates a `student`. Staff are created only by an admin.
- A staff reply on an `open` enquiry moves it to `in_progress`.
- Deactivated users are rejected on every authenticated request.
- Admin has no separate enquiry UI route, but the enquiry API accepts admin like staff.

## Tech stack

- Frontend: React 19, React Router 7, Vite 8, CSS Modules, lucide-react; tests with Vitest + Testing Library.
- Backend: Node.js + Express 4, JWT auth (`jsonwebtoken`), `bcryptjs`, `nodemailer` (password-reset email).
- Database: SQLite via the built-in `node:sqlite` module (needs Node 22+; see `.nvmrc`).
- Hosting: Vercel (frontend), Render (API).

## Project structure

```
src/                    React app
  App.jsx               routes (public, /student, /staff, /admin)
  pages/{public,student,staff,admin}/
  components/           shared UI (ProtectedRoute, EnquiryThread, ReportsView, ...)
  layouts/              Public / Student / Staff / Admin layouts
  context/AuthContext.jsx
  lib/                  API helpers, report CSV builder
server/
  server.js             Express app; mounts /api/* routes; auto-seeds an empty DB
  routes/               auth, courses, enquiries, staff, users, reports, activity, contact, announcements
  middleware/auth.js    verifyToken, requireRole
  lib/                  activity logger, mailer
  db/                   schema.sql, seed.js, connection.js
  test/                 node:test API tests
render.yaml             Render service (API)
vercel.json             Vercel rewrites
setup.sh / setup.bat    install frontend deps and start the dev server
```

## Prerequisites

- Node.js 22 or newer (`node:sqlite` is required by the server) and npm.

## Setup and run

Run the backend and frontend in two terminals.

Backend (http://localhost:3001):

```bash
cd server
npm install
cp .env.example .env     # JWT_SECRET is required for login to work
npm run dev              # or: npm start
```

On first start the users table is empty, so the server seeds demo data automatically. `npm run seed` re-runs the seed manually and **wipes all existing data** (users, courses, enquiries, activity, messages, announcements).

Frontend (http://localhost:5173):

```bash
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:3001`, so no frontend env vars are needed.

`./setup.sh` (or `setup.bat` on Windows) installs frontend dependencies and starts only the frontend dev server. It does not install or start the backend.

## Environment variables (server)

Set in `server/.env` locally, or in the Render dashboard.

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `JWT_SECRET` | yes | none | Signs auth tokens. Use a long random string in production. |
| `PORT` | no | `3001` | API port |
| `CORS_ORIGIN` | no | `http://localhost:5173` | Comma-separated allowed origins |
| `APP_URL` | no | `http://localhost:5173` | Base URL used in password-reset links |
| `DB_PATH` | no | `server/ghe.db` | SQLite file location |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | no | port 587, from `no-reply@ghe.edu.au` | Real reset emails. Without `SMTP_HOST` the reset email is logged to the server console instead of sent. |

`server/.env.example` currently lists only `JWT_SECRET` and `PORT`.

## Demo accounts

Created by the seed script. Demo only; never use these outside local/demo environments.

| Role | Email | Password |
|------|-------|----------|
| Student | `nikem@ghe.edu.au` | `nikem123` |
| Student | `priya@ghe.edu.au` | `priya123` |
| Staff | `sachin@ghe.edu.au` | `sachin123` |
| Admin | `admin@ghe.edu.au` | `Password123!` |

Seed data also includes 8 courses, 3 sample enquiries and 2 announcements.

## Scripts

Frontend (repo root):

| Command | Does |
|---------|------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the build locally |
| `npm run lint` | ESLint |
| `npm test` | Vitest (watch) |
| `npm run test:run` | Vitest, single run |

Backend (`server/`):

| Command | Does |
|---------|------|
| `npm run dev` | `node --watch server.js` |
| `npm start` | `node server.js` |
| `npm run seed` | Reset and reseed the database |
| `npm test` | `node --test test/` |

## Testing

- Server API tests: `cd server && npm test` (Node's built-in `node:test`).
- Frontend unit/component tests: `npm run test:run`.
- End-to-end tests (Playwright): `npm run test:e2e`. Playwright starts its own API (port 3101, temporary DB) and Vite (port 5174); run `npx playwright install chromium` once first.

## Deployment

- Frontend on Vercel. `vercel.json` rewrites `/api/*` to `https://ghe-portal-api.onrender.com/api/*` and sends every other path to `index.html` (SPA routing). If the Render service has a different URL, update that rewrite.
- API on Render via `render.yaml` (`rootDir: server`, `npm install`, `npm start`, health check `/api/courses`, free plan). `JWT_SECRET` is generated automatically. Set `CORS_ORIGIN` and `APP_URL` to the Vercel URL after the frontend is deployed; SMTP variables are optional.
- Render free-tier caveats: no persistent disk, so the SQLite file is recreated and reseeded on every restart/redeploy, and any data entered is lost. The service sleeps when idle; the first request after that takes about 50 seconds.

## Known limitations

- Data does not persist on the Render free tier (see above).
- Without SMTP configured, password-reset emails are not sent.
- Seeded demo credentials are public; change or remove them before any real use.
- The public Blog page is fed by the announcements API (admin-created announcements).
