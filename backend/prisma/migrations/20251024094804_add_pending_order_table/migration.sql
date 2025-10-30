-- CreateTable
CREATE TABLE "PendingOrder" (
    "pending_order_id" SERIAL NOT NULL,
    "checkout_session_id" TEXT NOT NULL,
    "order_data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PendingOrder_pkey" PRIMARY KEY ("pending_order_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingOrder_checkout_session_id_key" ON "PendingOrder"("checkout_session_id");
