# Master Architecture & PRD: Enterprise Next.js Template (v5)

> **Catatan versi:** Semua nomor versi di dokumen ini adalah versi stabil terbaru per **30 Juli 2026**, diverifikasi langsung dari npm registry dan changelog resmi masing-masing package. Saat AI men-generate `package.json`, gunakan range `^` dari versi yang tercantum di Bagian 2, bukan versi yang di-cache dari training data.

---

## 1. Project Overview & Philosophy

Dokumen ini adalah **satu-satunya sumber kebenaran (source of truth)** untuk AI code generation di dalam project ini. Tujuannya membangun template Next.js yang versatile, scalable, modular, dan enterprise-grade.

### Core Philosophies (STRICT)

- **Feature-Driven Architecture** — kode diorganisir berdasarkan domain bisnis/fitur, bukan tipe file.
- **Absolute Separation of Concerns** — batas jelas antara Server Components (RSC) dan Client Components, dan antara **Proxy layer** (jaringan) vs **Server Components** (otorisasi sesungguhnya).
- **Strict Typing & Environment** — TypeScript strict mode wajib. Environment variables divalidasi saat build time via `@t3-oss/env-nextjs`.
- **Resilience & QA** — Playwright (E2E) dan Vitest (Unit) adalah first-class citizen dengan aturan coverage yang jelas.
- **Secure Authentication** — nol ketergantungan pada `localStorage` untuk token sensitif. Mitigasi ketat terhadap XSS dan CSRF, termasuk refresh-token flow yang aman dan pola "Thin Proxy" sesuai model keamanan Next.js 16.
- **Accessibility & i18n Ready** — semua UI interaktif wajib punya `aria-label` yang sesuai. Struktur folder sudah disiapkan untuk path-based i18n routing (`/[lang]/...`) sejak awal.
- **Consistency by Construction** — hal-hal yang rawan human/AI error (query keys, QueryClient instance, JWT verification) dikunci lewat pola/helper terpusat, bukan dipercayakan ke disiplin manual.

---

## 2. Tech Stack Ecosystem (Updated — per 30 Juli 2026)

| Kategori | Package | Versi Stabil Terbaru |
|---|---|---|
| Core Framework | `next` | **16.2.12** (Active LTS)¹ |
| UI Library | `react`, `react-dom` | **19.2.x** |
| Bahasa | `typescript` | **5.9.x** (strict mode) |
| Styling | `tailwindcss` | **4.3.3** |
| Komponen UI | `shadcn/ui` (via CLI `shadcn@latest`) | tidak versioned per-package — selalu tarik komponen terbaru saat generate |
| Server State | `@tanstack/react-query` | **5.101.4** |
| Client/UI State | `zustand` | **5.0.14** |
| Form | `react-hook-form` | **7.83.x** |
| Validasi | `zod` | **4.4.x** (Zod v4) |
| Resolver form ↔ Zod | `@hookform/resolvers` | **5.5.x** |
| API Client (client-side) | `axios` | **1.19.0** |
| Env Validation | `@t3-oss/env-nextjs` | **0.13.11** |
| JWT (Server Components/Route Handlers) | `jose` | **6.2.4** |
| Notifikasi | `sonner` | latest stable |
| Unit Testing | `vitest` | **4.1.10** |
| E2E Testing | `@playwright/test` | **1.58.x** |
| Node.js runtime | — | **22.x LTS** atau **24.x** (baseline CI) |

¹ *Next.js 15.5.21 masih berstatus Maintenance LTS bila project belum bisa migrasi ke 16.x. Lihat catatan migrasi di Bagian 3D.*

**Perubahan tech stack paling signifikan sejak revisi sebelumnya:**

1. **`middleware.ts` → `proxy.ts`.** Sejak Next.js 16, konvensi file middleware resmi di-deprecate dan diganti nama menjadi `proxy.ts` dengan named export `proxy()` (bukan `middleware()`). Ini bukan sekadar rename kosmetik — filosofinya berubah dari "Edge middleware serba-bisa" menjadi **"Thin Proxy"**: proxy hanya boleh melakukan pengecekan ringan (keberadaan cookie, redirect, rewrite), bukan validasi kriptografi penuh atau query database.
2. **Tailwind CSS v4.3.x** — arsitektur CSS-first (`@import "tailwindcss"` di CSS, bukan `tailwind.config.js` berbasis JS untuk kasus umum), engine Oxide yang jauh lebih cepat.
3. **Zod v4** — perhatikan named import berubah di beberapa API; AI wajib memakai sintaks Zod v4 (`import * as z from 'zod'` tetap didukung, tapi cek breaking changes spesifik seperti pesan error kustom dan `z.email()` sebagai pengganti `.email()` chain di beberapa kasus) sebelum generate schema kompleks.
4. **`jose` tetap dipertahankan** meski `proxy.ts` kini default ke Node.js runtime (yang secara teknis membuka opsi `jsonwebtoken`) — lihat justifikasi di Bagian 3D.

