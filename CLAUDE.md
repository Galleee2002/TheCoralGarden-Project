# TheCoralGarden — Claude Code Rules

## Stack
- Next.js 16 App Router, TypeScript strict mode
- Tailwind CSS v4 + Shadcn/UI (new-york style, lucide icons)
- Prisma v7 + Supabase (PostgreSQL)
- Zustand v5 para estado cliente, React Query v5 para servidor
- MercadoPago v2 para pagos
- next-safe-action v8 para Server Actions
- Zod v4 para validaciones

## Arquitectura: Feature-First + Clean Layers
- Cada feature vive en `src/features/<name>/`
- Dentro de cada feature: `components/`, `hooks/`, `actions/`, `types/`
- Server Actions en `actions/` usando next-safe-action (`src/lib/safe-action.ts`)
- UI compartida en `src/components/`
- Layout global en `src/components/layout/`
- Componentes compartidos en `src/components/shared/`
- Acceso a DB solo a través de `src/lib/prisma/client.ts`

## Convenciones de código
- TypeScript con tipos estrictos
- Nunca usar `any` excepto en `src/lib/zod-resolver.ts` (workaround Zod v4.3 + hookform)
- Schemas Zod para todas las validaciones
- Server Components por defecto, `"use client"` solo cuando sea necesario
- Todos los formularios usan react-hook-form + zod resolver
- Para el resolver importar desde `@/lib/zod-resolver` (NO desde `@hookform/resolvers/zod` directamente)
- Manejo de errores con tipos, nunca throw strings crudas
- Enums de Prisma: importar desde `@/types/enums` para uso en cliente/shared code

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
| Admin Servicio Téc.  | `features/admin`               | `/admin/servicio-tecnico`         |
| Admin Configuración  | `features/admin`               | `/admin/configuracion`            |

## Frontend
- Componentes usan primitivas de shadcn, extendidas con Tailwind
- Botón flotante de WhatsApp en todas las páginas (`WhatsAppButton.tsx`)
- CartDrawer accesible desde el Navbar en todas las páginas

## Navbar — comportamiento de transparencia
- **Páginas con hero banner** (`/` y `/servicio-tecnico`): Navbar transparente al top, se vuelve `bg-bg-secondary` al hacer scroll (`scrollY > 50`)
- **Resto de páginas**: siempre `bg-bg-secondary` (`#042F34`), nunca transparente
- Logo: `isTransparent ? "/LOGO.svg" : "/logo-fade.svg"` — en dark bg usa `logo-fade.svg`
- Links e íconos: siempre `text-white/90 hover:text-white` y `hover:bg-white/10` (el bg ya es oscuro en ambos estados)
- Mobile menu: siempre `bg-bg-secondary/95 backdrop-blur`

## ProductCard — convenciones
- CTA: solo "Ver más →" (`ChevronRight`) — sin botón de carrito en la lista
- Prop `description?: string` — se muestra con `line-clamp-2`
- NO tiene prop `category` (se eliminó)
- Es un Server Component (sin `"use client"`, sin `useCartStore`)
- Estilos: `rounded-card`, `border border-border/30`, CTA con `bg-btn-primary text-text-secondary`

## Página `/productos` — layout
- H1 "PRODUCTOS" en `font-heading` (96px desktop / 56px mobile), a la izquierda
- `SearchBar` a la derecha del H1 — filtra con `?q=` al presionar Enter, `bg-card-light`
- Filter chips horizontales (`flex flex-wrap gap-2`, `rounded-full`) debajo del header
- Grid 4 columnas: `sm:grid-cols-2 lg:grid-cols-4`, `pageSize: 16`
- `ProductsPagination` (shadcn `<Pagination>`) al final del grid, preserva todos los params
- `MiniBanner` al final de la página (antes del footer)
- Componentes nuevos: `SearchBar.tsx`, `ProductsPagination.tsx` en `src/features/products/components/`

## Paleta de colores — Design Tokens (`src/app/globals.css`)

Paleta completa: `#042F34` `#111C24` `#33C2E9` `#74E4BB` `#D6E5E9` `#F8F8F8`

