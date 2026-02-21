/*
  Warnings:

  - You are about to drop the column `email` on the `store_info` table. All the data in the column will be lost.
  - Made the column `address` on table `store_info` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `store_info` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "store_info" DROP COLUMN "email",
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;
