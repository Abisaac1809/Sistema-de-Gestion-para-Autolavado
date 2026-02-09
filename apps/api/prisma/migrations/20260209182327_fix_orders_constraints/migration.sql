-- Fix orders table constraints to match Prisma schema

-- Step 1: Update any NULL vehicle_model values to a default value
-- This is needed before we can add NOT NULL constraint
UPDATE "orders" SET "vehicle_model" = 'Unknown' WHERE "vehicle_model" IS NULL;

-- Step 2: Make vehicle_plate NULLABLE (currently NOT NULL)
ALTER TABLE "orders" ALTER COLUMN "vehicle_plate" DROP NOT NULL;

-- Step 3: Make vehicle_model NOT NULL (currently NULLABLE)
ALTER TABLE "orders" ALTER COLUMN "vehicle_model" SET NOT NULL;

-- Step 4: Make customer_id NOT NULL (currently NULLABLE)
-- First ensure there are no NULL values
UPDATE "orders" SET "deleted_at" = NOW() WHERE "customer_id" IS NULL AND "deleted_at" IS NULL;
ALTER TABLE "orders" ALTER COLUMN "customer_id" SET NOT NULL;

-- Step 5: Drop and recreate the foreign key constraint with RESTRICT
ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "orders_customer_id_fkey";
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey"
    FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