---

## 3. Strict Architectural Constraints for AI

### A. Data Fetching & Caching (The Dual Strategy)

**API Client Dichotomy:**
- Axios (v1.19.x) **STRICTLY** untuk Client Components dan TanStack Query hooks.
- Native `fetch` **STRICTLY** untuk Server Components (RSC) dan Route Handlers, memanfaatkan native caching & deduplication Next.js.

**Caching Rule:**
- Next.js Data Cache eksklusif untuk SSR/SSG rendering.
- TanStack Query Cache eksklusif untuk interaktivitas browser (`refetchOnWindowFocus`, `staleTime`, polling).
- Untuk data yang sering berubah, gunakan `cache: 'no-store'` pada RSC fetch dan serahkan lifecycle sepenuhnya ke TanStack Query di client.

**Query Key Factory (WAJIB):**
Setiap fitur wajib punya satu file `query-keys.ts` sebagai satu-satunya sumber query key, diimpor bersama oleh server-side prefetcher dan client-side hooks.

```ts
// src/features/products/api/query-keys.ts
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...productKeys.lists(), filters] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
};
```

**Singleton QueryClient per Request (WAJIB):**
Dilarang memanggil `new QueryClient()` langsung di dalam Server Component. Gunakan helper tersentral yang dibungkus React `cache()`.

```ts
// src/lib/get-query-client.ts
import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query';
import { cache } from 'react';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000 },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

export const getQueryClient = cache(makeQueryClient);
```

---

### B. State Management Bounds

- Zustand (v5) **strictly** untuk Transient UI State (sidebar open/close, dark mode, progress multi-step form).
- **PROHIBITED**: dilarang menyimpan API response atau database entity di Zustand. Semua server state adalah domain eksklusif TanStack Query.
- **Catatan Zustand v5**: API `create()` tidak berubah signifikan dari v4, tapi `zustand/context` sudah dihapus sejak v5 — jika butuh store ter-scope per komponen, gunakan `zustand/vanilla` + React Context manual, bukan API lama.

---

### C. Server Actions vs. API Routes (BFF) & Error Handling

- **Server Actions**: eksklusif untuk tugas BFF ringan, misalnya set/clear httpOnly cookie saat login/logout. **Dilarang** dipakai untuk CRUD standar yang butuh optimistic UI update.
- **Route Handlers (BFF Proxy)**: untuk CRUD, Client memakai TanStack Query untuk memanggil Route Handler (`/api/...`), yang kemudian proxy ke backend eksternal.

**Proxy Error Boundary & Timeout Policy:**
Route Handler wajib menerapkan `AbortController` (timeout 8–10 detik) saat proxy. Semua error backend eksternal (500/502/504) wajib dipetakan ke kontrak JSON standar:

```json
{ "success": false, "error": { "code": 502, "message": "Upstream service unavailable" } }
```

> ⚠️ **Jangan disamakan dengan `proxy.ts`.** "Route Handler (BFF Proxy)" di poin ini adalah file `src/app/api/**/route.ts` biasa, berbeda dari file `proxy.ts` di Bagian 3D yang merupakan konvensi network-boundary Next.js 16. Keduanya sama-sama disebut "proxy" tapi perannya berbeda — jangan gabungkan logikanya dalam satu file.

---

### D. Authentication Strategy & Security

**Storage:** JWT (access token) wajib disimpan di httpOnly cookie. `localStorage` dilarang mutlak.

**Cookie Security:**
```ts
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
}
```

**Proxy Translation Mechanism:** Route Handler membaca token via `cookies().get('access_token')` dari `next/headers`, lalu meneruskannya ke backend eksternal sebagai header `Authorization: Bearer <token>`.

**CSRF Protection:** Untuk semua mutasi (POST/PUT/DELETE), Route Handler atau `proxy.ts` wajib memvalidasi header `Origin`/`Referer` terhadap domain yang diizinkan (allow-list dari env variable).

