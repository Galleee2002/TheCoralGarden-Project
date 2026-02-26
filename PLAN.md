# TheCoralGarden — Plan de Trabajo por Página

Flujo completo desde wireframe hasta página funcional y deployada.
Separado por capa: **Backend** primero (siempre), luego **Frontend**.

---

## 0. Punto de Partida: El Wireframe

**Lo que vos me pasás:**
- Screenshot, imagen, PDF o descripción textual de la sección/página
- Contexto: ¿qué hace el usuario acá? ¿qué datos muestra? ¿qué acciones realiza?

**Lo que yo hago antes de tocar código:**
1. Leo el wireframe y descompongo la página en secciones/componentes
2. Identifico qué datos necesita (¿viene de la DB? ¿del carrito? ¿es estático?)
3. Identifico si hay mutaciones (formularios, botones de acción)
4. Pregunto lo que no está claro antes de arrancar

**Preguntas típicas que puedo hacer:**
- ¿El contenido de esta sección es estático (hardcodeado) o dinámico (viene de la DB)?
- ¿Este formulario guarda datos? ¿En qué tabla?
- ¿Hay lógica de negocio no obvia (descuentos, validaciones especiales)?
- ¿Hay variantes mobile/desktop distintas al wireframe?

---

## 1. Backend

Todo lo que involucra DB, lógica de servidor y validaciones.
**Siempre se hace antes que el frontend** para que los componentes ya tengan datos reales.

### 1.1 Schema de Prisma (si aplica)

Aplica cuando la página requiere un modelo nuevo o cambio a uno existente.

**Archivos involucrados:**
- `prisma/schema.prisma` — agregar/modificar modelos y enums
- `prisma.config.ts` — no tocar (ya configurado)

**Pasos:**
1. Agregar el modelo o campo nuevo en `schema.prisma`
2. Ejecutar `pnpm prisma migrate dev --name <nombre-descriptivo>`
3. Ejecutar `pnpm prisma generate` para regenerar los tipos
4. Actualizar `src/types/enums.ts` si se agregaron nuevos enums de Prisma

**Ejemplo — agregar campo `weight` a `Product`:**
```prisma
// prisma/schema.prisma
model Product {
  // ...campos existentes
  weight Float? // gramos, opcional
}
```
```bash
pnpm prisma migrate dev --name add-product-weight
pnpm prisma generate
```

**Convenciones:**
- Nombres de modelos en PascalCase singular (`Product`, no `Products`)
- Enums en SCREAMING_SNAKE_CASE
- El bloque `datasource db` solo tiene `provider = "postgresql"` (no URL)

---

### 1.2 Server Actions de Lectura

Para traer datos que se muestran en la página.

**Ubicación:** `src/features/<feature>/actions/<actionName>.ts`

**Patrón estándar:**
```ts
// src/features/products/actions/getProducts.ts
"use server";

import { action } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma/client";
import { z } from "zod";

const schema = z.object({
  categorySlug: z.string().optional(),
  page: z.number().int().min(1).default(1),
});

export const getProducts = action
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const products = await prisma.product.findMany({
      where: {
        active: true,
        ...(parsedInput.categorySlug && {
          category: { slug: parsedInput.categorySlug },
        }),
      },
      include: { category: true },
    });
    return { products };
  });
```

**Checklist:**
- [ ] `"use server"` al inicio
- [ ] Schema Zod para todos los inputs
- [ ] Usar `action` de `@/lib/safe-action`
- [ ] Acceso a DB solo a través de `@/lib/prisma/client`
- [ ] Retornar objeto con nombre descriptivo (no retornar el array directamente)

---

### 1.3 Server Actions de Mutación

Para formularios y acciones que modifican datos.

**Patrón estándar:**
```ts
// src/features/technical-service/actions/createTechnicalServiceRequest.ts
"use server";

import { action } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma/client";
import { z } from "zod";
import { TechnicalServiceUseCase } from "@/types/enums";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  equipmentBrand: z.string().min(1),
  useCase: z.nativeEnum(TechnicalServiceUseCase),
  issueDescription: z.string().min(10),
});

export const createTechnicalServiceRequest = action
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const request = await prisma.technicalServiceRequest.create({
      data: parsedInput,
    });
    return { id: request.id };
  });
```

