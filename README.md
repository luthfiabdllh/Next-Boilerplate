# Enterprise Next.js Template

A production-ready, enterprise-grade Next.js 16 starter template with a complete **authentication domain**, **TanStack Query**, **Zustand**, **shadcn/ui**, **Vitest**, **Playwright**, and **GitHub Actions CI/CD** — ready to clone and ship.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Architecture](#architecture)
  - [Two-Layer Auth Security](#two-layer-auth-security)
  - [BFF Route Handlers](#bff-route-handlers)
  - [Server State vs. UI State](#server-state-vs-ui-state)
- [Adding a New Feature Domain](#adding-a-new-feature-domain)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Available Scripts](#available-scripts)

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS v4 (CSS-first) + shadcn/ui (Nova preset) |
| **Theming** | `next-themes` (Light, Dark, System) + TweakCN Presets + Live Customizer |
| **UI Components** | shadcn/ui + Radix UI + Lucide Icons |
| **Server State** | TanStack Query v5 (+ RSC prefetching) |
| **UI State** | Zustand v5 |
| **Forms** | React Hook Form + Zod v4 |
| **HTTP Client** | Axios (with refresh token interceptor) |
| **Auth** | httpOnly cookies + `jose` (JWT verification) |
| **Env Validation** | T3 Env (`@t3-oss/env-nextjs`) |
| **Unit Tests** | Vitest + Testing Library |
| **E2E Tests** | Playwright (Chromium, Firefox, Mobile) |
| **Git Hooks** | Husky + lint-staged |
| **CI/CD** | GitHub Actions (5-step pipeline) |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with ThemeProvider, QueryProvider, Toaster
│   ├── page.tsx                  # Root page → redirects to /dashboard
│   ├── globals.css               # Tailwind v4 + shadcn CSS variables
│   ├── error.tsx                 # Global error boundary (client)
│   ├── (auth)/
│   │   ├── login/page.tsx           # Login page
│   │   ├── register/page.tsx        # Registration page
│   │   └── forgot-password/page.tsx # Password reset request
│   ├── (dashboard)/
│   │   ├── layout.tsx        # ⚠️ Authoritative JWT check + Shell
│   │   ├── dashboard/page.tsx# Dashboard metrics
│   │   ├── users/page.tsx    # Data Table CRUD & RBAC showcase
│   │   ├── profile/page.tsx  # User Profile & Password settings
│   │   └── settings/page.tsx # Settings blueprint
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts           # BFF: validates + sets cookie
│       │   ├── register/route.ts        # BFF: account registration
│       │   ├── forgot-password/route.ts # BFF: reset instructions
│       │   ├── profile/route.ts         # BFF: get/patch profile
│       │   ├── change-password/route.ts # BFF: update password
│       │   ├── logout/route.ts          # BFF: clears cookies
│       │   └── refresh/route.ts         # BFF: token refresh
│       └── users/
│           ├── route.ts                 # BFF: search, filter, paginate, create
│           └── [id]/route.ts            # BFF: get, patch, delete user
├── components/
│   ├── ui/                       # shadcn/ui primitives (dialog, sheet, table, select, chart, item, etc.)
│   ├── shared/                   # Reusable cross-feature utilities
│   │   ├── confirm-dialog.tsx    # Generic destructive/action confirmation
│   │   ├── delta.tsx             # Numeric delta trend indicator (+/- with badges)
│   │   ├── role-guard.tsx        # <Can> and <RoleGuard> authorization components
│   │   └── theme-customizer.tsx  # TweakCN theme customizer & CSS exporter
│   ├── layouts/                  # App shell components (@efferd/dashboard-4)
│   │   ├── app-shell.tsx         # Root layout shell with SidebarProvider & SidebarInset
│   │   ├── app-sidebar.tsx       # Floating collapsible sidebar with left-anchored icons & RBAC nav
│   │   ├── app-header.tsx        # Top header with trigger, breadcrumbs, notifications & user profile
│   │   ├── nav-group.tsx         # Collapsible grouped navigation (dropdown on collapsed icon mode)
│   │   ├── nav-user.tsx          # User profile dropdown with role badge & logout
│   │   ├── app-breadcrumbs.tsx   # Dynamic pathname-aware breadcrumbs
│   │   ├── custom-sidebar-trigger.tsx # Sidebar toggle with tooltip & ⌘B shortcut
│   │   └── latest-change.tsx     # Dismissible update / changelog card with accordion transition
│   └── dashboard/                # Analytics & Dashboard widgets (@efferd/dashboard-4)
│       ├── dashboard.tsx         # Master responsive dashboard grid layout
│       ├── stats.tsx             # KPI metric cards (Total revenue, Orders, AOV, Conversion)
│       ├── revenue-chart.tsx     # Interactive area chart with gradient fill & timeframe filter
│       ├── revenue-chart-data.ts # Demo revenue data generator
│       ├── refund-return-rate-chart.tsx # Daily refund rate line chart
│       ├── category-rank-chart.tsx      # Monochromatic category share donut chart
│       └── quick-actions.tsx     # Shortcuts list card with action items
├── features/
│   ├── auth/                     # Auth feature domain
│   │   ├── api/                  # Query keys, mutations, queries
│   │   ├── components/           # Login, Register, Forgot Password, Profile forms
│   │   └── types/index.ts        # Zod v4 schemas + TypeScript types
│   └── users/                    # Users CRUD & Data Table showcase
│       ├── api/                  # Query keys, useUsers, useCreateUser, etc.
│       ├── components/           # UserTable, UserFormDialog
│       └── types/index.ts        # Zod schemas + User entity types
├── lib/
│   ├── api-client.ts             # Axios instance + refresh interceptor
│   ├── api-response.ts           # Standard API response & error formatters
│   ├── formater.ts               # Number, currency, and chart date formatters
│   ├── get-query-client.ts       # Singleton QueryClient (React cache)
│   ├── rbac.ts                   # Role & Permission definitions + matrix
│   ├── theme.ts                  # TweakCN presets registry & CSS generator
│   ├── verify-session.ts         # jose JWT verification (server-only)
│   └── utils.ts                  # cn(), formatDate(), etc.
├── hooks/
│   └── use-permissions.ts        # Authorization hook for Client Components
├── providers/
│   ├── query-provider.tsx        # TanStack Query provider
│   └── theme-provider.tsx        # next-themes + TweakCN preset sync provider
├── store/
│   └── ui.store.ts               # Zustand UI store (sidebar, theme)
├── proxy.ts                      # ⚠️ Next.js 16 proxy (NOT middleware.ts)
└── env.ts                        # T3 Env schema (validated at startup)

e2e/
└── auth.spec.ts                  # Playwright E2E tests

.github/
└── workflows/
    └── ci.yml                    # GitHub Actions: Lint→TS→Test→Build→E2E
```

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url> my-app
cd my-app
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
BACKEND_API_URL=https://api.your-backend.com
JWT_SECRET=your-secret-key-at-least-32-characters-long
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
ALLOWED_ORIGINS=http://localhost:3000
```

> **Important:** `JWT_SECRET` must be the **same** secret your backend uses to sign JWTs. This template verifies signatures on the server.

### 3. Start developing

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/dashboard`, then to `/login` if unauthenticated.

---

## Environment Variables

| Variable | Side | Description |
|---|---|---|
| `BACKEND_API_URL` | Server | Your backend base URL (e.g. `https://api.example.com`) |
| `JWT_SECRET` | Server | Secret to verify JWT signatures (min 32 chars) |
| `ACCESS_TOKEN_TTL` | Server | Access token lifetime in seconds (default: `900`) |
| `REFRESH_TOKEN_TTL` | Server | Refresh token lifetime in seconds (default: `604800`) |
| `ALLOWED_ORIGINS` | Server | Comma-separated list of allowed CORS origins |
| `NEXT_PUBLIC_APP_URL` | Client | Public-facing app URL |
| `NEXT_PUBLIC_API_URL` | Client | Public-facing BFF API URL (usually `<APP_URL>/api`) |

All variables are validated at startup via **T3 Env** (`src/env.ts`). The app will throw a descriptive error at boot if any are missing or malformed.

---

## Architecture

### Two-Layer Auth Security

This template implements a deliberate two-layer auth pattern:

```
Request → [Layer 1: proxy.ts] → [Layer 2: dashboard layout]
```

**Layer 1 — `src/proxy.ts` (Thin Check)**
- Checks cookie *existence* only (is `access_token` cookie set?)
- Performs CSRF origin validation on mutating requests
- Does **NOT** verify JWT signatures (prevents logout loops)
- Redirects to `/login` if cookie is missing

**Layer 2 — `src/app/(dashboard)/layout.tsx` (Authoritative Check)**
- Calls `verifySession()` which uses `jose` to verify: signature + algorithm + expiry
- Even if Layer 1 is bypassed, this layer catches invalid tokens
- Redirects to `/login` if token is invalid or expired

> ⚠️ **Never** do JWT verification in `proxy.ts`. Keep it thin. Put authoritative checks in Server Component layouts.

### BFF Route Handlers

The `src/app/api/auth/` Route Handlers act as a **Backend For Frontend (BFF)** proxy:

- They receive requests from the client (via Axios)
- Validate and transform the request
- Forward to the real backend
- Set/clear `httpOnly` cookies — **the client JS never touches tokens directly**

The refresh token cookie is path-restricted to `/api/auth/refresh` only, so it can never be sent to other endpoints accidentally.

### Server State vs. UI State

| Concern | Where it lives |
|---|---|
| User profile, API data | TanStack Query (`useCurrentUser`, etc.) |
| Sidebar open/close | Zustand `useUIStore` |
| Theme preference | Zustand `useUIStore` (persisted to localStorage) |

> **Rule:** Never put API responses or auth state in Zustand. Use TanStack Query for all server/remote state.

#### RSC Prefetching Pattern

Server Components prefetch data so Client Components get it instantly (no loading flash):

```tsx
// In a Server Component (page.tsx or layout.tsx):
const queryClient = getQueryClient();
await queryClient.prefetchQuery({
  queryKey: authKeys.currentUser(),
  queryFn: getCurrentUserServer,
});

return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <ClientComponent /> {/* ← receives data from cache, no loading state */}
  </HydrationBoundary>
);
```

---

## Adding a New Feature Domain

Follow the auth feature as a blueprint. Create `src/features/your-feature/`:

```
src/features/products/
├── api/
│   ├── query-keys.ts        # productKeys factory
│   ├── server-fetch.ts      # Server-only fetch functions
│   ├── use-queries.ts       # useProducts(), useProduct(id)
│   └── use-mutations.ts     # useCreateProduct(), useDeleteProduct()
├── components/
│   └── product-form.tsx
├── hooks/
│   └── use-product-filters.ts
└── types/
    └── index.ts             # Zod schemas + TS types
```

**Checklist:**
- [ ] Define Zod schemas in `types/index.ts`
- [ ] Create query key factory in `api/query-keys.ts`
- [ ] Server-side fetch in `api/server-fetch.ts` (use native `fetch`, not Axios)
- [ ] Client-side hooks in `api/use-queries.ts` and `api/use-mutations.ts` (use Axios via `apiClient`)
- [ ] Prefetch in the page's Server Component with `HydrationBoundary`
- [ ] Add a BFF Route Handler in `src/app/api/your-feature/route.ts` if needed
- [ ] Write unit tests for schemas and query keys
- [ ] Add E2E scenarios to `e2e/`

---

## Testing

### Unit Tests (Vitest)

```bash
# Run all unit tests
npm run test:unit

# Run in watch mode (during development)
npm run test:unit:watch
```

Tests are in `src/**/__tests__/` directories. Coverage report is generated in `coverage/`.

**Coverage scope** (files measured):
- `src/features/**/types/`
- `src/features/**/api/query-keys.ts`
- `src/lib/utils.ts`, `src/lib/rbac.ts`, `src/lib/theme.ts`, `src/lib/api-response.ts`, `src/lib/formater.ts`

> App Router files, components, and browser-only code are excluded — they're covered by Playwright.

### E2E Tests (Playwright)

```bash
# Install browsers (first time only)
npx playwright install --with-deps chromium

# Run all E2E tests
npm run test:e2e

# Open Playwright UI
npm run test:e2e:ui
```

E2E tests cover:
- Login form validation
- Protected route redirects
- Root route navigation
- Logout button accessibility

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push to `main` and on all pull requests:

```
1. Lint          — ESLint across src/
2. TypeScript    — tsc --noEmit
3. Unit Tests    — Vitest with coverage
4. Build         — next build (validates the full app)
5. E2E Tests     — Playwright on Chromium against the built app
```

Each step requires the previous to succeed. Build artifacts are passed from the Build step to the E2E step.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler check |
| `npm run test:unit` | Run Vitest with coverage |
| `npm run test:unit:watch` | Run Vitest in watch mode |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Open Playwright UI mode |

---

## License

MIT
