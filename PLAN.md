# TheCoralGarden — Plan de Trabajo

---

## Estado General — TODO COMPLETADO

### ✅ Backend
- 5 modelos Prisma, 18+ Server Actions, webhook MP, auth middleware

### ✅ Páginas públicas
- **`/`** — HeroSection, AboutSection, BrandsCarousel, ServicesSection, FeaturedProducts, FAQSection, MiniBanner
- **`/productos`** — SearchBar, filter chips, grid 4 cols, paginación, MiniBanner
- **`/productos/[slug]`** — ProductGallery, ProductInfo (cart + favoritos), Related, MiniBanner
- **`/sobre-nosotros`** — AboutHero, SpecialtiesSection (framer-motion), BrandsCarousel, MiniBanner
- **`/servicio-tecnico`** — Hero, AttentionSection, ContactCards, MiniBanner
- **`/carrito`** — CartPage client component, useCartStore
- **`/checkout`** — CheckoutForm, pages success/failure/pending

### ✅ Admin
- **`/admin`** — Dashboard con stats (órdenes, ingresos, productos activos)
- **`/admin/login`** — Supabase auth
- **`/admin/ordenes`** — Tabla + updateOrderStatus
- **`/admin/productos`** — CRUD completo, ProductForm con tabs
- **`/admin/categorias`** — CRUD completo
- **`/admin/configuracion`** — HeroBanner + galería about + imágenes servicios

### ✅ Infraestructura
- Cloudinary (ImageUploader, MultiImageUploader)
- Favoritos (Zustand persist)
- Navbar transparente en `/` y `/servicio-tecnico`

---

## Pendiente

### 🔧 Fix urgente
- [ ] Reemplazar placeholder WhatsApp (`5491100000000`) en `WhatsAppButton.tsx` y `ContactCards.tsx`

### 🚀 Deploy — Checklist Vercel

#### Pre-deploy (local)
- [x] `.env.example` creado con todas las variables requeridas
- [ ] `pnpm build` pasa sin errores en local

#### Variables de entorno en Vercel Dashboard
Ir a: Project → Settings → Environment Variables

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Supabase pooler URL (puerto 6543, `?pgbouncer=true&connection_limit=1`) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key de Supabase |
| `MERCADOPAGO_ACCESS_TOKEN` | Access token **de producción** de MP |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Public key **de producción** de MP |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Nombre del cloud en Cloudinary |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Upload preset público de Cloudinary |
| `NEXT_PUBLIC_BASE_URL` | URL real del sitio (ej: `https://thecoralgardenok.vercel.app`) |

#### MercadoPago — Webhook
- [ ] En panel MP, registrar webhook: `https://[dominio]/api/webhooks/mp`
- [ ] Seleccionar evento: `payment` → `payment.updated`

#### Post-deploy
- [ ] Verificar que el admin login funciona (`/admin/login`)
- [ ] Verificar subida de imágenes con Cloudinary
- [ ] Probar flujo completo de checkout con MP en producción
- [ ] Reemplazar número WhatsApp placeholder

---

## Referencia Rápida — Patrones

### Page.tsx (Server Component)
```tsx
export default async function Page({ searchParams }: { searchParams: Promise<{...}> }) {
  const params = await searchParams; // SIEMPRE await en Next.js 16
  return <main>...</main>;
}
```

### Formulario (Client Component)
```tsx
"use client";
import { zodResolver } from "@/lib/zod-resolver"; // NO @hookform/resolvers/zod
import { useAction } from "next-safe-action/hooks";
// react-hook-form + useAction + toast onSuccess/onError
```

### Enums
```tsx
import { OrderStatus } from "@/types/enums"; // NO @prisma/client
```

### Migraciones con puerto DB bloqueado
1. SQL via `mcp__supabase__apply_migration`
2. Crear `prisma/migrations/<timestamp>_<nombre>/migration.sql`
3. Registrar en `_prisma_migrations` via `mcp__supabase__execute_sql`
4. `pnpm prisma generate`

---

## Comandos
```bash
pnpm dev                                 # Dev server
pnpm prisma migrate dev --name <nombre>  # Migración
pnpm prisma generate                     # Regenerar tipos
pnpm build                               # Build producción
```
