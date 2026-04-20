# Integración Correo Argentino

Este documento resume la implementación actual de Correo Argentino en el proyecto, los puntos sensibles del flujo y las cosas que hay que revisar sí o sí antes de modificar checkout, órdenes, productos o el webhook de Mercado Pago.

## Objetivo de la implementación

La integración actual hace tres cosas:

1. Cotiza el envío a domicilio en checkout antes del pago.
2. Cobra ese costo dentro de Mercado Pago como parte del total de la orden.
3. Importa el envío en Correo Argentino recién cuando Mercado Pago confirma la orden como `PAID`.

La primera versión soporta solo envío a domicilio. No hay sucursales, agencias ni `deliveryType = "S"` en producción del flujo actual.

## Archivos principales

- [src/lib/correo-argentino/client.ts](/Users/gaeldev/Desktop/TheCoralGarden-Project/src/lib/correo-argentino/client.ts)
- [src/lib/correo-argentino/service.ts](/Users/gaeldev/Desktop/TheCoralGarden-Project/src/lib/correo-argentino/service.ts)
- [src/lib/correo-argentino/mappers.ts](/Users/gaeldev/Desktop/TheCoralGarden-Project/src/lib/correo-argentino/mappers.ts)
- [src/lib/correo-argentino/settings.ts](/Users/gaeldev/Desktop/TheCoralGarden-Project/src/lib/correo-argentino/settings.ts)
- [src/features/checkout/actions/quoteCorreoArgentinoShipping.ts](/Users/gaeldev/Desktop/TheCoralGarden-Project/src/features/checkout/actions/quoteCorreoArgentinoShipping.ts)
- [src/features/checkout/actions/createOrder.ts](/Users/gaeldev/Desktop/TheCoralGarden-Project/src/features/checkout/actions/createOrder.ts)
- [src/features/checkout/components/CheckoutForm.tsx](/Users/gaeldev/Desktop/TheCoralGarden-Project/src/features/checkout/components/CheckoutForm.tsx)
- [src/app/api/webhooks/mp/route.ts](/Users/gaeldev/Desktop/TheCoralGarden-Project/src/app/api/webhooks/mp/route.ts)
- [src/features/admin/actions/correoArgentinoActions.ts](/Users/gaeldev/Desktop/TheCoralGarden-Project/src/features/admin/actions/correoArgentinoActions.ts)
- [src/features/admin/components/settings/CorreoArgentinoSettingsCard.tsx](/Users/gaeldev/Desktop/TheCoralGarden-Project/src/features/admin/components/settings/CorreoArgentinoSettingsCard.tsx)
- [prisma/schema.prisma](/Users/gaeldev/Desktop/TheCoralGarden-Project/prisma/schema.prisma)
- [prisma/migrations/20260416000000_add_correo_argentino_shipping/migration.sql](/Users/gaeldev/Desktop/TheCoralGarden-Project/prisma/migrations/20260416000000_add_correo_argentino_shipping/migration.sql)

## Flujo actual

### 1. Checkout

El checkout observa el `customerZip` y el carrito.

Cuando hay carrito y un código postal válido:

- llama a `quoteCorreoArgentinoShipping`
- esa action ejecuta la cotización real en servidor
- se muestra el costo y la ventana estimada de entrega
- si no hay cotización válida, el botón de pago queda deshabilitado

Importante:

- el precio de envío nunca se confía desde cliente
- la UI solo muestra una cotización informativa
- el valor final se recalcula otra vez en servidor al crear la orden

### 2. Creación de orden

`createOrder`:

- valida stock y productos activos
- vuelve a cotizar el envío en servidor
- persiste `shippingCost`
- persiste metadata de cotización en `shippingRatePayload`
- marca la orden con `shippingImportStatus = "PENDING"`

Esto evita que alguien manipule el costo del envío desde el navegador.

### 3. Mercado Pago

`createMercadoPagoPreference` sigue usando el total persistido en la orden.

El item de shipping se agrega a la preferencia solo si `shippingCost > 0`.

### 4. Webhook de pago

En [src/app/api/webhooks/mp/route.ts](/Users/gaeldev/Desktop/TheCoralGarden-Project/src/app/api/webhooks/mp/route.ts):

- se valida la firma de Mercado Pago
- se actualiza el estado de la orden
- si la orden pasa a `PAID`, se descuenta stock
- luego se intenta importar el envío en Correo Argentino

Si la importación sale bien:

- `shippingImportStatus = "IMPORTED"`
- se guarda `shippingImportedAt`
- se guarda `shippingExternalId`

Si la importación falla:

- `shippingImportStatus = "FAILED"`
- se guarda `shippingImportError`

Importante:

- una falla de importación no revierte el pago
- la orden permanece cobrada
- el fallo queda visible en admin para seguimiento operativo

## Modelo de datos agregado

### Product

Se agregaron estas columnas:

- `shippingWeightGrams`
- `shippingHeightCm`
- `shippingWidthCm`
- `shippingLengthCm`

Se usan para cotizar y para construir el payload de `shipping/import`.

Sin esos datos, el producto no puede cotizar correctamente.

### Order

Se agregaron estas columnas:

- `shippingMethod`
- `shippingQuoteProvider`
- `shippingQuotedAt`
- `shippingRatePayload`
- `shippingExternalId`
- `shippingTrackingNumber`
- `shippingImportedAt`
- `shippingImportStatus`
- `shippingImportError`

