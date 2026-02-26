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
- **Paleta de colores, tipografías, espaciados y border-radius AÚN NO ESTÁN DEFINIDOS**
- Los tokens de diseño se determinarán a partir de los wireframes del cliente
- Hasta entonces NO asumir ni inventar valores; esperar confirmación antes de definirlos en `src/app/globals.css`
- Botón flotante de WhatsApp en todas las páginas (`WhatsAppButton.tsx`)
- CartDrawer accesible desde el Navbar en todas las páginas

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