**Checklist:**
- [ ] Validar todo con Zod antes de tocar la DB
- [ ] Enums de Prisma: importar desde `@/types/enums` (no desde `@prisma/client`)
- [ ] Errores tipados, nunca `throw "string"`
- [ ] Para rutas admin: verificar sesión antes de mutar

---

### 1.4 API Routes (solo cuando es necesario)

Solo para webhooks, endpoints que consume código externo, o cuando next-safe-action no alcanza.

**Ubicación:** `src/app/api/<ruta>/route.ts`

**Casos en este proyecto:**
- `src/app/api/webhooks/mp/route.ts` — webhook de MercadoPago (ya implementado)
- `src/app/api/auth/logout/route.ts` — logout admin (ya implementado)

**No usar** para data fetching interno — para eso están los Server Actions.

---

### 1.5 Protección de Rutas Admin

Si la página es del panel admin, verificar que el middleware la cubra.

```ts
// src/middleware.ts — ya configurado, protege /admin/*
// Solo agregar excepciones si fuera necesario (raro)
```

---

## 2. Frontend

Todo lo que el usuario ve y con lo que interactúa.

### 2.1 Estructura de Archivos

Para cada página nueva:

```
src/
  app/
    <ruta>/
      page.tsx          ← Server Component, orquesta la página
      loading.tsx       ← (opcional) Skeleton mientras carga
      error.tsx         ← (opcional) UI de error
  features/
    <feature>/
      components/
        NombreSeccion.tsx  ← Un componente por sección del wireframe
      hooks/
        useNombre.ts       ← (solo si hay lógica cliente compleja)
      types/
        index.ts           ← (solo si hay tipos propios del feature)
```

---

### 2.2 La Página (`page.tsx`)

Server Component que:
1. Llama los Server Actions de lectura
2. Pasa los datos a los componentes como props
3. Envuelve secciones con `<Suspense>` cuando cargan async

**Patrón:**
```tsx
// src/app/productos/page.tsx
import { Suspense } from "react";
import { ProductsGrid } from "@/features/products/components/ProductsGrid";
import { FiltersPanel } from "@/features/products/components/FiltersPanel";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ProductosPage({ searchParams }: PageProps) {
  const params = await searchParams; // Next.js 16: siempre await

  return (
    <main className="container mx-auto px-4 py-8">
      <FiltersPanel />
      <Suspense fallback={<ProductsGridSkeleton />}>
        <ProductsGrid categorySlug={params.category} query={params.q} />
      </Suspense>
    </main>
  );
}
```

**Reglas:**
- `async searchParams = await searchParams` — SIEMPRE en Next.js 16
- `async params = await params` — en páginas dinámicas `[slug]`
- No usar `"use client"` en `page.tsx` salvo excepción justificada

---

### 2.3 Componentes de Feature

Un componente por sección del wireframe. Pueden ser Server o Client Components.

**Server Component (default) — para secciones que solo muestran datos:**
```tsx
// src/features/products/components/ProductsGrid.tsx
import { getProducts } from "@/features/products/actions/getProducts";
import { ProductCard } from "@/components/shared/ProductCard";

interface ProductsGridProps {
  categorySlug?: string;
}

export async function ProductsGrid({ categorySlug }: ProductsGridProps) {
  const result = await getProducts({ categorySlug });
  const products = result?.data?.products ?? [];

  if (products.length === 0) {
    return <p className="text-muted-foreground">No hay productos.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Client Component — solo cuando hay:**
- Interactividad (clicks, hover states que mutan estado)
- Formularios con react-hook-form
- Acceso a store de Zustand
- Uso de hooks de React (useState, useEffect, etc.)

```tsx
"use client"; // Solo aquí, no en page.tsx
```

---

### 2.4 Formularios (Client Components)

**Patrón obligatorio:** react-hook-form + Zod + `@/lib/zod-resolver`

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver"; // ← NO de @hookform/resolvers/zod
import { z } from "zod";
import { useAction } from "next-safe-action/hooks";
import { createTechnicalServiceRequest } from "@/features/technical-service/actions/createTechnicalServiceRequest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  // ...
});

type FormValues = z.infer<typeof formSchema>;

export function TechnicalServiceForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "" },
  });

  const { execute, isPending } = useAction(createTechnicalServiceRequest, {
    onSuccess: () => {
      toast.success("Solicitud enviada con éxito");
      form.reset();
    },
    onError: () => toast.error("Error al enviar. Intentá de nuevo."),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(execute)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enviando..." : "Enviar"}
        </Button>
      </form>
    </Form>
  );
}
```

