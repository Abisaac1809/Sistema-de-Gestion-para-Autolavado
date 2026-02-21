/*
  Warnings:

  - A unique constraint covering the columns `[singleton]` on the table `store_info` will be added. If there are existing duplicate values, this will fail.

*/
-- First, add the singleton column as nullable
ALTER TABLE "store_info" ADD COLUMN "singleton" BOOLEAN;

-- If there are existing records, set only the most recent one to true and mark others as deleted
UPDATE "store_info"
SET "singleton" = false
WHERE "deleted_at" IS NULL AND "id" != (
  SELECT "id" FROM "store_info"
  WHERE "deleted_at" IS NULL
  ORDER BY "created_at" DESC
  LIMIT 1
);

-- Mark duplicate records (older ones) as deleted
UPDATE "store_info"
SET "deleted_at" = NOW()
WHERE "singleton" = false AND "deleted_at" IS NULL;

-- Set the remaining active record to true
UPDATE "store_info"
SET "singleton" = true
WHERE "deleted_at" IS NULL AND "singleton" IS NULL;

-- If no records exist yet (fresh database), set default to true
ALTER TABLE "store_info" ALTER COLUMN "singleton" SET DEFAULT true;
ALTER TABLE "store_info" ALTER COLUMN "singleton" SET NOT NULL;

-- Add unique constraint
ALTER TABLE "store_info" ADD CONSTRAINT "store_info_singleton_key" UNIQUE ("singleton");
