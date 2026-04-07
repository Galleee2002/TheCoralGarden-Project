# TheCoralGarden — Codex Rules

## Stack
- Next.js 16 App Router, TypeScript strict mode
- Tailwind CSS v4 + Shadcn/UI (new-york style, lucide icons)
- Prisma v7 + Supabase (PostgreSQL)
- Zustand v5 (cliente), React Query v5 (servidor)
- MercadoPago v2, next-safe-action v8, Zod v4
- Framer Motion v12 (animaciones en SpecialtiesSection)

## Arquitectura: Feature-First + Clean Layers
- `src/features/<name>/components|hooks|actions|types/`
- Server Actions con next-safe-action en `src/lib/safe-action.ts`
- UI compartida: `src/components/shared/` · Layout: `src/components/layout/`
- DB solo via `src/lib/prisma/client.ts`

## Convenciones de código
- TypeScript estricto — nunca `any` excepto `src/lib/zod-resolver.ts`
- Server Components por defecto, `"use client"` solo cuando sea necesario
- Formularios: react-hook-form + zod resolver desde `@/lib/zod-resolver` (NO `@hookform/resolvers/zod`)
- Enums: importar desde `@/types/enums` (no `@prisma/client`) para uso cliente/shared
- Next.js 16: `await searchParams` / `await params` en páginas dinámicas

## Páginas del sitio
| Sección              | Feature                        | Ruta                              |
|----------------------|--------------------------------|-----------------------------------|
| Inicio               | `features/home`                | `/`                               |
| Productos            | `features/products`            | `/productos`                      |
| Detalle Producto     | `features/products`            | `/productos/[slug]`               |
| Servicio Técnico     | `features/technical-service`   | `/servicio-tecnico`               |
| Sobre Nosotros       | `features/about`               | `/sobre-nosotros`                 |
| Carrito              | `features/cart`                | `/carrito`                        |
| Checkout             | `features/checkout`            | `/checkout`                       |
| Admin Dashboard      | `features/admin`               | `/admin`                          |
| Admin Login          | `features/admin`               | `/admin/login`                    |
| Admin Órdenes        | `features/admin`               | `/admin/ordenes`                  |
| Admin Productos      | `features/admin`               | `/admin/productos`                |
| Admin Categorías     | `features/admin`               | `/admin/categorias`               |
| Admin Configuración  | `features/admin`               | `/admin/configuracion`            |

## Páginas — estructura de componentes

### `/sobre-nosotros`
`AboutHero` (grid 2 cols: foto `/DUEÑOS.png` + historia) → `SpecialtiesSection` (accordion horizontal desktop / stacked mobile, framer-motion) → `BrandsCarousel` → `MiniBanner`
> **Eliminados:** `MissionVision.tsx`, `WhyChooseUs.tsx`

### `/servicio-tecnico`
`TechnicalServiceHero` → `AttentionSection` ("365 días", cards con `CheckCircle2`) → `ContactCards` (WhatsApp + Gmail, usa `/whatsapp-icon.svg` y `/gmail-icon.svg`) → `MiniBanner`
> Navbar transparente en hero, igual que `/`

### `/productos`
Header con H1 + `SearchBar` (`?q=`, `bg-card-light`) → filter chips → grid `sm:grid-cols-2 lg:grid-cols-4` (pageSize 16) → `ProductsPagination` → `MiniBanner`

### `/productos/[slug]`
Breadcrumb → grid 2 cols: `ProductGallery` (aspect-[4/3], max 3 thumbnails) | `ProductInfo` (cart + `useFavoritesStore` + toast) → Relacionados (4 misma categoría) → `MiniBanner`

