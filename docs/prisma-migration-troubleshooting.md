# Prisma Migration Troubleshooting

Documentación de los errores encontrados al correr `prisma migrate dev` y el procedimiento correcto para este proyecto.

---

## Errores encontrados (y por qué falló a la primera)

### 1. `pnpm` no estaba en el PATH del entorno de Claude

**Error:**
```
command not found: pnpm
```

**Causa:** El shell que usa Claude Code no hereda el PATH completo del usuario. `pnpm` está instalado en `/opt/homebrew/bin/pnpm` pero ese path no estaba disponible al ejecutar comandos sin prefijo.

**Fix:** Usar la ruta absoluta siempre:
```bash
/opt/homebrew/bin/pnpm prisma migrate dev ...
```

---

### 2. `npx prisma` falló por `dotenv/config`

**Error:**
```
Failed to load config file "prisma.config.ts". Error: Cannot find module 'dotenv/config'
```

**Causa:** `npx prisma` descarga una versión de Prisma aislada que no tiene acceso a `node_modules` del proyecto, por lo que `prisma.config.ts` no puede importar `dotenv/config`.

**Fix:** Siempre correr Prisma desde el `pnpm` local del proyecto, nunca con `npx`.

---

### 3. `.env` no era legible por el shell de Claude

**Error:** `cat .env` devolvió salida vacía a pesar de que el archivo tenía contenido.

**Causa:** El archivo `.env` tiene un encoding o atributos extendidos (`@` en `ls -la`) que el shell de Claude no puede leer con `cat`. El contenido sí existe y Prisma lo lee correctamente en tiempo de ejecución.

**Fix:** No confiar en `cat .env` para verificar. Si `DATABASE_URL` no carga, pasarla explícitamente como variable de entorno en el comando.

---

### 4. `migrate dev` con URL de pooler (puerto 6543) se cuelga indefinidamente

**Error:** El comando no terminaba ni daba output adicional.

**Causa:** `prisma migrate dev` requiere una **conexión directa** a PostgreSQL para manejar transacciones DDL. El pooler de Supabase (PgBouncer, puerto 6543) no soporta este tipo de conexión.

**Fix:** Usar `DATABASE_URL` con el puerto **5432** (conexión directa) al correr migraciones:
```bash
DATABASE_URL="postgresql://...@...supabase.com:5432/postgres" /opt/homebrew/bin/pnpm prisma migrate dev
```

> El puerto 6543 (pooler) es solo para runtime en producción/serverless.

---

### 5. `migrate dev` detectó migraciones modificadas y pidió reset

**Error:**
```
- The migration `0_init` was modified after it was applied.
- The migration `20260306000001_...` was modified after it was applied.
We need to reset the "public" schema. All data will be lost.
```

**Causa:** Los archivos de migración existentes en `prisma/migrations/` fueron editados localmente después de haber sido aplicados en la base de datos. `migrate dev` compara checksums y, al detectar diferencias, exige un reset completo.

**Consecuencia:** Hacer reset borra todos los datos en producción. Inaceptable.

---

## Procedimiento correcto cuando `migrate dev` no es viable

Cuando las migraciones anteriores están en estado inconsistente, seguir estos pasos:

### Paso 1 — Crear el archivo de migración manualmente

```
prisma/migrations/<timestamp>_<nombre>/migration.sql
```

Ejemplo para la tabla `Fair`:
```sql
CREATE TABLE "Fair" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Fair_pkey" PRIMARY KEY ("id")
);
```

### Paso 2 — Aplicar el SQL directamente con `prisma db execute`

```bash
DATABASE_URL="postgresql://...@...supabase.com:5432/postgres" \
  /opt/homebrew/bin/pnpm prisma db execute \
  --file prisma/migrations/<timestamp>_<nombre>/migration.sql
```

> `prisma db execute` no verifica checksums ni pide resets. Ejecuta el SQL tal cual.

### Paso 3 — Registrar la migración como aplicada

```bash
DATABASE_URL="postgresql://...@...supabase.com:5432/postgres" \
  /opt/homebrew/bin/pnpm prisma migrate resolve \
  --applied <timestamp>_<nombre>
```

Esto inserta el registro en la tabla `_prisma_migrations` para que Prisma no intente aplicarla de nuevo.

### Paso 4 — Regenerar el cliente Prisma

```bash
DATABASE_URL="postgresql://...@...supabase.com:5432/postgres" \
  /opt/homebrew/bin/pnpm prisma generate
```

---

## Referencia rápida de URLs

| Uso | URL | Puerto |
|---|---|---|
| Runtime (dev/prod) | Pooler URL con `?pgbouncer=true` | **6543** |
| Migraciones | Direct URL (sin pgbouncer) | **5432** |

---

## Alternativa: MCP Supabase (preferida cuando está disponible)

El `CLAUDE.md` documenta este flujo como el preferido si el MCP de Supabase está configurado:

```
1. mcp__supabase__apply_migration  → aplica el SQL
2. mcp__supabase__execute_sql      → registra en _prisma_migrations
3. pnpm prisma generate
```

Si el MCP no está disponible, usar el procedimiento manual de los pasos 1–4 de arriba.