**Checklist formularios:**
- [ ] `zodResolver` importado desde `@/lib/zod-resolver`
- [ ] `useAction` de `next-safe-action/hooks` para ejecutar la acción
- [ ] Shadcn `<Form>` + `<FormField>` para accesibilidad y mensajes de error
- [ ] Feedback visual: `isPending` en el botón, `toast` en onSuccess/onError
- [ ] `form.reset()` tras éxito si corresponde

---

### 2.5 Estado Cliente (Zustand)

Solo para estado que persiste entre navegaciones o se comparte entre componentes no relacionados.
En este proyecto: el carrito (`src/features/cart/store/cartStore.ts`).

```ts
// Consumir el store en un Client Component
"use client";
import { useCartStore } from "@/features/cart/store/cartStore";

export function AddToCartButton({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  return <Button onClick={() => addItem(product)}>Agregar al carrito</Button>;
}
```

---

### 2.6 Tokens de Diseño y Componentes UI

> **PENDIENTE DE DEFINICIÓN**
> La paleta de colores, tipografías, espaciados y border-radius **aún no están definidos**.
> Se establecerán cuando el cliente entregue los wireframes con la identidad visual.
> Hasta entonces: NO inventar valores, NO hardcodear colores, NO asumir fuentes.

**Cuándo se definen los tokens:**
1. El cliente entrega wireframes con guía visual (colores, fuentes, radios)
2. Se traducen a variables CSS en `src/app/globals.css`
3. A partir de ahí, todo el código usa los tokens (nunca valores hardcodeados)

**Flujo para definir la paleta (cuando llegue el wireframe):**
```css
/* src/app/globals.css — se completará con los valores reales */
:root {
  --primary: /* color principal — pendiente */;
  --accent: /* color de acento — pendiente */;
  /* tipografías, radios, etc. */
}
```

**Componentes base:** Siempre usar primitivas de Shadcn (`Button`, `Input`, `Card`, `Badge`, etc.)
y extenderlas con Tailwind. No crear componentes UI desde cero si ya existe la primitiva.

**Íconos:** Lucide React (`import { ShoppingCart } from "lucide-react"`)

---

### 2.7 Componentes Globales (siempre presentes)

Ya implementados y montados en `src/app/layout.tsx`:
- `<Navbar>` con `<CartDrawer>` integrado
- `<Footer>`
- `<WhatsAppButton>` flotante
- `<Toaster>` de Sonner

No duplicarlos ni volver a montarlos en páginas individuales.

---

## 3. Flujo Completo por Tipo de Página

### Página informativa (solo muestra contenido)
*Ejemplo: `/sobre-nosotros`, secciones estáticas*

1. Recibo wireframe
2. **Backend:** Ninguno (contenido hardcodeado en el componente)
3. **Frontend:**
   - Crear `src/features/<feature>/components/` con un componente por sección
   - Crear `src/app/<ruta>/page.tsx` que compone los componentes
4. Verifico en browser

---

### Página con datos dinámicos (solo lectura)
*Ejemplo: `/productos`, `/productos/[slug]`*

1. Recibo wireframe
2. **Backend:**
   - Verificar que el modelo Prisma existe y tiene los campos necesarios
   - Crear/ajustar Server Action en `features/<feature>/actions/`
3. **Frontend:**
   - Componentes de feature (Server Components async)
   - `page.tsx` con `<Suspense>` y skeleton de carga
   - `loading.tsx` si la página entera carga async
