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

## Frontend
- Componentes usan primitivas de shadcn, extendidas con Tailwind
- Botón flotante de WhatsApp en todas las páginas (`WhatsAppButton.tsx`)
- CartDrawer accesible desde el Navbar en todas las páginas

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

> **Tipografías, espaciados y border-radius**: aún por definir.

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

## Pagos con MercadoPago
- Flujo: `createOrder` → `createMercadoPagoPreference` → redirect a MP Checkout Pro
- Webhook en `src/app/api/webhooks/mp/route.ts` actualiza `Order.status`
- Variables de entorno: `MERCADOPAGO_ACCESS_TOKEN`, `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
- Variable de entorno: `NEXT_PUBLIC_BASE_URL` para las back_urls de MP

## Protección de rutas admin
- `src/middleware.ts` protege todas las rutas `/admin/*`
- Redirige a `/admin/login` si no hay sesión de Supabase
- Redirige a `/admin` si ya hay sesión e intenta ir al login
