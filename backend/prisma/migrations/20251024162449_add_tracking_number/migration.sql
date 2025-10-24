-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shipped_date" TIMESTAMP(3),
ADD COLUMN     "tracking_number" TEXT;