## Admin — layout y navegación
- **Desktop**: sidebar `w-64` con `AdminSidebarNav` (active link: `border-l-2 border-text-secondary`)
- **Mobile**: header con hamburger → `AdminMobileNav` (Sheet drawer) usando `AdminSidebarNav` internamente
- **`AdminPageHeader`** (`src/components/shared/`): header estándar para páginas admin (title, description?, action?)
- Sidebar tiene logout (`/api/auth/logout`) y link "Ver sitio" (nueva pestaña)
- **Shared UI admin:** `ConfirmDialog`, `EmptyState`, `StatusBadge` en `src/components/shared/`
- **Componentes admin por subfolder:** `categories/`, `orders/`, `products/`, `settings/` dentro de `src/features/admin/components/`
- **ProductForm** refactorizado en tabs: `ProductFormTabs` + `ProductTabBasic`, `ProductTabPricing`, `ProductTabSpecs`, `ProductTabMedia`

## Frontend — convenciones clave

### Navbar
- Con hero (`/` y `/servicio-tecnico`): transparente → `bg-bg-secondary` al `scrollY > 50`
- Sin hero: siempre `bg-bg-secondary`
- Logo: `isTransparent ? "/LOGO.svg" : "/logo-fade.svg"`

### ProductCard
- Server Component — sin `"use client"`, sin `useCartStore`
- CTA: "Ver más →" con `ChevronRight`, `bg-btn-primary text-text-secondary`
- Props: `description?: string` (line-clamp-2) — sin prop `category`

### Favoritos — `src/features/favorites/store/favoritesStore.ts`
- Zustand persist, clave `coral-garden-favorites`
- `FavoriteItem`: `{ productId, name, price, image, slug }`
- Métodos: `toggleFavorite(item)`, `isFavorite(productId)`

## Paleta de colores — Design Tokens (`src/app/globals.css`)
Paleta: `#042F34` · `#111C24` · `#33C2E9` · `#74E4BB` · `#D6E5E9` · `#F8F8F8`

| Variable CSS         | Color     | Uso                                          |
|----------------------|-----------|----------------------------------------------|
| `--bg-primary`       | `#F8F8F8` | Fondo principal                              |
| `--bg-secondary`     | `#042F34` | Navbar, footer, secciones oscuras            |
| `--text-primary`     | `#111C24` | Texto sobre fondo claro                      |
| `--text-secondary`   | `#74E4BB` | Acento / highlights                          |
| `--btn-primary`      | `#042F34` | Botón primario                               |
| `--btn-primary-hover`| `#063B41` | Hover botón primario                         |
| `--btn-outline/secondary` | `#74E4BB` | Outline y botón secundario             |
| `--card-default`     | `#F8F8F8` | Tarjetas estándar                            |
| `--card-dark`        | `#042F34` | Card oscura                                  |
| `--card-blue`        | `#33C2E9` | Card azul cielo                              |
| `--card-light`       | `#D6E5E9` | Fondos de sección, SearchBar                 |

Tokens `@theme inline` → clases Tailwind: `bg-bg-secondary`, `bg-card-dark`, `bg-btn-primary`, etc.

**Shadcn tokens:** `--background`→`#F8F8F8` · `--foreground`→`#111C24` · `--primary`→`#042F34` · `--accent`→`#74E4BB` · `--secondary`→`#D6E5E9` · `--sidebar`→`#042F34`

### Tipografías
- **Le Havre** (900/700) → `font-heading` — headings (`src/app/fonts/`)
- **Montserrat** (500/700) → `font-sans` / `font-body` — body (Google Fonts)

| Elemento | Desktop (`md:`) |
|---|---|
| H1 banners | `text-[96px]` |
| H2 secciones | `text-[64px]` |
| H1 descripción | `text-2xl` |
| Nombre producto | `text-3xl` |

**Radius:** `rounded-card` (15px) · `rounded-button` (6px) · `rounded-dropdown` (5px)
**Spacing:** `py-section` (64px) · `py-section-mobile` (40px) · `gap-card-gap-mobile` (40px)

