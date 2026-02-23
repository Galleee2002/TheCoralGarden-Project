# TheCoralGarden — Claude Code Rules

## Stack
- Next.js 15 App Router, TypeScript strict mode
- Tailwind CSS + Shadcn/UI components
- Prisma ORM + Supabase (PostgreSQL)
- Zustand para estado cliente, React Query para servidor
- MercadoPago para pagos

## Arquitectura: Feature-First + Clean Layers
- Cada feature vive en `src/features/<name>/`
- Dentro de cada feature: components/, hooks/, actions/, types/
- Server Actions en `actions/` usando next-safe-action
- UI compartida en `src/components/`
- Acceso a DB solo a través de `src/lib/prisma/client.ts`

## Convenciones de código
- TypeScript con tipos estrictos, nunca usar `any`
- Schemas Zod para todas las validaciones
- Server Components por defecto, `"use client"` solo cuando sea necesario
- Todos los formularios usan react-hook-form + zod resolver
- Manejo de errores con tipos, nunca throw strings crudas

## Frontend
- Componentes usan primitivas de shadcn, extendidas con Tailwind
- No modificar tokens de diseño hasta confirmar con el cliente

## Backend / DB
- Todas las mutaciones de DB van a través de Prisma
- Auth manejado por Supabase Auth
- RLS (Row Level Security) habilitado en todas las tablas de Supabase
