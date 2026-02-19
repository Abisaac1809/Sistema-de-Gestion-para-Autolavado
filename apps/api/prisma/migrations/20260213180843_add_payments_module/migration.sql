-- Drop the old payment_method_id column and index from sales
ALTER TABLE "sales" DROP COLUMN IF EXISTS "payment_method_id";
DROP INDEX IF EXISTS "sales_payment_method_id_idx";

-- Add paymentStatus to sales
ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING';

-- Create index for payment_status
CREATE INDEX IF NOT EXISTS "sales_payment_status_idx" ON "sales"("payment_status");

-- CreateTable: payments
CREATE TABLE IF NOT EXISTS "payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID,
    "sale_id" UUID,
    "payment_method_id" UUID NOT NULL,
    "amount_usd" DECIMAL(10,2) NOT NULL,
    "exchange_rate" DECIMAL(15,4) NOT NULL,
    "amount_ves" DECIMAL(15,2) NOT NULL,
    "payment_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "payments_order_id_idx" ON "payments"("order_id");
CREATE INDEX IF NOT EXISTS "payments_sale_id_idx" ON "payments"("sale_id");
CREATE INDEX IF NOT EXISTS "payments_payment_method_id_idx" ON "payments"("payment_method_id");
CREATE INDEX IF NOT EXISTS "payments_payment_date_idx" ON "payments"("payment_date");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
