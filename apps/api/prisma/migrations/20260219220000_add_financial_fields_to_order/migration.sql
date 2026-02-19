-- Rename total_estimated to total_usd (preserves existing data)
ALTER TABLE "orders" RENAME COLUMN "total_estimated" TO "total_usd";

-- Add new financial columns
ALTER TABLE "orders"
ADD COLUMN "dollar_rate"    DECIMAL(10,2) NOT NULL DEFAULT 1,
ADD COLUMN "total_ves"      DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN "total_paid_usd" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN "total_paid_ves" DECIMAL(12,2) NOT NULL DEFAULT 0;
