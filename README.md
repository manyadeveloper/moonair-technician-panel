# MoonAir Technician Service Panel

Internal field-service application for MoonAir Home Appliances technicians. Used to manage assigned service jobs, record inspections and repairs, track parts and photos, and complete service visits for air coolers and related products.

The application is currently **frontend-only** and runs on mock data. Supabase integration is prepared in the service layer but not connected. No environment variables are required to run the project in its present phase.

**Made by Manya Shukla**

---

## Architecture

```
UI (pages & components)
        ↓
Providers (client state)
        ↓
Service layer (lib/services)
        ↓
Mock data (lib/mock)          →  Supabase (future)
```

Pages and components never import mock arrays directly. All reads and writes go through `ServiceDataProvider` and `lib/services/*`, so backend integration can replace mock implementations without redesigning the UI.

---

## Application routes

| Route | Purpose |
|-------|---------|
| `/login` | Technician sign-in |
| `/dashboard` | Daily overview — KPIs, schedule, priority jobs, activity |
| `/services` | Assigned service requests — search, filters, pagination |
| `/services/[id]` | Active service workspace — full workflow |
| `/jobs` | Today's operational schedule and upcoming visits |
| `/jobs/[id]` | Same service workspace, opened from My Jobs |
| `/history` | Completed and closed service archive |
| `/history/[id]` | Read-only view of a completed service record |
| `/notifications` | Service alerts and updates |
| `/profile` | Technician account overview |
| `/profile/edit` | Edit personal contact details |
| `/profile/settings` | Notification preferences, password, sign out |

All technician routes except `/login` share a fixed layout: sidebar navigation, top header, and scrollable main workspace.

---

## Repository structure

### Root

| Path | Purpose |
|------|---------|
| `public/` | Static assets — brand logo, login imagery |
| `supabase/migrations/` | PostgreSQL schema for future backend phase |
| `supabase/seed.sql` | Sample seed data for future database setup |
| `.env.example` | Placeholder Supabase variables (empty until backend phase) |

### `src/app/` — Routes and pages

Next.js App Router entry points. Each folder maps to a URL segment.

| Path | Purpose |
|------|---------|
| `app/layout.tsx` | Root HTML shell, Inter font, auth and toast providers |
| `app/globals.css` | Design tokens, typography, and global styles |
| `app/page.tsx` | Root redirect to dashboard |
| `app/not-found.tsx` | Global 404 page |
| `app/(auth)/login/` | Login page and client form |
| `app/(technician)/layout.tsx` | Auth guard, service data provider, dashboard shell |
| `app/(technician)/dashboard/` | Technician home — stats and daily schedule |
| `app/(technician)/services/` | Service request list and detail pages |
| `app/(technician)/jobs/` | My Jobs schedule and job detail |
| `app/(technician)/history/` | Service history list and read-only detail |
| `app/(technician)/notifications/` | Notification inbox |
| `app/(technician)/profile/` | Profile, edit, and settings pages |
| `app/(technician)/error.tsx` | Segment error boundary |

Loading and skeleton states live alongside routes (e.g. `services/loading.tsx`, `services/[id]/loading.tsx`).

### `src/components/` — UI building blocks

| Path | Purpose |
|------|---------|
| `layout/` | Application shell — sidebar, header, footer, search, auth guard, page padding |
| `dashboard/` | Dashboard widgets — KPI cards, today's schedule, priority requests, activity feed, operational summary |
| `service/` | Service workflow UI — tables, filters, inspection, diagnosis, parts, photos, notes, timeline, actions |
| `profile/` | Profile edit form and account settings form |
| `ui/` | Shared primitives — button, input, select, card, badge, modal, toast, pagination, skeletons, empty states |

### `src/features/` — Feature-level views

| Path | Purpose |
|------|---------|
| `service-requests/components/service-detail-view.tsx` | Complete service detail workspace; reused by `/services/[id]`, `/jobs/[id]`, and `/history/[id]` with variant-specific behaviour |

Feature folders hold larger, route-connected views that compose multiple `components/service/*` pieces.

### `src/lib/` — Business logic and data

| Path | Purpose |
|------|---------|
| `mock/` | Static seed data and in-memory helpers — technicians, customers, products, service requests, notifications, history |
| `mock/data.ts` | Initial application state factory |
| `mock/helpers.ts` | Filtering, pagination, search, dashboard stats, enrichment |
| `services/` | Service-layer functions — auth, service requests, history, notifications, technicians. Mock-backed today; Supabase-backed later |
| `supabase/` | Placeholder client and query stubs for future integration |
| `constants/` | Service status labels, workflow state machine, timeline messages |
| `validations/` | Zod schemas for forms — auth, inspection, diagnosis, parts, profile, settings |
| `utils/` | Shared utilities — class names, date/phone formatting, mobile menu event |

### `src/providers/` — React context

| Path | Purpose |
|------|---------|
| `auth-provider.tsx` | Mock session — sign in, sign out, profile update |
| `service-data-provider.tsx` | Central in-memory store for all service operations, timeline, notes, parts, photos, notifications |

### `src/types/` — TypeScript definitions

Shared interfaces for technicians, customers, products, service requests, inspections, parts, notifications, and database shapes. Used across mock data, services, and UI.

### `src/config/`

| Path | Purpose |
|------|---------|
| `site.ts` | Brand name, support contacts, logo paths, layout constants |

---

## Service workflow

Technicians progress through a defined status machine:

**Assigned → Accepted → On the Way → Visit → Inspection → Work → Completed**

Alternative outcomes: Requires Parts, Customer Not Available, Unable to Resolve, Cancelled.

Primary actions, confirmation modals, inspection forms, diagnosis, work performed, parts, photos, notes, and customer confirmation all update mock state immediately and append timeline events.

---

## Design system

Professional field-service UI built with Inter, neutral workspace background (`#F6F7F8`), dark sidebar (`#151515`), white bordered cards, and blue primary accent (`#2563EB`). Tokens and typography are defined in `src/app/globals.css`.

---

## Environment variables (future)

When Supabase is connected, copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The service-role key must remain server-only and must never be exposed to client code.

---

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS · Lucide React · React Hook Form · Zod

---

Internal project for MoonAir Home Appliances Private Limited.

**Made by Manya Shukla**
