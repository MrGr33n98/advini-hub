# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── advocacia-hub/      # AdvocaciaHub frontend (React + Vite)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package
```

## AdvocaciaHub — Brazilian Legal Marketplace

A marketplace connecting clients with verified lawyers and law firms. Key pages:
- `/` — Homepage with hero, search, featured lawyers, specialties section, blog posts
- `/buscar` — Lawyer search with specialty/city/state filters and pagination
- `/advogado/:id` — Lawyer profile with bio, specialties, reviews, contact form
- `/blog` — Blog posts list with tag filters
- `/blog/:id` — Blog post detail page

### Database Schema

- `specialties` — Legal specialty tree (3 levels deep)
- `offices` — Law firms/offices
- `lawyers` — Lawyer profiles with OAB, ratings, experience
- `lawyer_specialties` — Many-to-many relationship
- `reviews` — Client reviews with moderation (pending/approved/rejected)
- `blog_posts` — Articles written by verified lawyers
- `banners` — Ad banners by position (header/sidebar/blog-between)
- `contact_messages` — Contact inquiries sent to lawyers

### API Routes (under /api)

- `GET /lawyers` — List with filters (specialty, city, state, minRating, search)
- `GET /lawyers/:id` — Lawyer detail with specialties, office, recent reviews
- `GET /specialties` — All specialties for filter UI
- `GET /reviews/lawyer/:lawyerId` — Approved reviews for a lawyer
- `POST /reviews` — Submit review (auto-moderation: approved if rating≥3 & comment≥50 chars)
- `GET /blog` — Published blog posts with optional tag filter
- `GET /blog/:id` — Blog post detail
- `GET /banners` — Active banners by position
- `POST /contact` — Send contact message to a lawyer

### Seed Data

- 14 specialties (8 top-level + 6 sub-specialties)
- 3 law offices
- 10 verified lawyers across Brazil
- 21 lawyer-specialty links
- 12 approved reviews
- 4 published blog posts

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts all sub-routers
- Depends on: `@workspace/db`, `@workspace/api-zod`

### `artifacts/advocacia-hub` (`@workspace/advocacia-hub`)

React + Vite frontend. 
- Entry: `src/main.tsx`
- Routing: wouter with BASE_URL prefix
- API calls: `@workspace/api-client-react` React Query hooks
- UI: shadcn/ui + Tailwind CSS with claymorphism design
- Animations: framer-motion
- Forms: react-hook-form + zod

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.

- `src/schema/` — All table definitions (specialties, offices, lawyers, reviews, blog_posts, banners, contact_messages)
- `drizzle.config.ts` — Drizzle Kit config

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`).

Run codegen: `pnpm --filter @workspace/api-spec run codegen`
