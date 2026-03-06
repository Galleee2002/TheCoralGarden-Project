ALTER TABLE "Category" ADD COLUMN "imageUrl" TEXT;

CREATE TABLE "SiteSetting" (
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);
