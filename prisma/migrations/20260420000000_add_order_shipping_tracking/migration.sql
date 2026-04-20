-- Add shipping/logistics fields to Order for Correo Argentino flow
ALTER TABLE "Order"
  ADD COLUMN IF NOT EXISTS "customerStreetNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "customerFloor" TEXT,
  ADD COLUMN IF NOT EXISTS "customerApartment" TEXT,
  ADD COLUMN IF NOT EXISTS "shippingCarrier" TEXT,
  ADD COLUMN IF NOT EXISTS "shippingDeliveryType" TEXT,
  ADD COLUMN IF NOT EXISTS "shippingProductType" TEXT,
  ADD COLUMN IF NOT EXISTS "shippingProductName" TEXT,
  ADD COLUMN IF NOT EXISTS "shippingAgency" TEXT,
  ADD COLUMN IF NOT EXISTS "shippingAgencyName" TEXT,
  ADD COLUMN IF NOT EXISTS "shippingDeliveryTimeMin" TEXT,
  ADD COLUMN IF NOT EXISTS "shippingDeliveryTimeMax" TEXT,
  ADD COLUMN IF NOT EXISTS "shippingQuoteValidTo" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "shippingExternalOrderId" TEXT,
  ADD COLUMN IF NOT EXISTS "shippingImportStatus" TEXT,
  ADD COLUMN IF NOT EXISTS "shippingImportError" TEXT,
  ADD COLUMN IF NOT EXISTS "shippingImportedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "shippingTrackingNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "shippingTrackingLastEvent" TEXT,
  ADD COLUMN IF NOT EXISTS "shippingTrackingLastSyncAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "shippingTrackingRaw" JSONB,
  ADD COLUMN IF NOT EXISTS "shippingEmailSentAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "Order_shippingTrackingNumber_idx"
  ON "Order" ("shippingTrackingNumber");

CREATE INDEX IF NOT EXISTS "Order_shippingImportStatus_idx"
  ON "Order" ("shippingImportStatus");