4. Verifico con datos reales de la DB

---

### Página con formulario (mutación)
*Ejemplo: `/servicio-tecnico`, `/checkout`*

1. Recibo wireframe
2. **Backend:**
   - Verificar/crear modelo Prisma si aplica
   - Correr migración
   - Crear Server Action de mutación con schema Zod
3. **Frontend:**
   - Server Component para el wrapper de la página
   - Client Component para el formulario (`"use client"`)
   - react-hook-form + zodResolver + useAction
   - Toast feedback en onSuccess/onError
4. Pruebo el flujo completo (submit → DB → feedback)

---

### Página admin (CRUD)
*Ejemplo: `/admin/productos`, `/admin/ordenes`*

1. Recibo wireframe
2. **Backend:**
   - Server Actions de lectura (listar) y mutación (crear/editar/eliminar)
   - Verificar que el middleware de auth cubra la ruta
3. **Frontend:**
   - Tabla con datos (Server Component)
   - Formulario de creación/edición (Client Component con react-hook-form)
   - Botones de acción con confirmación (Dialog de Shadcn)
   - Toast feedback en cada operación
4. Pruebo todo el flujo CRUD con sesión admin activa

---

### Flujo de pago (MercadoPago)
*Solo `/checkout`*

1. **Backend:**
   - `createOrder` → persiste la orden con status `PENDING`
   - `createMercadoPagoPreference` → crea preferencia en MP con `back_urls`
   - Webhook `src/app/api/webhooks/mp/route.ts` → actualiza `Order.status` según notificación
2. **Frontend:**
   - `CheckoutForm` recopila datos del cliente
   - Al submit: llama `createOrder` → llama `createMercadoPagoPreference` → redirect a MP
   - Páginas de resultado: `/checkout/success`, `/checkout/failure`, `/checkout/pending`

---

## 4. Checklist Final por Página

Antes de declarar una página como terminada:

**Backend:**
- [ ] Migraciones aplicadas y `prisma generate` ejecutado
- [ ] Server Actions validan input con Zod
- [ ] Rutas admin protegidas por middleware
- [ ] Sin lógica de DB directa en componentes (todo pasa por actions)

**Frontend:**
- [ ] Todos los `searchParams` y `params` son `await`-eados (Next.js 16)
- [ ] Secciones async envueltas en `<Suspense>` con skeleton
- [ ] Formularios usan `zodResolver` de `@/lib/zod-resolver`
- [ ] No se usa `any` (excepto en `zod-resolver.ts`)
- [ ] `"use client"` solo donde es estrictamente necesario
- [ ] Enums importados desde `@/types/enums`
- [ ] Colores, tipografías, espaciados y radios usan tokens definidos en `globals.css` (no valores hardcodeados)
- [ ] WhatsAppButton y CartDrawer accesibles (ya montados en layout — no duplicar)

**QA:**
- [ ] Funciona en desktop y mobile
- [ ] Estados de carga (skeleton/spinner) visibles
- [ ] Mensajes de error visibles en formularios (react-hook-form)
- [ ] Feedback de acciones exitosas (toast de Sonner)
- [ ] La página no explota si la DB no devuelve datos (estado vacío manejado)

---

## 5. Variables de Entorno Necesarias

```env
# Base de datos
DATABASE_URL=postgresql://...

# Supabase Auth (admin)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# MercadoPago (solo para checkout)
MERCADOPAGO_ACCESS_TOKEN=...
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=...
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com
```

Si falta alguna variable, la funcionalidad relacionada falla en silencio o con error de runtime.
Confirmar que todas estén seteadas antes de probar checkout o login admin.

---

## 6. Comandos Clave

```bash
# Instalar dependencias
pnpm install

# Dev server (con Turbopack)
pnpm dev

# Migración de DB (después de cambiar schema.prisma)
pnpm prisma migrate dev --name <nombre-descriptivo>

# Regenerar tipos de Prisma (después de migrate o cambios de schema)
pnpm prisma generate

# Ver DB en browser
pnpm prisma studio

# Build de producción
pnpm build
```