**Refresh Token Flow:**
- Access token berumur pendek (mis. 15 menit); refresh token berumur panjang (mis. 7 hari), disimpan sebagai httpOnly cookie **terpisah** dengan `path` dibatasi ke endpoint refresh saja (mis. `/api/auth/refresh`).
- Axios instance di `lib/api-client.ts` wajib punya response interceptor yang menangkap status `401`, memanggil endpoint refresh sekali, lalu mengulang request asli.
- **Race condition guard**: satu shared "refresh promise" — request lain yang 401 bersamaan menunggu promise yang sama, bukan memicu request refresh baru.
- Jika refresh gagal, interceptor wajib clear cookie via Server Action dan redirect ke `/login`.

```ts
// src/lib/api-client.ts (ringkas)
let refreshPromise: Promise<void> | null = null;

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      refreshPromise ??= refreshAccessToken().finally(() => { refreshPromise = null; });
      try {
        await refreshPromise;
        return apiClient(error.config);
      } catch {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

**`proxy.ts` & "Thin Proxy" Pattern (WAJIB — perubahan besar Next.js 16):**

Sejak Next.js 16, `middleware.ts` **deprecated** dan digantikan `proxy.ts` dengan named export `proxy()`. Perbedaan krusial yang wajib dipahami AI:

| Aspek | `middleware.ts` (Next.js ≤15) | `proxy.ts` (Next.js 16+) |
|---|---|---|
| Nama fungsi export | `middleware()` | `proxy()` (default export atau named `proxy`) |
| Runtime default | Edge Runtime | **Node.js Runtime** |
| Filosofi resmi | "Serba-bisa" — sering disalahgunakan untuk validasi berat | **"Thin Proxy"** — hanya untuk redirect/rewrite/pengecekan ringan |
| Boleh verifikasi signature JWT penuh + query DB? | Tidak disarankan (keterbatasan Edge) | **Tetap tidak disarankan**, meski secara teknis Node runtime mengizinkan — ini soal arsitektur, bukan cuma kompatibilitas |

Karena filosofi "Thin Proxy" ini eksplisit dari tim Next.js, **AI wajib mengikuti pola berikut**, bukan sekadar "sekarang boleh pakai `jsonwebtoken` karena sudah Node runtime":

1. **Di `proxy.ts`**: hanya cek keberadaan cookie `access_token` dan redirect jika tidak ada. **Jangan** lakukan verifikasi signature JWT lengkap atau query database di sini — ini menjaga proxy tetap ringan dan menghindari bug "logout loop" (session ter-refresh di proxy tapi `Set-Cookie` tidak ikut diteruskan ke response, sehingga user tetap ter-logout).
2. **Verifikasi signature JWT yang otoritatif** (memastikan token benar-benar valid secara kriptografis, belum expired, dsb.) dilakukan di **Server Component** atau **Route Handler**, menggunakan `jose` — bukan di `proxy.ts`. `jose` tetap dipilih di sini (bukan `jsonwebtoken`) karena berbasis Web Crypto API, konsisten di semua runtime (Node, Edge, Cloudflare Workers), dan merupakan standar modern untuk ekosistem Next.js/Auth.js per 2026.
3. Next.js menyediakan codemod resmi untuk migrasi otomatis: `npx @next/codemod@latest rename-middleware-to-proxy .`

```ts
// src/proxy.ts (menggantikan middleware.ts)
import { NextRequest, NextResponse } from 'next/server';

