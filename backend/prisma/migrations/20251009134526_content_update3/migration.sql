/*
  Warnings:

  - You are about to drop the column `promo_description` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `promo_images` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `promo_title` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `collection_image` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `promo_description` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `promo_images` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `promo_title` on the `Collection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "promo_description",
DROP COLUMN "promo_images",
DROP COLUMN "promo_title";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "collection_image",
DROP COLUMN "description",
DROP COLUMN "promo_description",
DROP COLUMN "promo_images",
DROP COLUMN "promo_title";
