ALTER TABLE "Product"
ADD COLUMN "shippingWeightGrams" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "shippingHeightCm" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "shippingWidthCm" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "shippingLengthCm" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Order"
ADD COLUMN "shippingMethod" TEXT NOT NULL DEFAULT 'correo_argentino_home',
ADD COLUMN "shippingQuoteProvider" TEXT NOT NULL DEFAULT 'correo_argentino',
ADD COLUMN "shippingQuotedAt" TIMESTAMP(3),
ADD COLUMN "shippingRatePayload" JSONB,
ADD COLUMN "shippingExternalId" TEXT,
ADD COLUMN "shippingTrackingNumber" TEXT,
ADD COLUMN "shippingImportedAt" TIMESTAMP(3),
ADD COLUMN "shippingImportStatus" TEXT,
ADD COLUMN "shippingImportError" TEXT;
