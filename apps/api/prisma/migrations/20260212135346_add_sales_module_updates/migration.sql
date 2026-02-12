-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "sales" ADD COLUMN "customer_id" UUID NOT NULL,
ALTER COLUMN "payment_method_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "sales_customer_id_idx" ON "sales"("customer_id");

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
