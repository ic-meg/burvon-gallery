-- CreateTable
CREATE TABLE "SizeStock" (
    "size_stock_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SizeStock_pkey" PRIMARY KEY ("size_stock_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SizeStock_product_id_size_key" ON "SizeStock"("product_id", "size");

-- AddForeignKey
ALTER TABLE "SizeStock" ADD CONSTRAINT "SizeStock_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;
