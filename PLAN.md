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

### 🚀 Deploy
- [ ] Configurar variables de entorno en producción (Vercel u hosting elegido)
- [ ] Setear `NEXT_PUBLIC_BASE_URL` real para webhook de MercadoPago
- [ ] Credenciales MP reales (`MERCADOPAGO_ACCESS_TOKEN`, `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`)
- [ ] Probar flujo completo de checkout con MP en staging

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
