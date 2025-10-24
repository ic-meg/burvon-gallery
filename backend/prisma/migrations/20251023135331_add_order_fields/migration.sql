/*
  Warnings:

  - Added the required column `barangay` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city_municipality` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postal_code` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province_region` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street_address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "barangay" TEXT NOT NULL,
ADD COLUMN     "city_municipality" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "postal_code" TEXT NOT NULL,
ADD COLUMN     "province_region" TEXT NOT NULL,
ADD COLUMN     "street_address" TEXT NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;