// Thin Proxy: HANYA cek keberadaan cookie, redirect jika tidak ada.
// Verifikasi signature JWT dilakukan di Server Component/Route Handler, BUKAN di sini.
export function proxy(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;

  if (req.nextUrl.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Validasi Origin/Referer untuk mutasi (CSRF layer pertama)
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const origin = req.headers.get('origin');
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json({ success: false, error: { code: 403, message: 'Forbidden origin' } }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

```ts
// src/lib/verify-session.ts — dipanggil dari Server Component, BUKAN dari proxy.ts
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifySession() {
  const token = cookies().get('access_token')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload; // otoritatif: signature + expiry sudah divalidasi penuh
  } catch {
    return null;
  }
}
```

```tsx
// src/app/[lang]/(dashboard)/layout.tsx
import { redirect } from 'next/navigation';
import { verifySession } from '@/lib/verify-session';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession(); // validasi otoritatif ada di sini
  if (!session) redirect('/login');

  return <>{children}</>;
}
```

Pola dua-lapis ini (proxy ringan → Server Component otoritatif) mencegah dua kelas bug yang paling sering muncul pasca-migrasi Next.js 16: **logout loop** (cookie refresh tidak tersinkron) dan **auth bypass** (proxy dianggap cukup padahal hanya cek keberadaan cookie, bukan validitasnya).

---

## 4. Mandatory Folder Structure

```
my-next-template/
├── .husky/
├── .github/workflows/           # CI/CD Pipelines
├── e2e/                         # Playwright E2E tests
├── src/
│   ├── app/
│   │   └── [lang]/              # ⚠️ i18n root segment
│   │       ├── (auth)/
│   │       ├── (dashboard)/
│   │       ├── error.tsx
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── app/
│   │   └── api/                 # Route Handlers (BFF Proxy) — TIDAK ikut [lang]
│   │
│   ├── components/
│   │   ├── ui/                  # shadcn/ui primitives
│   │   ├── forms/
│   │   └── layouts/
│   │
│   ├── features/
│   │   └── [feature-name]/
│   │       ├── api/
│   │       │   ├── query-keys.ts
│   │       │   ├── server-fetch.ts      # native fetch, dipakai RSC
│   │       │   └── use-queries.ts       # Axios + TanStack Query
│   │       ├── components/
│   │       ├── hooks/
│   │       └── types/
│   │
│   ├── hooks/
│   ├── lib/
│   │   ├── api-client.ts         # Axios instance + refresh-token interceptor
│   │   ├── get-query-client.ts   # Singleton QueryClient per request
│   │   ├── verify-session.ts     # Verifikasi JWT otoritatif via jose (dipanggil dari RSC)
│   │   └── utils.ts
│   │
│   ├── providers/
│   ├── store/                    # Zustand (UI STATE ONLY)
│   └── env.ts                    # T3 Env validation schema
│
├── src/proxy.ts                  # ⚠️ WAJIB nama file & lokasi ini (bukan middleware.ts)
├── playwright.config.ts
└── vitest.config.ts
```

> **Catatan migrasi**: jika meng-clone atau upgrade dari project berbasis Next.js ≤15 yang masih memakai `middleware.ts`, jalankan `npx @next/codemod@latest rename-middleware-to-proxy .` sebelum melanjutkan generate fitur baru.

---

## 5. Coding Implementation: The Hydration Boundary

AI **wajib** memakai pola resmi TanStack Query untuk hydration. **Dilarang** meneruskan `initialData` sebagai prop manual ke custom hook.

### Blueprint: RSC Prefetching & Dehydrating

```tsx
// src/app/[lang]/(dashboard)/products/page.tsx
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import { productKeys } from '@/features/products/api/query-keys';
import { getProductsServer } from '@/features/products/api/server-fetch';
import { ProductsList } from '@/features/products/components/products-list';

export default async function ProductsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: productKeys.lists(),
    queryFn: getProductsServer,
  });

  return (
    <main>
      <h1>Products</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductsList />
      </HydrationBoundary>
    </main>
  );
}
```

### Blueprint: Client Component Querying

```tsx
// src/features/products/components/products-list.tsx
'use client';

import { useGetProducts } from '../api/use-queries';

export const ProductsList = () => {
  const { data, isLoading } = useGetProducts();

  if (isLoading) return <ProductsListSkeleton />;

  return (
    <ul aria-label="Daftar produk">
      {data?.map((product) => <li key={product.id}>{product.name}</li>)}
    </ul>
  );
};
```

```ts
// src/features/products/api/use-queries.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { productKeys } from './query-keys';
import { Product } from '../types';

export const useGetProducts = () => {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: async (): Promise<Product[]> => {
      const { data } = await apiClient.get('/products');
      return data;
    },
  });
};
```

### Blueprint: Zod v4 Schema (types/index.ts)

```ts
// src/features/products/types/index.ts
import * as z from 'zod';

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nama produk wajib diisi'),
  price: z.number().positive(),
  // Zod v4: gunakan z.email() sebagai top-level validator, bukan .string().email()
  contactEmail: z.email().optional(),
});

export type Product = z.infer<typeof productSchema>;

export const createProductSchema = productSchema.omit({ id: true });
export type CreateProductDTO = z.infer<typeof createProductSchema>;
```

### Blueprint: Optimistic Update Mutation

```ts
// src/features/products/api/use-mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { productKeys } from './query-keys';
import { Product, UpdateProductDTO } from '../types';
import { toast } from 'sonner';

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProductDTO): Promise<Product> => {
      const { data } = await apiClient.put(`/products/${payload.id}`, payload);
      return data;
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: productKeys.lists() });
      const previous = queryClient.getQueryData<Product[]>(productKeys.lists());

      queryClient.setQueryData<Product[]>(productKeys.lists(), (old) =>
        old?.map((p) => (p.id === payload.id ? { ...p, ...payload } : p))
      );

      return { previous };
    },
    onError: (err, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(productKeys.lists(), context.previous);
      }
      toast.error('Gagal memperbarui produk. Perubahan dibatalkan.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};
```

---

## 6. QA, Testing, & CI/CD Pipeline

**Vitest 4.x Granularity (wajib):**
- **Custom Hooks** — test state logic & mutation TanStack Query (`renderHook`), termasuk skenario `onError`/rollback pada optimistic update.
- **Zod Schemas** — test boundary values dan pesan error (perhatikan format error Zod v4 sedikit berbeda dari v3 — cek `error.issues` bukan `error.errors` jika memakai API terbaru).
- **Utils/Helpers** — target 100% coverage untuk pure functions.
- **Threshold global**: minimum 80% coverage untuk `hooks/` dan `lib/`; komponen UI presentational cukup dicover Playwright.

**Playwright 1.58.x:** wajib untuk rendering komponen UI kritikal dan full functional E2E flow (Auth login/logout/refresh-expired, CRUD dengan optimistic update, proteksi route dashboard via `proxy.ts` + Server Component layer).

**CI/CD Pipeline (GitHub Actions):** setiap PR ke `main` wajib lolos urutan berikut:
1. `npm run lint` (ESLint & Prettier)
2. `npm run typecheck` (`tsc --noEmit`)
3. `npm run test:unit` (Vitest, dengan coverage gate)
4. `npm run build` (Next.js 16 build test — pastikan CI runner pakai Node.js 22.x/24.x)
5. `npm run test:e2e` (Playwright, dijalankan terhadap preview build)

---

## 7. Execution Protocol

Setiap kali membuat fitur baru:

1. Definisikan Zod v4 schema dan TypeScript types di `features/[name]/types/`.
2. Buat `features/[name]/api/query-keys.ts` **terlebih dahulu**.
3. Buat server-side fetcher (native `fetch`) dan client-side TanStack hooks (Axios) di `features/[name]/api/`, memakai key yang sama dari `query-keys.ts`.
4. Bangun komponen UI di `features/[name]/components/`, sertakan `aria-label` yang sesuai.
5. Wire komponen ke page di `src/app/[lang]/...` menggunakan `getQueryClient()` + `<HydrationBoundary>`.
6. Jika fitur butuh proteksi auth, pastikan `proxy.ts` (thin check) **dan** `verify-session.ts` (validasi otoritatif via `jose` di layout Server Component) keduanya terpasang — jangan andalkan salah satu saja.
7. Jika fitur melibatkan mutasi dengan optimistic UI, ikuti blueprint `onMutate`/`onError`/`onSettled` di Bagian 5.
8. Generate Vitest (hooks, schema) dan Playwright test (E2E flow) sesuai target granularity di Bagian 6.

---

## 8. Upgrade Notes untuk Project Existing

Jika PRD versi sebelumnya (v4, yang masih memakai `middleware.ts` + Next.js 14/15) sudah diimplementasikan sebagian, urutan migrasi yang aman:

1. `npm install next@16 react@19 react-dom@19` lalu jalankan `npx @next/codemod@canary upgrade latest`.
2. Jalankan `npx @next/codemod@latest rename-middleware-to-proxy .` untuk migrasi file dan named export.
3. **Pisahkan logika**: pindahkan semua validasi JWT/DB call yang sebelumnya ada di `middleware.ts` ke `verify-session.ts` + layout Server Component, sisakan hanya pengecekan keberadaan cookie di `proxy.ts` yang baru.
4. Update `tailwindcss` ke v4.3.x dan migrasikan `tailwind.config.js` ke pendekatan CSS-first jika project masih di v3.
5. Update `zod` ke v4 dan jalankan test suite Vitest — perhatikan breaking changes pada custom error map dan beberapa nama method validator.
6. Jalankan full test suite (Vitest + Playwright) sebelum merge, khususnya E2E flow login/logout untuk mendeteksi regresi "logout loop" pasca migrasi proxy.