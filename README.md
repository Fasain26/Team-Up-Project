# TeamUp — Student Collaboration & Project Matching Platform

TeamUp helps students find teammates by **skill fit**. Create a profile, list your skills, browse projects for hackathons / startups / research / competitions, and apply — or post your own project and review applicants ranked by how well their skills match what you need.

**Live demo:** _add your Vercel URL here_
**API:** _add your Render URL here_

> ⚠️ The backend runs on Render's free tier, which sleeps after inactivity — the first request may take ~30s to wake up.

---

## Features

- **Authentication** — register / login / logout with JWT access tokens + httpOnly refresh-cookie rotation, bcrypt password hashing, and brute-force rate limiting.
- **Profiles & skills** — editable profile, many-to-many skills (create-or-connect), and Cloudinary avatar uploads.
- **Projects** — full CRUD with categories, difficulty, required skills, team size, and remote flag. Owner-only edit/delete (authorization, not just authentication).
- **Search, filter & pagination** — search by title/description, filter by category and location, sort, and paginate.
- **Applications** — apply with a message; owners accept/reject; accepting adds the applicant to the team in a single DB transaction.
- **Smart matching** — every project shows your skill-fit as a percentage (`matched / required × 100`); the dashboard recommends the best-fit open projects.
- **Dashboard** — real stats (projects joined, applications, owned) plus recommendations and recent activity.

## Tech stack

**Frontend:** React + TypeScript, Vite, Tailwind CSS v4, React Router, TanStack Query, React Hook Form, Zod, Axios
**Backend:** Node.js, Express 5, TypeScript, Prisma ORM, JWT, bcrypt
**Database:** PostgreSQL (Neon) · **Storage:** Cloudinary
**Deploy:** Vercel (web) · Render (API) · Neon (DB)

## Architecture

The backend follows a layered design — each layer has one job, which keeps logic testable and changes localized:

```
request → route → middleware (auth, validate, rate-limit)
        → controller (HTTP in/out)
        → service (business logic)
        → repository (the only layer that touches Prisma)
        → PostgreSQL
```

The frontend mirrors this separation: `services/` (API calls) → `hooks/` (TanStack Query) → `pages/` + `components/`.

```
teamup/
├── server/   Express + Prisma API
│   └── src/{routes,controllers,services,repositories,middlewares,validators,utils,config}
└── client/   React + Vite SPA
    └── src/{pages,components,layouts,services,hooks,contexts,routes,types,lib}
```

## Running locally

**Prerequisites:** Node 18+, a PostgreSQL database (e.g. a free Neon project), optionally a Cloudinary account for avatar uploads.

### Backend

```bash
cd server
npm install
cp .env.example .env     # then fill in the values below
npx prisma migrate dev   # create tables
npm run db:seed          # seed the skills catalog
npm run dev              # http://localhost:4000/api
```

`server/.env`:

```
DATABASE_URL="postgresql://...neon..."
JWT_ACCESS_SECRET="<random 32+ char hex>"
JWT_REFRESH_SECRET="<different random hex>"
CLIENT_ORIGIN="http://localhost:5173"
# optional (avatar uploads):
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### Frontend

```bash
cd client
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:4000/api
npm run dev              # http://localhost:5173
```

## Testing

```bash
cd server
npm test
```

Unit tests cover the pure matching formula (`computeMatchScore`) and the auth validation schemas. The service/route layers are structured for integration testing with supertest (the Express app is exported separately from the server entry point).

## API overview

| Method | Route | Description |
| --- | --- | --- |
| POST | `/auth/register` · `/auth/login` · `/auth/refresh` · `/auth/logout` | Auth |
| GET / PATCH | `/users/me` | Read / update profile |
| POST | `/users/me/avatar` · `/users/me/skills` | Avatar upload · add skill |
| GET / POST | `/projects` | List (search/filter/paginate) · create |
| GET / PATCH / DELETE | `/projects/:id` | Detail · update · delete (owner) |
| POST / GET | `/projects/:id/apply` · `/projects/:id/applications` | Apply · list applicants (owner) |
| PATCH | `/applications/:id` | Accept / reject (owner) |
| GET | `/projects/:id/matches` · `/users/me/recommendations` | Matching |
| GET | `/dashboard` | Dashboard stats |

## Deployment

1. **Database** — create a Neon project, copy the connection string.
2. **Backend (Render)** — new Web Service from `server/`; build `npm install && npm run build` (runs `prisma migrate deploy`), start `npm run start`; set the env vars above, with `CLIENT_ORIGIN` = your Vercel URL.
3. **Frontend (Vercel)** — import the repo, root `client/`; set `VITE_API_URL` = your Render URL + `/api`. The included `vercel.json` handles SPA routing.

---

Built as a portfolio project to demonstrate full-stack engineering: layered architecture, secure auth, relational data modeling, and a real recommendation feature.
