/*
  Warnings:

  - You are about to drop the column `duration_minutes` on the `services` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "original_currency" "Currency" NOT NULL DEFAULT 'USD',
ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "total_paid_usd" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "total_paid_ves" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "duration_minutes";