### Variables de marca (custom, disponibles como utilidades Tailwind)
| Variable CSS         | Color     | Uso                                          |
|----------------------|-----------|----------------------------------------------|
| `--bg-primary`       | `#F8F8F8` | Fondo principal de páginas                   |
| `--bg-secondary`     | `#042F34` | Navbar, footer, secciones oscuras, banners   |
| `--text-primary`     | `#111C24` | Texto de cuerpo y títulos sobre fondo claro  |
| `--text-secondary`   | `#74E4BB` | Texto de acento / highlights                 |
| `--btn-primary`      | `#042F34` | Botón primario (ej: "Comprar ahora")         |
| `--btn-primary-hover`| `#063B41` | Hover del botón primario                     |
| `--btn-outline`      | `#74E4BB` | Borde de botones outline (ej: "Ver más")     |
| `--btn-secondary`    | `#74E4BB` | Botón secundario sólido sin outline          |
| `--btn-disabled`     | `#82979A` | Estado deshabilitado                         |
| `--btn-destructive`  | `#DC2626` | Acciones destructivas                        |
| `--btn-focus`        | `#A1A1AA` | Ring de foco                                 |
| `--card-default`     | `#F8F8F8` | Tarjetas de producto (estándar)              |
| `--card-dark`        | `#042F34` | Card variant 1 — oscura                      |
| `--card-blue`        | `#33C2E9` | Card variant 2 — azul cielo                  |
| `--card-light`       | `#D6E5E9` | Fondos de sección (ej: Productos Relacionados)|

### Uso en Tailwind
```tsx
// Las variables están mapeadas en @theme inline → disponibles como utilidades
<div className="bg-bg-secondary text-text-secondary" />
<div className="bg-card-dark" />
<div className="bg-card-blue" />
<button className="bg-btn-primary" />
// También se puede usar var() directamente
<div className="bg-[var(--card-light)]" />
```

### Tokens semánticos de Shadcn mapeados a la marca
| Token Shadcn     | → Variable de marca     |
|------------------|-------------------------|
| `--background`   | `#F8F8F8` (bg-primary)  |
| `--foreground`   | `#111C24` (text-primary)|
| `--primary`      | `#042F34` (btn-primary) |
| `--accent`       | `#74E4BB` (btn-outline) |
| `--secondary`    | `#D6E5E9` (card-light)  |
| `--destructive`  | `#DC2626`               |
| `--ring`         | `#A1A1AA` (btn-focus)   |
| `--sidebar`      | `#042F34` (bg-secondary)|

### Tipografías
| Fuente       | Pesos           | Uso                        | Carga              |
|--------------|-----------------|----------------------------|--------------------|
| Le Havre     | Black 900, Bold 700 | Encabezados y títulos  | `next/font/local` — archivos en `src/app/fonts/` |
| Montserrat   | Medium 500, Bold 700 | Body                  | `next/font/google` |

Variables CSS disponibles como utilidades Tailwind:
- `font-heading` → Le Havre (`--font-le-havre`)
- `font-sans` / `font-body` → Montserrat (`--font-montserrat`)

> Archivos ya ubicados en `src/app/fonts/LeHavre-Black.otf` y `src/app/fonts/LeHavre-Bold.otf`.

### Tamaños tipográficos (desktop/tablet — `md:`)
| Elemento | Tamaño | Clase Tailwind |
|---|---|---|
| H1 de banners (HeroSection, TechnicalServiceHero, AboutHero) | 96px | `md:text-[96px]` |
| Descripción bajo H1 | 24px | `md:text-2xl` |
| H2 de secciones (AboutSection, FeaturedProducts, ServicesSection, FAQSection) | 64px | `md:text-[64px]` |
| Descripción bajo H2 | 16px | `text-base` |
| Nombre de producto (cards y detalle) | 30px | `md:text-3xl` |
| Descripción de producto (cards y detalle) | 16px | `text-base` |

> Mobile usa tamaños menores (clases sin prefijo responsive). Desktop/tablet = `md:` en adelante.

### Border Radius
| Variable CSS         | Valor  | Uso                              | Utilidad Tailwind    |
|----------------------|--------|----------------------------------|----------------------|
| `--radius-card`      | `15px` | Tarjetas de producto             | `rounded-card` / `rounded-lg` |
| `--radius-button`    | `6px`  | Botones                          | `rounded-button` / `rounded-md` |
| `--radius-dropdown`  | `5px`  | Desplegables, FAQ, tooltips      | `rounded-dropdown` / `rounded-sm` |

### Espaciados
| Variable CSS                | Valor  | Uso                                          | Utilidad Tailwind          |
|-----------------------------|--------|----------------------------------------------|----------------------------|
| `--section-spacing`         | `64px` | Padding vertical de secciones — desktop/tablet | `py-section`             |
| `--section-spacing-mobile`  | `40px` | Padding vertical de secciones — mobile        | `py-section-mobile`        |
| `--card-gap-mobile`         | `40px` | Gap entre product cards — mobile (columna)   | `gap-card-gap-mobile`      |

> Desktop/tablet: gap entre cards manejado por el grid (`auto`).

