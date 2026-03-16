# Errores de build en Vercel — Registro

## Error: `Module '"@prisma/client"' has no exported member 'PrismaClient'`

### Síntoma

El build de Vercel falla con TypeScript en `prisma/seed.ts`:

```
./prisma/seed.ts:1:10
Type error: Module '"@prisma/client"' has no exported member 'PrismaClient'.
```

### Causa raíz

Dos problemas combinados:

1. **`prisma generate` no corre automáticamente en Vercel.** Sin el cliente generado, `@prisma/client` no exporta `PrismaClient` ni sus tipos TypeScript.

2. **`tsconfig.json` incluye `prisma/seed.ts`** vía el patrón `**/*.ts`. El seed es un script Node.js que no forma parte de la app Next.js, pero TypeScript lo verifica durante el build. Al no haber tipos generados, falla.

### Fix aplicado

**`package.json`** — agregar `postinstall` para que `prisma generate` corra después de `pnpm install` (tanto en local como en Vercel):

```json
"scripts": {
  "postinstall": "prisma generate",
  ...
}
```

**`tsconfig.json`** — excluir la carpeta `prisma/` para que `seed.ts` (y otras utilidades Node.js del directorio) no sean type-chequeadas durante el build de Next.js:

```json
"exclude": ["node_modules", "prisma"]
```

### Regla general

- Siempre que se agregue un archivo `.ts` en `prisma/` (seeds, scripts de migración custom, etc.), asegurarse de que `"prisma"` esté en el `exclude` de `tsconfig.json`.
- El script `postinstall: "prisma generate"` es obligatorio para cualquier deploy en CI/CD que use Prisma.