`shippingRatePayload` guarda la request, la response y la tarifa elegida. Ese campo hoy es crítico porque el webhook lo reutiliza para importar el envío.

## Lógica de cotización

La agregación del paquete del carrito se hace en servidor con estas reglas:

- `weight = suma(peso * cantidad)`
- `height = suma(alto * cantidad)`
- `width = máximo ancho`
- `length = máximo largo`

Después se elige la mejor tarifa de Correo Argentino con estas reglas:

- solo `deliveredType = "D"`
- menor `price`
- si hay empate, menor `deliveryTimeMax`

## Configuración operativa

La operación de Correo Argentino se administra desde `/admin/configuracion`, tab `Correo Argentino`.

Ahí se guardan:

- remitente
- email del remitente
- teléfono
- dirección de origen
- provincia origen
- código postal origen
- `customerId`

El `customerId` no se ingresa manualmente en esta implementación. Se sincroniza usando:

- `CORREO_ARGENTINO_MICORREO_EMAIL`
- `CORREO_ARGENTINO_MICORREO_PASSWORD`

La acción admin llama a `/users/validate` y persiste el resultado en `SiteSetting`.

## Variables de entorno

Estas variables son obligatorias para la integración:

- `CORREO_ARGENTINO_BASE_URL`
- `CORREO_ARGENTINO_API_USER`
- `CORREO_ARGENTINO_API_PASSWORD`
- `CORREO_ARGENTINO_MICORREO_EMAIL`
- `CORREO_ARGENTINO_MICORREO_PASSWORD`

Además siguen siendo necesarias las de Mercado Pago, Supabase, Cloudinary y correo transaccional.

La referencia mínima quedó en [.env.example](/Users/gaeldev/Desktop/TheCoralGarden-Project/.env.example).

## Cosas importantes a tener en cuenta antes de cambiar algo

### 1. No mover el cálculo de envío a cliente

El costo final debe seguir recalculándose dentro de `createOrder`.

Si se deja el valor solo en cliente:

- se puede adulterar el precio
- el total cobrado en MP puede no coincidir con la orden
- el webhook puede importar con metadata inconsistente

### 2. No eliminar `shippingRatePayload` sin reemplazo

Hoy el webhook depende de ese campo para construir el `shipping/import`.

Si se cambia ese contrato, hay que cambiar también:

- `createOrder`
- `importOrderShipping`
- `buildImportRequest`
- el manejo de órdenes ya creadas

### 3. No permitir productos sin dimensiones operativas

Los productos deben tener peso y medidas válidas.

Si se crean productos con `0`, `null` o datos dummy:

- la cotización puede fallar
- la orden puede cobrarse sin posibilidad real de importar el envío

### 4. Revisar provincia del cliente si se toca checkout

El checkout hoy pide provincia como texto libre y la integración la traduce al código requerido por Correo.

Si se cambia ese campo:

- hay que mantener compatibilidad con `resolveProvinceCode`
- o cambiar la UI para guardar directamente el código oficial

Este punto es sensible porque el error puede aparecer recién al importar en el webhook.

### 5. No romper la secuencia del webhook

El webhook hoy hace:

1. validación de firma
2. lectura de pago
3. actualización de estado
4. descuento de stock
5. importación en Correo
6. emails

Si se reordena esto, revisar especialmente:

- idempotencia
- doble descuento de stock
- reintentos de Mercado Pago
- órdenes `PAID` con shipping fallido

### 6. Si se agrega sucursal, no es un cambio menor

La implementación actual asume solo domicilio.

Soportar sucursal implica cambiar:

- checkout UI
- selección de agencia
- payload de `/rates`
- payload de `/shipping/import`
- persistencia de la agencia elegida
- visualización admin

No conviene mezclar ese cambio con fixes menores.

### 7. Si se toca admin/configuración, mantener `SiteSetting`

La operación actual usa `SiteSetting` para evitar redeploys por cambios logísticos.

Si se mueve esa config a env vars o a otro storage:

- revisar el bootstrap del `customerId`
- revisar `requireCorreoArgentinoShippingSettings`
- revisar el flujo operativo del equipo

## Antes de desplegar o probar en otro ambiente

Checklist mínimo:

1. Ejecutar la migración Prisma.
2. Correr `pnpm prisma generate`.
3. Cargar variables de entorno nuevas.
4. Completar dimensiones de todos los productos vendibles.
5. Configurar remitente/origen en admin.
6. Sincronizar `customerId`.
7. Probar checkout con una orden controlada.
8. Verificar que el webhook importe correctamente el envío.
9. Revisar `/admin/ordenes` para confirmar `IMPORTED` o `FAILED`.

## Validaciones locales que se usaron

- `pnpm prisma generate`
- `pnpm exec tsc --noEmit`
- `pnpm test`

También se agregaron tests puntuales para:

- checkout con cotización
- mapeo y agregación de dimensiones de Correo Argentino

## Recomendación si hay que tocar esta integración

Si el cambio afecta cualquiera de estos puntos:

- checkout
- `createOrder`
- webhook de Mercado Pago
- `shippingRatePayload`
- dimensiones del producto
- settings operativos

hacer siempre estas tres verificaciones antes de cerrar:

1. que el total de checkout coincida con Mercado Pago
2. que una orden `PAID` quede con `IMPORTED` o `FAILED`, nunca sin trazabilidad
3. que una orden ya pagada no duplique stock ni importación en reintentos