## Backend / DB
- Todas las mutaciones de DB van a través de Prisma
- Auth manejado por Supabase Auth (solo admin — no hay cuentas de clientes)
- Checkout es guest: datos del cliente guardados en la Order, sin registro
- RLS (Row Level Security) habilitado en todas las tablas de Supabase
- Prisma v7: configuración de datasource en `prisma.config.ts`, NO en `schema.prisma`
- `PrismaClient` en v7 NO acepta `datasourceUrl` como argumento

## Configuración crítica de Prisma v7
- La URL de conexión va en `prisma.config.ts` (ya configurado)
- El bloque `datasource db` en `schema.prisma` solo lleva `provider`
- Para generar tipos: `pnpm prisma generate`
- Para migrar: `pnpm prisma migrate dev --name <nombre>`

## Migraciones cuando el puerto DB está bloqueado
Si la red bloquea los puertos 5432/6543 (`prisma migrate dev` se congela), usar este flujo alternativo:
1. Aplicar el SQL directamente via `mcp__supabase__apply_migration`
2. Crear `prisma/migrations/<timestamp>_<nombre>/migration.sql` manualmente
3. Registrar en `_prisma_migrations` via `mcp__supabase__execute_sql`
4. Correr `pnpm prisma generate` localmente

## Imágenes — Cloudinary
- Proveedor de imágenes: **Cloudinary** vía `next-cloudinary`
- Upload desde admin usando `CldUploadWidget` con upload preset público
- Componentes de upload en `src/components/shared/`:
  - `ImageUploader.tsx` — sube una sola imagen, devuelve la URL via `onUpload`
  - `MultiImageUploader.tsx` — sube múltiples imágenes (ej: galería de productos)
- Variable de entorno: `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- Variable de entorno: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (requerida por `next-cloudinary`)
- Las URLs de Cloudinary (`res.cloudinary.com`) están whitelisted en `next.config.ts`
- Supabase Storage ya NO se usa para imágenes (reemplazado por Cloudinary)

## Pagos con MercadoPago
- Flujo: `createOrder` → `createMercadoPagoPreference` → redirect a MP Checkout Pro
- Webhook en `src/app/api/webhooks/mp/route.ts` actualiza `Order.status`
- Variables de entorno: `MERCADOPAGO_ACCESS_TOKEN`, `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
- Variable de entorno: `NEXT_PUBLIC_BASE_URL` para las back_urls de MP

## Protección de rutas admin
- `src/middleware.ts` protege todas las rutas `/admin/*`
- Redirige a `/admin/login` si no hay sesión de Supabase
- Redirige a `/admin` si ya hay sesión e intenta ir al login

## SiteSetting — Configuración del sitio
- Modelo `SiteSetting` en Prisma: tabla key-value para ajustes globales del sitio
- Claves usadas:
  - `hero_banner_url` — imagen del hero principal
  - `about_gallery_1/2/3` — galería de fotos de la sección Sobre Nosotros
  - `service_venta_image`, `service_postventa_image`, `service_reparacion_image` — imágenes de tarjetas de servicios
- Acciones: `getSetting(key)` y `upsertSetting({ key, value })` en `src/features/admin/actions/settingActions.ts`
- UI admin: `HeroBannerForm.tsx`, `SettingImageForm.tsx` — usan `ImageUploader` internamente
- Página admin: `/admin/configuracion` — gestión visual de todas las imágenes del sitio

## Category — imágenes
- Campo `imageUrl` (opcional) en modelo `Category`
- `CategoryForm.tsx` incluye `ImageUploader` para asignar imagen a categoría

## Estado del proyecto
- **Backend: COMPLETADO** — Schema Prisma (6 modelos: Category, Product, Order, OrderItem, TechnicalServiceRequest, SiteSetting; 3 enums), migración aplicada, 18+ Server Actions (products, checkout, admin CRUD, settings), webhook MP, auth middleware, Supabase clients, cart store Zustand
- **Frontend: EN PROGRESO** — Todas las páginas listadas en la tabla tienen sus componentes implementados (ver `src/features/*/components/`)
- **Página Productos: COMPLETADO** — diseño desktop con Navbar oscuro, H1 + SearchBar, chips de filtro horizontales, grid 4 columnas, paginación shadcn, MiniBanner al final
- **Imágenes: COMPLETADO** — Cloudinary integrado (`next-cloudinary`), `ImageUploader` y `MultiImageUploader` disponibles para admin
- **Admin Configuración: COMPLETADO** — `/admin/configuracion` permite gestionar todas las imágenes globales del sitio vía Cloudinary
