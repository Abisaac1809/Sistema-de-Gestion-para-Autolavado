-- AlterTable
ALTER TABLE "purchases" ADD COLUMN     "payment_method_id" UUID;

-- CreateIndex
CREATE INDEX "purchases_payment_method_id_idx" ON "purchases"("payment_method_id");

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
