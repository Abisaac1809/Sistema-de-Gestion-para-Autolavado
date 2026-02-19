/*
  Warnings:

  - You are about to drop the column `total` on the `sales` table. All the data in the column will be lost.
  - Added the required column `total_usd` to the `sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_ves` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sales" DROP COLUMN "total",
ADD COLUMN     "total_usd" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "total_ves" DECIMAL(12,2) NOT NULL;
