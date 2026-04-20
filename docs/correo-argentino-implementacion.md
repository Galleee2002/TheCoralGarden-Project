# Correo Argentino - Implementacion full

Este documento resume el flujo implementado para integrar MiCorreo con checkout, MercadoPago, admin, tracking y emails.

## Flujo funcional

1. El cliente carga direccion estructurada en checkout.
2. Checkout llama `quoteShipping` y cotiza Correo Argentino con `/rates`.
3. El cliente elige domicilio (`D`) o sucursal (`S`); si elige sucursal, se cargan agencias con `/agencies`.
4. `createOrder` recalcula la tarifa en servidor y persiste subtotal, costo de envio, total, tipo de entrega, producto, sucursal y vigencia de cotizacion.
5. `createMercadoPagoPreference` cobra productos + envio.
6. El webhook de MercadoPago confirma `PAID`, descuenta stock, intenta importar el envio con `/shipping/import` y envia emails de confirmacion.
7. Admin puede ver estado logistico, reintentar importacion y refrescar tracking.
8. El cron protegido `/api/cron/correo-tracking` sincroniza tracking de ordenes importadas.
9. Cuando existe tracking real, se envia email de despacho una sola vez usando `shippingEmailSentAt`.

## Archivos principales

- `src/lib/correo-argentino/client.ts`: auth dinamica, `/rates`, `/agencies`, `/shipping/import`, `/shipping/tracking`.
- `src/lib/correo-argentino/order-shipping.ts`: importacion, retry, sync tracking, email de despacho.
- `src/features/checkout/actions/shippingActions.ts`: actions publicas de cotizacion y agencias.
- `src/features/checkout/actions/createOrder.ts`: validacion server-side de tarifa y persistencia de envio.
- `src/features/checkout/components/CheckoutForm.tsx`: UI de cotizacion y seleccion de envio.
- `src/features/admin/actions/shippingActions.ts`: retry import y refresh tracking.
- `src/features/admin/components/orders/OrdersTable.tsx`: visibilidad logistica admin.
- `src/app/api/cron/correo-tracking/route.ts`: cron protegido por `CRON_SECRET`.
- `src/app/api/webhooks/mp/route.ts`: importacion post-pago y emails.
- `src/lib/resend/send-shipping-notification.ts`: email de despacho.

## Persistencia

La migracion `prisma/migrations/20260420000000_add_order_shipping_tracking/migration.sql` agrega:

- Direccion estructurada: `customerStreetNumber`, `customerFloor`, `customerApartment`.
- Cotizacion/envio: `shippingCarrier`, `shippingDeliveryType`, `shippingProductType`, `shippingProductName`, `shippingAgency`, `shippingAgencyName`, `shippingDeliveryTimeMin`, `shippingDeliveryTimeMax`, `shippingQuoteValidTo`.
- Import/tracking: `shippingExternalOrderId`, `shippingImportStatus`, `shippingImportError`, `shippingImportedAt`, `shippingTrackingNumber`, `shippingTrackingLastEvent`, `shippingTrackingLastSyncAt`, `shippingTrackingRaw`.
- Email: `shippingEmailSentAt`.

## Variables de entorno

Ver `.env.example`. Variables clave:

- `SETTINGS_ENCRYPTION_KEY`
- `CRON_SECRET`

La configuración específica de Correo Argentino se carga desde `/admin/configuracion`, tab `Correo Argentino`, y queda persistida en `SiteSetting`. Los passwords se guardan cifrados usando `SETTINGS_ENCRYPTION_KEY`. Las variables legacy `CORREO_ARGENTINO_*` siguen funcionando como fallback de migración.

## Operacion admin

En `/admin/ordenes`, cada orden muestra:

- estado comercial,
- estado de importacion,
- metodo y tipo de entrega,
- sucursal elegida,
- tracking,
- ultimo evento,
- ultimo sync,
- error de importacion si existe.

Acciones:

- `Reimportar`: disponible cuando `shippingImportStatus = ERROR`.
- `Tracking`: disponible cuando `shippingImportStatus = IMPORTED`.

## Cron

Endpoint:

```txt
GET /api/cron/correo-tracking
Authorization: Bearer $CRON_SECRET
```

Procesa ordenes `PAID`, `PROCESSING` o `SHIPPED` importadas en Correo y sin sync reciente.

## Verificacion

Comandos esperados:

```bash
pnpm prisma generate
pnpm test
pnpm exec tsc --noEmit
```

Nota: antes de esta implementacion `tsc --noEmit` ya fallaba por `.next/types` obsoletos y resolucion de `resend`. Si persiste, limpiar `.next` y revisar instalacion/tipos de `resend`.