## Backend / DB
- Mutaciones de DB via Prisma (`src/lib/prisma/client.ts`)
- Auth: Supabase Auth (solo admin — sin cuentas de clientes)
- Checkout guest: datos del cliente en la Order
- RLS habilitado en todas las tablas
- **Prisma v7:** datasource en `prisma.config.ts` (NO en schema); `PrismaClient` sin `datasourceUrl`
- Migrar: `pnpm prisma migrate dev --name <nombre>` | Generar: `pnpm prisma generate`

### Migraciones con puerto DB bloqueado (5432/6543)
1. SQL via `mcp__supabase__apply_migration`
2. Crear `prisma/migrations/<timestamp>_<nombre>/migration.sql`
3. Registrar en `_prisma_migrations` via `mcp__supabase__execute_sql`
4. `pnpm prisma generate`

## Imágenes — Cloudinary
- `next-cloudinary` + `CldUploadWidget` (upload preset público)
- `src/components/shared/ImageUploader.tsx` — imagen única
- `src/components/shared/MultiImageUploader.tsx` — múltiples imágenes
- Env: `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` + `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

## SiteSetting — Configuración del sitio
- Tabla key-value en Prisma. Claves: `hero_banner_url`, `about_gallery_1/2/3`, `service_venta_image`, `service_postventa_image`, `service_reparacion_image`
- Actions: `getSetting(key)` / `upsertSetting({key, value})` en `src/features/admin/actions/settingActions.ts`
- UI: `SettingImageCard.tsx` en `src/features/admin/components/settings/`

## Pagos — MercadoPago
- Flujo: `createOrder` → `createMercadoPagoPreference` → redirect MP Checkout Pro
- Webhook: `src/app/api/webhooks/mp/route.ts`
- Env: `MERCADOPAGO_ACCESS_TOKEN`, `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`, `NEXT_PUBLIC_BASE_URL`

## Protección de rutas admin
- `src/middleware.ts` → redirige a `/admin/login` sin sesión, redirige a `/admin` si ya autenticado

## Estado del proyecto
- **Backend: COMPLETADO** — 5 modelos Prisma (TechnicalServiceRequest eliminado), 1 enum, 18+ Server Actions, webhook MP, auth middleware
- **`/productos` + `[slug]`: COMPLETADO** — SearchBar, paginación, galería, favoritos, carrito
- **`/sobre-nosotros`: COMPLETADO** — AboutHero + SpecialtiesSection (framer-motion accordion)
- **`/servicio-tecnico`: COMPLETADO** — Hero + AttentionSection + ContactCards (sin gestión admin)
- **Admin: COMPLETADO** — Sidebar responsive, active links, AdminMobileNav, AdminPageHeader, `/admin/categorias`, ProductForm con tabs
- **Imágenes: COMPLETADO** — Cloudinary, ImageUploader, MultiImageUploader
- **Deploy: PREPARADO** — `.env.example` creado, checklist en `PLAN.md`
- **Pendiente real:** Reemplazar número WhatsApp placeholder (`5491100000000`) en `WhatsAppButton.tsx` y en `ContactCards.tsx`

## Deploy — Variables de entorno

Template en `.env.example`. Todas las variables requeridas para producción:

| Variable | Tipo | Fuente |
|---|---|---|
| `DATABASE_URL` | Server | Supabase → Settings → Database (pooler, puerto 6543) |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase → Settings → API |
| `MERCADOPAGO_ACCESS_TOKEN` | Server secret | MP Developer Panel |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Public | MP Developer Panel |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Public | Cloudinary Console |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Public | Cloudinary → Settings → Upload presets |
| `NEXT_PUBLIC_BASE_URL` | Public | URL del sitio en producción |

### Notas Vercel + Prisma
- `DATABASE_URL` debe usar el **pooler** de Supabase (puerto 6543) con `?pgbouncer=true&connection_limit=1` para funcionar en serverless
- Webhook MP: registrar `https://[dominio]/api/webhooks/mp` en el panel de MercadoPago con evento `payment.updated`
